import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";

export default function ProfileSetupModal({ open }: { open: boolean }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { actor } = useActor();
  const qc = useQueryClient();

  const handleSave = async () => {
    if (!name.trim() || !actor) return;
    setSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: name.trim() });
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        data-ocid="profile.setup.modal"
        className="max-w-sm"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Set Up Your Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="admin-name">Your Name</Label>
            <Input
              data-ocid="profile.name.input"
              id="admin-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <Button
            data-ocid="profile.save.button"
            className="w-full"
            onClick={handleSave}
            disabled={!name.trim() || saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Get Started"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
