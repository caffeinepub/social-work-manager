import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Volunteer } from "../backend";
import { useListVolunteers } from "../hooks/useQueries";

interface Props {
  onLogin: (volunteer: Volunteer) => void;
  onBack: () => void;
}

export default function VolunteerLoginPage({ onLogin, onBack }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { data: volunteers, isLoading } = useListVolunteers();

  const handleLogin = () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    const found = (volunteers ?? []).find(
      (v) => v.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (!found) {
      toast.error("Volunteer not found. Please ask your admin.");
      return;
    }
    onLogin(found);
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="volunteer_login.link"
          className="flex items-center gap-1 text-sidebar-foreground opacity-60 hover:opacity-100 mb-6 text-sm transition-opacity"
        >
          <ArrowLeft size={16} />
          Back to login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserCheck size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Volunteer Login
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your registered name to continue
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="vol-name">Full Name</Label>
              <Input
                id="vol-name"
                data-ocid="volunteer_login.input"
                placeholder="Your registered name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vol-phone">Phone (optional)</Label>
              <Input
                id="vol-phone"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button
              data-ocid="volunteer_login.primary_button"
              className="w-full h-11 text-sm font-semibold"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                "Login as Volunteer"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
