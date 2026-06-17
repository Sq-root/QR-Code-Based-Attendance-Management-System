import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ScanLine, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { mockLogs } from "../mock/attendanceData";
import type { ActivityLog } from "../mock/attendanceData";
import { AUTH_KEYS, ROUTES } from "../constants";
import { toast } from "sonner";

// Import newly refactored subcomponents
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import MobileHeader from "../components/dashboard/MobileHeader";
import MetricGrid from "../components/dashboard/MetricGrid";
import AttendanceLogsCard from "../components/dashboard/AttendanceLogsCard";
import ScannerOverlay from "../components/dashboard/ScannerOverlay";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dynamic logs state to allow scanning to add new records
  const [logs, setLogs] = useState<ActivityLog[]>(mockLogs);

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

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.ROLE);
    toast.success("Signed out successfully.");
    navigate(ROUTES.LOGIN);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Refreshing attendance records...",
      success: () => {
        setIsRefreshing(false);
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

  // Handle actual QR code detection
  const handleScanSuccess = (decodedText: string) => {
    // Determine the name from the decoded QR Code text
    const luckyName = decodedText.trim() || "Unknown Attendee";

    setScannerSuccessName(luckyName);
    setScannerScanning(false);

    toast.success("QR Code Detected", {
      description: `Verifying presence for ${luckyName}...`,
    });

    // Confirm verification after a brief delay for UX
    setTimeout(() => {
      const initials = luckyName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      // Add scanned attendee to logs
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        name: luckyName,
        initials: initials,
        avatarBg:
          "bg-tertiary-fixed-dim/20 text-on-tertiary-container border border-on-tertiary-container/15",
        session: "Afternoon Workshop - Hall B",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Success",
      };

      setLogs((prev) => [newLog, ...prev]);
      setScannerOpen(false);

      toast.success("Attendance Recorded!", {
        description: `${luckyName} marked Present.`,
      });
    }, 1000);
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
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:flex items-center gap-2 border border-outline-variant hover:bg-surface-container transition-all"
            >
              <Download className="w-4.5 h-4.5" />
              Download Report
            </Button>
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
              onClick={() => toast.info("Manual check-in interface triggered.")}
              className="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-xs active:bg-surface-container-low transition-colors cursor-pointer"
            >
              <Plus className="w-6 h-6 text-secondary" />
              <span className="font-sans text-label-md font-bold">
                Manual Entry
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
            isRefreshing={isRefreshing}
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
