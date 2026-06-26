import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import type { ActivityLog } from "../mock/attendanceData";
import { AUTH_KEYS, EVENT_SESSION_ID, ROUTES } from "../constants";
import { toast } from "sonner";
import { useAttendees, useCheckIn, useDashboardStats } from "../queries/attendanceQueries";
import type { Attendee, QrPayload } from "../types";
import { logger } from "../lib/logger";

import AppShell from "../components/dashboard/AppShell";
import MetricGrid from "../components/dashboard/MetricGrid";
import AttendanceLogsCard from "../components/dashboard/AttendanceLogsCard";
import ScannerOverlay from "../components/dashboard/ScannerOverlay";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "NA";

const formatTime = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const dashboardRequestParams = {
  source: "WEB",
};

const firstMetricValue = (
  values: Array<number | string | undefined>,
  fallback: string | number = "-",
) => values.find((value) => value !== undefined && value !== null && value !== "") ?? fallback;

const formatCount = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return typeof value === "number" ? value.toLocaleString() : value;
};

const formatRate = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
  }

  return value.includes("%") ? value : `${value}%`;
};

const attendeeToLog = (attendee: Attendee, index: number): ActivityLog => {
  const name = attendee.fullName || "Unknown Attendee";
  const childName =
    attendee.youthName || (attendee.attendeeRole === "YOUTH" ? attendee.fullName : undefined);
  const status = attendee.hasCheckedIn
    ? "Present"
    : attendee.attendanceStatus?.toLowerCase() === "late"
      ? "Late"
      : "Success";

  return {
    id: String(
      attendee.pass?.passId ??
        [attendee.attendeeId ?? attendee.id ?? name, attendee.pass?.eventSessionId, index]
          .filter(Boolean)
          .join("-"),
    ),
    name,
    phone: attendee.phoneE164 || attendee.phoneNumber || attendee.fatherPhone,
    childName,
    area: attendee.residentialSuburb,
    initials: getInitials(name),
    avatarBg: "bg-primary-fixed text-on-primary-fixed",
    session: attendee.standard || attendee.residentialSuburb || "Registered attendee",
    time: formatTime(attendee.createdAt),
    status,
  };
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const hasValidSessionId =
    Boolean(EVENT_SESSION_ID) && EVENT_SESSION_ID !== "replace-with-session-id-from-backend-logs";
  const checkInMutation = useCheckIn();
  const dashboardQuery = useDashboardStats(
    EVENT_SESSION_ID,
    hasValidSessionId,
    dashboardRequestParams,
  );
  const attendanceLogsQuery = useAttendees(EVENT_SESSION_ID, hasValidSessionId, 'PRESENT');

  // Extra logs from scans are kept locally until backend exposes attendance-record list.
  const [scanLogs, setScanLogs] = useState<ActivityLog[]>([]);

  // Client-side search and refresh states
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Client-side pagination state - showing 25 records per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Scanner Simulator States
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerScanning, setScannerScanning] = useState(false);
  const [scannerSuccessName, setScannerSuccessName] = useState("");

  const attendeeLogs = useMemo(
    () => (attendanceLogsQuery.data ?? []).map(attendeeToLog),
    [attendanceLogsQuery.data],
  );
  const logs = useMemo(() => [...scanLogs, ...attendeeLogs], [scanLogs, attendeeLogs]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.ROLE);
    toast.success("Signed out successfully.");
    navigate(ROUTES.LOGIN);
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    toast.promise(
      Promise.all([attendanceLogsQuery.refetch(), dashboardQuery.refetch()]).finally(() =>
        setIsRefreshing(false),
      ),
      {
      loading: "Refreshing attendance records...",
      success: () => {
        setSearchQuery("");
        setCurrentPage(1);
        return "Attendance logs updated successfully.";
      },
      error: "Failed to refresh records.",
    });
  }, [attendanceLogsQuery, dashboardQuery]);

  // Trigger Scanner View
  const handleOpenScanner = useCallback(() => {
    setScannerOpen(true);
    setScannerScanning(true);
    setScannerSuccessName("");
  }, []);

  const getScannerDeviceId = () => {
    const storageKey = "scanner_device_id";
    const existingId = localStorage.getItem(storageKey);

    if (existingId) {
      return existingId;
    }

    const newId = `web-${crypto.randomUUID()}`;
    localStorage.setItem(storageKey, newId);
    return newId;
  };

  const parseQrTicket = (decodedText: string): { payload: QrPayload; signature: string } => {
    logger.info("[Dashboard Scanner] Raw QR text detected", decodedText);
    const parsed = JSON.parse(decodedText);

    if (
      !parsed?.payload?.pid ||
      !parsed.payload.aid ||
      !parsed.payload.sid ||
      !parsed.signature
    ) {
      throw new Error("QR code is not a valid attendance ticket.");
    }

    return {
      payload: parsed.payload,
      signature: parsed.signature,
    };
  };

  // Handle actual QR code detection
  const handleScanSuccess = async (decodedText: string) => {
    let ticket: { payload: QrPayload; signature: string };

    try {
      ticket = parseQrTicket(decodedText);
      logger.info("[Dashboard Scanner] Parsed QR ticket", {
        passId: ticket.payload.pid,
        attendeeId: ticket.payload.aid,
        sessionId: ticket.payload.sid,
        expiresAt: ticket.payload.exp,
        hasSignature: Boolean(ticket.signature),
      });
    } catch (error) {
      logger.error("[Dashboard Scanner] Invalid QR code", error);
      setScannerScanning(false);
      toast.error("Invalid QR code", {
        description: error instanceof Error ? error.message : "Unable to read ticket data.",
      });
      return;
    }

    setScannerSuccessName("Verifying ticket");
    setScannerScanning(false);

    toast.info("QR Code Detected", {
      description: "Verifying ticket with backend...",
    });

    checkInMutation.mutate(
      {
        payload: ticket.payload,
        signature: ticket.signature,
        scannerDeviceId: getScannerDeviceId(),
        deviceScanId: crypto.randomUUID(),
        source: "web_scanner",
      },
      {
        onSuccess: (response) => {
          logger.info("[Dashboard Scanner] Check-in success", response);
          const attendeeName = response.attendeeName || `Attendee ${ticket.payload.aid}`;
          const initials = attendeeName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);

          const newLog: ActivityLog = {
            id: crypto.randomUUID(),
            name: attendeeName,
            initials,
            avatarBg:
              "bg-tertiary-fixed-dim/20 text-on-tertiary-container border border-on-tertiary-container/15",
            session: `Session ${ticket.payload.sid}`,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "Present",
          };

          setScanLogs((prev) => [newLog, ...prev]);
          setScannerSuccessName(attendeeName);
          setScannerOpen(false);
          dashboardQuery.refetch();
          attendanceLogsQuery.refetch();

          toast.success("Attendance Recorded", {
            description: response.message || `${attendeeName} marked present.`,
          });
        },
        onError: (error) => {
          logger.error("[Dashboard Scanner] Check-in failed", error);
          setScannerSuccessName("");
          toast.error("Check-in failed", {
            description: error.message || "Backend rejected this QR ticket.",
          });
        },
      },
    );
  };

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return logs;
    }

    return logs.filter(
      (log) =>
        log.name.toLowerCase().includes(query) ||
        log.session.toLowerCase().includes(query),
    );
  }, [logs, searchQuery]);

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Get current logs slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedLogs = useMemo(
    () => filteredLogs.slice(startIndex, endIndex),
    [endIndex, filteredLogs, startIndex],
  );

  const dashboardMetrics = useMemo(() => {
    const stats = dashboardQuery.data;
    const totalRegistered = firstMetricValue([
      stats?.totalRegistered,
      stats?.registeredCount,
      stats?.totalAttendees,
      stats?.totalYouth,
      stats?.total,
    ]);
    const presentToday = firstMetricValue([
      stats?.presentToday,
      stats?.presentCount,
      stats?.checkedInCount,
      stats?.present,
    ]);
    const attendanceRate = firstMetricValue([
      stats?.attendanceRate,
      stats?.attendancePercentage,
      stats?.rate,
    ]);

    return {
      totalRegistered: formatCount(totalRegistered),
      presentToday: formatCount(presentToday),
      attendanceRate: formatRate(attendanceRate),
    };
  }, [dashboardQuery.data]);

  const handleLogSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <AppShell onLogout={handleLogout}>
        {/* Dashboard Panels */}
        <main className="flex-1 px-margin-mobile md:px-8 py-6 w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in">
          {/* Header and export report */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary tracking-tight font-sans">
                Overview
              </h2>
              <p className="text-body-sm text-on-surface-variant mt-1 font-sans">
                Real-time attendance metrics and updates.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(ROUTES.NEW_ATTENDEE)}
                className="items-center gap-2"
              >
                <Plus className="w-4.5 h-4.5" />
                Register Attendee
              </Button>
            </div>
          </div>

          {/* KPI Summary Bento Grid */}
          <MetricGrid
            totalRegistered={dashboardMetrics.totalRegistered}
            presentToday={dashboardMetrics.presentToday}
            attendanceRate={dashboardMetrics.attendanceRate}
          />

          {/* Quick Actions (Mobile emphasis, hidden on desktop) */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            <button
              onClick={handleOpenScanner}
              className="bg-linear-to-br from-secondary to-on-secondary-fixed-variant text-on-secondary rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 shadow-sm shadow-secondary/25 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <ScanLine className="w-6 h-6 text-on-secondary" />
              <span className="font-sans text-label-md font-bold">Scan QR</span>
            </button>
            <button
              onClick={() => navigate(ROUTES.NEW_ATTENDEE)}
              className="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 shadow-xs active:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-6 h-6 text-secondary" />
              <span className="font-sans text-label-md font-bold">
                Register
              </span>
            </button>
          </div>

          {/* Attendance Log Table Card (Pagination & Search) */}
          <AttendanceLogsCard
            logs={paginatedLogs}
            searchQuery={searchQuery}
            onSearchChange={handleLogSearchChange}
            isRefreshing={isRefreshing || attendanceLogsQuery.isFetching}
            onRefresh={handleRefresh}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />
        </main>

      {/* FAB (Floating Action Button) for Desktop (Scan QR Code shortcut) */}
      <button
        onClick={handleOpenScanner}
        className="hidden md:flex fixed bottom-8 right-8 w-16 h-16 bg-linear-to-br from-secondary to-on-secondary-fixed-variant text-on-secondary rounded-2xl items-center justify-center shadow-lg shadow-secondary/35 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/40 transition-all duration-200 z-30 cursor-pointer active:scale-95"
        title="Open QR Scanner"
      >
        <ScanLine className="w-7 h-7 text-on-secondary animate-pulse" />
      </button>

      {/* FULL-SCREEN CAMERA VIEW QR CODE SCANNER OVERLAY */}
      <ScannerOverlay
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onManualEntry={() => navigate(ROUTES.ATTENDEES_LIST)}
        isScanning={scannerScanning}
        successName={scannerSuccessName}
        onScanSuccess={handleScanSuccess}
      />

    </AppShell>
  );
};

export default Dashboard;
