import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Loader2,
  Map as MapIcon,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  onVolunteerLogin?: () => void;
}

export default function LoginPage({ onVolunteerLogin }: Props) {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center">
        {/* Left — branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-sidebar-foreground"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-xl">
                SW
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-foreground">
                Social Work Manager
              </h1>
              <p className="text-sm opacity-60">Admin &amp; Volunteer Portal</p>
            </div>
          </div>
          <p className="text-sidebar-foreground opacity-70 text-base mb-8 max-w-sm">
            Manage volunteers, track field activities, and coordinate social
            welfare programs from one place.
          </p>
          <div className="space-y-4">
            {[
              {
                icon: Users,
                label: "Volunteer Management",
                desc: "Track and coordinate volunteers",
              },
              {
                icon: ClipboardList,
                label: "Task Tracking",
                desc: "Assign and monitor field tasks",
              },
              {
                icon: MapIcon,
                label: "GPS Map View",
                desc: "Real-time location overview",
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                  <Icon
                    size={16}
                    className="text-sidebar-foreground opacity-80"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {label}
                  </p>
                  <p className="text-xs opacity-50 text-sidebar-foreground">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — two login cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full md:w-80 space-y-4"
        >
          {/* Admin card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Admin Login
                </h2>
                <p className="text-xs text-muted-foreground">
                  Full control panel access
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/60 text-center mb-3">
              <p className="text-xs text-muted-foreground">
                Secure via Internet Identity
              </p>
            </div>
            <Button
              data-ocid="login.primary_button"
              className="w-full h-10 text-sm font-semibold"
              onClick={() => login()}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign In as Admin"
              )}
            </Button>
          </div>

          {/* Volunteer card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <UserCheck size={20} className="text-green-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Volunteer Login
                </h2>
                <p className="text-xs text-muted-foreground">
                  View your tasks &amp; updates
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Registered volunteers can log in with their name to view assigned
              tasks and announcements.
            </p>
            <Button
              data-ocid="login.volunteer_button"
              variant="outline"
              className="w-full h-10 text-sm font-semibold border-green-200 text-green-700 hover:bg-green-50"
              onClick={onVolunteerLogin}
            >
              Login as Volunteer
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
