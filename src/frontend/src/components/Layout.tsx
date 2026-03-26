import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Megaphone,
  Menu,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Page = "dashboard" | "volunteers" | "tasks" | "map" | "announcements";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  adminName: string;
  children: React.ReactNode;
}

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "volunteers" as Page, label: "Volunteers", icon: Users },
  { id: "tasks" as Page, label: "Tasks", icon: ClipboardList },
  { id: "map" as Page, label: "Map View", icon: MapIcon },
  { id: "announcements" as Page, label: "Announcements", icon: Megaphone },
];

export default function Layout({
  currentPage,
  onNavigate,
  adminName,
  children,
}: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const qc = useQueryClient();

  const handleLogout = async () => {
    await clear();
    qc.clear();
  };

  const pageTitles: Record<Page, string> = {
    dashboard: "Dashboard",
    volunteers: "Volunteers",
    tasks: "Tasks",
    map: "Map View",
    announcements: "Announcements",
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">
              SW
            </span>
          </div>
          <span className="text-sidebar-foreground font-bold text-base tracking-tight">
            SWM
          </span>
        </div>
        <p className="text-xs mt-1 opacity-50 text-sidebar-foreground">
          Social Work Manager
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && (
                <ChevronRight size={14} className="ml-auto opacity-70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              {adminName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">
              {adminName}
            </p>
            <p className="text-xs opacity-50 text-sidebar-foreground">Admin</p>
          </div>
        </div>
        <Button
          data-ocid="nav.logout.button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground opacity-70 hover:opacity-100"
        >
          <LogOut size={14} />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col bg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-60 bg-sidebar z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            type="button"
            data-ocid="nav.menu.toggle"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {pageTitles[currentPage]}
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={18} className="text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[9px] bg-destructive text-destructive-foreground">
              3
            </Badge>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {adminName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-foreground">
                {adminName}
              </p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
