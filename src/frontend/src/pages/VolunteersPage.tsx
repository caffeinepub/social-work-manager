import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddVolunteer,
  useDeleteVolunteer,
  useListVolunteers,
} from "../hooks/useQueries";

export default function VolunteersPage() {
  const { data: volunteers, isLoading } = useListVolunteers();
  const addMutation = useAddVolunteer();
  const deleteMutation = useDeleteVolunteer();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    status: true,
  });
  const [search, setSearch] = useState("");

  const filtered = (volunteers ?? []).filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    try {
      await addMutation.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        status: form.status,
      });
      toast.success("Volunteer added!");
      setForm({ name: "", phone: "", location: "", status: true });
      setOpen(false);
    } catch {
      toast.error("Failed to add volunteer");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Volunteer removed");
    } catch {
      toast.error("Failed to delete volunteer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          data-ocid="volunteers.search_input"
          placeholder="Search volunteers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="volunteers.open_modal_button" className="gap-2">
              <UserPlus size={16} />
              Add Volunteer
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="volunteers.dialog" className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Volunteer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="v-name">Full Name *</Label>
                <Input
                  data-ocid="volunteers.name.input"
                  id="v-name"
                  placeholder="Rajesh Kumar"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-phone">Phone Number</Label>
                <Input
                  data-ocid="volunteers.phone.input"
                  id="v-phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-location">Location / Village</Label>
                <Input
                  data-ocid="volunteers.location.input"
                  id="v-location"
                  placeholder="Pune, Maharashtra"
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active Status</Label>
                <Switch
                  data-ocid="volunteers.status.switch"
                  checked={form.status}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, status: v }))}
                />
              </div>
              <Button
                data-ocid="volunteers.submit_button"
                className="w-full"
                onClick={handleAdd}
                disabled={!form.name.trim() || addMutation.isPending}
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Add Volunteer
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users size={16} className="text-primary" />
            All Volunteers
            <Badge variant="secondary" className="ml-auto">
              {filtered.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div data-ocid="volunteers.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="volunteers.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <Users size={40} className="mx-auto mb-3 opacity-25" />
              <p className="text-sm font-medium">No volunteers found</p>
              <p className="text-xs mt-1">
                Add your first volunteer to get started
              </p>
            </div>
          ) : (
            <div data-ocid="volunteers.list" className="space-y-2">
              {filtered.map((v, i) => (
                <div
                  key={String(v.id)}
                  data-ocid={`volunteers.item.${i + 1}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {v.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {v.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {v.phone && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone size={10} />
                          {v.phone}
                        </span>
                      )}
                      {v.location && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin size={10} />
                          {v.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      v.status
                        ? "bg-success/15 text-success border-success/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {v.status ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    data-ocid={`volunteers.delete_button.${i + 1}`}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => handleDelete(v.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
