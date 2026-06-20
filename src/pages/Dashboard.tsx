import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ScanLine, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import type { ActivityLog } from "../mock/attendanceData";
import { AUTH_KEYS, EVENT_SESSION_ID, ROUTES } from "../constants";
import { toast } from "sonner";
import { useAttendees, useCheckIn } from "../queries/attendanceQueries";
import type { Attendee, QrPayload } from "../types";

// Import newly refactored subcomponents
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import MobileHeader from "../components/dashboard/MobileHeader";
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

const attendeeToLog = (attendee: Attendee): ActivityLog => {
  const name = attendee.fullName || "Unknown Attendee";

  return {
    id: String(attendee.attendeeId ?? attendee.id ?? name),
    name,
    initials: getInitials(name),
    avatarBg: "bg-primary-fixed text-on-primary-fixed",
    session: attendee.standard || attendee.residentialSuburb || "Registered attendee",
    time: formatTime(attendee.createdAt),
    status: attendee.attendanceStatus?.toLowerCase() === "late" ? "Late" : "Success",
  };
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const hasValidSessionId =
    Boolean(EVENT_SESSION_ID) && EVENT_SESSION_ID !== "replace-with-session-id-from-backend-logs";
  const checkInMutation = useCheckIn(EVENT_SESSION_ID);
  const attendeesQuery = useAttendees(EVENT_SESSION_ID, hasValidSessionId);

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
    () => (attendeesQuery.data ?? []).map(attendeeToLog),
    [attendeesQuery.data],
  );
  const logs = useMemo(() => [...scanLogs, ...attendeeLogs], [scanLogs, attendeeLogs]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.ROLE);
    toast.success("Signed out successfully.");
    navigate(ROUTES.LOGIN);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.promise(attendeesQuery.refetch().finally(() => setIsRefreshing(false)), {
      loading: "Refreshing attendance records...",
      success: () => {
        setSearchQuery("");
        setCurrentPage(1);
        return "Attendance logs updated successfully.";
      },
      error: "Failed to refresh records.",
    });
  };

  // Trigger Scanner View
  const handleOpenScanner = () => {
    setScannerOpen(true);
    setScannerScanning(true);
    setScannerSuccessName("");
  };

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
    console.log("[Dashboard Scanner] Raw QR text detected", decodedText);
    const parsed = JSON.parse(decodedText);

    if (!parsed?.payload || !parsed?.signature) {
      throw new Error("QR code is not a valid attendance ticket.");
    }

    return {
      payload: parsed.payload,
      signature: parsed.signature,
    };
  };

  // Handle actual QR code detection
  const handleScanSuccess = async (decodedText: string) => {
    if (!hasValidSessionId) {
      setScannerScanning(false);
      toast.error("Session ID missing", {
        description: "Add VITE_EVENT_SESSION_ID in .env from backend logs.",
      });
      return;
    }

    let ticket: { payload: QrPayload; signature: string };

    try {
      ticket = parseQrTicket(decodedText);
      console.log("[Dashboard Scanner] Parsed QR ticket", {
        passId: ticket.payload.pid,
        attendeeId: ticket.payload.aid,
        sessionId: ticket.payload.sid,
        expiresAt: ticket.payload.exp,
        hasSignature: Boolean(ticket.signature),
      });
    } catch (error) {
      console.error("[Dashboard Scanner] Invalid QR code", error);
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
          console.log("[Dashboard Scanner] Check-in success", response);
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
            status: "Success",
          };

          setScanLogs((prev) => [newLog, ...prev]);
          setScannerSuccessName(attendeeName);
          setScannerOpen(false);

          toast.success("Attendance Recorded", {
            description: response.message || `${attendeeName} marked present.`,
          });
        },
        onError: (error) => {
          console.error("[Dashboard Scanner] Check-in failed", error);
          setScannerSuccessName("");
          toast.error("Check-in failed", {
            description: error.message || "Backend rejected this QR ticket.",
          });
        },
      },
    );
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter(
    (log) =>
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.session.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Get current logs slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

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
    <div className="bg-surface-container-low text-on-surface font-sans min-h-screen flex flex-col md:flex-row antialiased relative">
      {/* Sidebar Navigation Panel (Desktop Only - Clean Light Sidebar) */}
      <Sidebar onLogout={handleLogout} />

      {/* Top Header Bar for Mobile */}
      <MobileHeader onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Top Header Bar for Desktop */}
        <Header />

        {/* Dashboard Panels */}
        <main className="flex-1 px-margin-mobile md:px-8 py-6 w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in">
          {/* Header and export report */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary tracking-tight font-sans">
                Overview
              </h2>
              <p className="md:hidden text-body-sm text-on-surface-variant mt-0.5 font-sans">
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
              <Button
                variant="secondary"
                size="sm"
                className="items-center gap-2 border border-outline-variant hover:bg-surface-container transition-all"
              >
                <Download className="w-4.5 h-4.5" />
                Download Report
              </Button>
            </div>
          </div>

          {/* KPI Summary Bento Grid */}
          <MetricGrid
            totalRegistered="1,248"
            presentToday={
              logs.filter((l) => l.status === "Success").length + 958
            }
            attendanceRate="78.8%"
          />

          {/* Quick Actions (Mobile emphasis, hidden on desktop) */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            <button
              onClick={handleOpenScanner}
              className="bg-secondary text-on-secondary rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-xs active:opacity-90 transition-opacity cursor-pointer"
            >
              <ScanLine className="w-6 h-6 text-on-secondary" />
              <span className="font-sans text-label-md font-bold">Scan QR</span>
            </button>
            <button
              onClick={() => navigate(ROUTES.NEW_ATTENDEE)}
              className="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-xs active:bg-surface-container-low transition-colors cursor-pointer"
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
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            isRefreshing={isRefreshing || attendeesQuery.isFetching}
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
      </div>

      {/* FAB (Floating Action Button) for Desktop (Scan QR Code shortcut) */}
      <button
        onClick={handleOpenScanner}
        className="hidden md:flex fixed bottom-8 right-8 w-16 h-16 bg-secondary text-on-secondary rounded-2xl items-center justify-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 z-30 cursor-pointer active:scale-95"
        title="Open QR Scanner"
      >
        <ScanLine className="w-7 h-7 text-on-secondary animate-pulse" />
      </button>

      {/* FULL-SCREEN CAMERA VIEW QR CODE SCANNER OVERLAY */}
      <ScannerOverlay
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        isScanning={scannerScanning}
        successName={scannerSuccessName}
        onScanSuccess={handleScanSuccess}
      />

    </div>
  );
};

export default Dashboard;
