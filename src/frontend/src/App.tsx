import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { Volunteer } from "./backend";
import Layout from "./components/Layout";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import TasksPage from "./pages/TasksPage";
import VolunteerLoginPage from "./pages/VolunteerLoginPage";
import VolunteerPortalPage from "./pages/VolunteerPortalPage";
import VolunteersPage from "./pages/VolunteersPage";

const qc = new QueryClient();

type Page = "dashboard" | "volunteers" | "tasks" | "map" | "announcements";

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [showVolunteerLogin, setShowVolunteerLogin] = useState(false);
  const [volunteerSession, setVolunteerSession] = useState<Volunteer | null>(
    null,
  );

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && profileFetched && profile === null;
  const adminName = profile?.name ?? "Admin";

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Volunteer session active
  if (volunteerSession) {
    return (
      <VolunteerPortalPage
        volunteer={volunteerSession}
        onLogout={() => setVolunteerSession(null)}
      />
    );
  }

  // Not authenticated as admin
  if (!isAuthenticated) {
    if (showVolunteerLogin) {
      return (
        <VolunteerLoginPage
          onLogin={(v) => setVolunteerSession(v)}
          onBack={() => setShowVolunteerLogin(false)}
        />
      );
    }
    return <LoginPage onVolunteerLogin={() => setShowVolunteerLogin(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentPage} />;
      case "volunteers":
        return <VolunteersPage />;
      case "tasks":
        return <TasksPage />;
      case "map":
        return <MapPage />;
      case "announcements":
        return <AnnouncementsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      <Layout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        adminName={adminName}
      >
        {renderPage()}
      </Layout>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppInner />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
