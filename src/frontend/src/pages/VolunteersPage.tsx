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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  CalendarCheck,
  CreditCard,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Printer,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Volunteer } from "../backend";
import VolunteerCard from "../components/VolunteerCard";
import {
  useAddVolunteer,
  useDeleteVolunteer,
  useListVolunteers,
} from "../hooks/useQueries";

type VolunteerWithId = Volunteer & { id: bigint };

// ---------- Card override storage ----------
interface CardOverride {
  designation?: string;
  name?: string;
  phone?: string;
  location?: string;
  status?: boolean;
}

const cardKey = (id: string) => `volunteer_card_${id}`;

function loadCardOverride(id: string): CardOverride {
  try {
    return JSON.parse(localStorage.getItem(cardKey(id)) ?? "{}");
  } catch {
    return {};
  }
}

function saveCardOverride(id: string, data: CardOverride) {
  localStorage.setItem(cardKey(id), JSON.stringify(data));
}

// ---------- Attendance helpers ----------
type AttendanceStatus = "present" | "absent";
interface AttendanceEntry {
  date: string;
  status: AttendanceStatus;
}
type AttendanceStore = Record<string, AttendanceEntry[]>;

const STORAGE_KEY = "volunteer_attendance";

function loadAttendance(): AttendanceStore {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveAttendance(store: AttendanceStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getVolunteerAttendance(id: string): AttendanceEntry[] {
  return loadAttendance()[id] ?? [];
}

function markAttendance(id: string, status: AttendanceStatus) {
  const store = loadAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const entries = (store[id] ?? []).filter((e) => e.date !== today);
  entries.unshift({ date: today, status });
  store[id] = entries;
  saveAttendance(store);
}

function todayStatus(id: string): AttendanceStatus | null {
  const today = new Date().toISOString().slice(0, 10);
  const entry = getVolunteerAttendance(id).find((e) => e.date === today);
  return entry?.status ?? null;
}

// ---------- Attendance Dialog ----------
function AttendanceDialog({ volunteer }: { volunteer: VolunteerWithId }) {
  const id = String(volunteer.id);
  const today = new Date().toISOString().slice(0, 10);
  const [, forceUpdate] = useState(0);

  const refresh = () => forceUpdate((n) => n + 1);
  const entries = getVolunteerAttendance(id);
  const currentToday = entries.find((e) => e.date === today);

  const handle = (status: AttendanceStatus) => {
    markAttendance(id, status);
    refresh();
    toast.success(`Marked ${status} for ${volunteer.name}`);
  };

  return (
    <DialogContent data-ocid="attendance.dialog" className="max-w-sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarCheck size={17} className="text-primary" />
          Attendance — {volunteer.name}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Today */}
        <div className="rounded-xl border border-border p-4 bg-muted/30 space-y-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Today
            </p>
            <p className="font-semibold text-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {currentToday && (
            <div className="text-center">
              <Badge
                className={
                  currentToday.status === "present"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }
                variant="outline"
              >
                {currentToday.status === "present" ? "✓ Present" : "✗ Absent"}
              </Badge>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              data-ocid="attendance.present.button"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              onClick={() => handle("present")}
            >
              ✓ Mark Present
            </Button>
            <Button
              data-ocid="attendance.absent.button"
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              size="sm"
              onClick={() => handle("absent")}
            >
              ✗ Mark Absent
            </Button>
          </div>
        </div>

        {/* History */}
        {entries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              History
            </p>
            <ScrollArea className="h-44">
              <div className="space-y-1.5 pr-2">
                {entries.map((e, i) => (
                  <div
                    key={e.date}
                    data-ocid={`attendance.item.${i + 1}`}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40"
                  >
                    <span className="text-sm text-foreground">
                      {new Date(e.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        e.status === "present"
                          ? "bg-green-100 text-green-700 border-green-200 text-xs"
                          : "bg-red-100 text-red-700 border-red-200 text-xs"
                      }
                    >
                      {e.status === "present" ? "Present" : "Absent"}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

// ---------- Card Dialog ----------
function CardDialog({ volunteer }: { volunteer: VolunteerWithId }) {
  const id = String(volunteer.id);
  const [editMode, setEditMode] = useState(false);
  const [override, setOverride] = useState<CardOverride>(() =>
    loadCardOverride(id),
  );
  const [editForm, setEditForm] = useState<CardOverride>(() =>
    loadCardOverride(id),
  );

  const handleEdit = () => {
    setEditForm({ ...override });
    setEditMode(true);
  };

  const handleSave = () => {
    saveCardOverride(id, editForm);
    setOverride({ ...editForm });
    setEditMode(false);
    toast.success("Card updated successfully");
  };

  const handleCancel = () => {
    setEditForm({ ...override });
    setEditMode(false);
  };

  const handlePrint = () => {
    const el = document.getElementById("volunteer-card-print");
    if (!el) return;
    const html = `<!DOCTYPE html><html><head><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f0f0f0;}@media print{body{background:white;}}</style></head><body>${el.outerHTML}</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  return (
    <DialogContent data-ocid="card.dialog" className="max-w-sm">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={17} className="text-primary" />
            Volunteer Card
          </DialogTitle>
          {!editMode ? (
            <Button
              data-ocid="card.edit_button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-primary h-8"
              onClick={handleEdit}
            >
              <Pencil size={13} />
              Edit
            </Button>
          ) : (
            <Button
              data-ocid="card.cancel_button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground h-8"
              onClick={handleCancel}
            >
              <X size={13} />
              Cancel
            </Button>
          )}
        </div>
      </DialogHeader>

      <div className="flex flex-col items-center gap-4">
        {/* Card Preview */}
        <VolunteerCard
          volunteer={volunteer}
          designation={override.designation}
          overrideName={override.name}
          overridePhone={override.phone}
          overrideLocation={override.location}
          overrideStatus={override.status}
        />

        {/* Edit Form */}
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-3 border border-border rounded-xl p-4 bg-muted/20"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Edit Card Details
            </p>

            <div className="space-y-1">
              <Label htmlFor="card-designation" className="text-xs">
                Designation
              </Label>
              <Input
                data-ocid="card.designation.input"
                id="card-designation"
                placeholder="e.g. Field Volunteer, Team Leader"
                value={editForm.designation ?? ""}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, designation: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="card-name" className="text-xs">
                Name
              </Label>
              <Input
                data-ocid="card.name.input"
                id="card-name"
                placeholder={volunteer.name}
                value={editForm.name ?? volunteer.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="card-phone" className="text-xs">
                Phone
              </Label>
              <Input
                data-ocid="card.phone.input"
                id="card-phone"
                placeholder={volunteer.phone}
                value={editForm.phone ?? volunteer.phone}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="card-location" className="text-xs">
                Location
              </Label>
              <Input
                data-ocid="card.location.input"
                id="card-location"
                placeholder={volunteer.location}
                value={editForm.location ?? volunteer.location}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, location: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Active Status</Label>
              <Switch
                data-ocid="card.status.switch"
                checked={editForm.status ?? volunteer.status}
                onCheckedChange={(v) =>
                  setEditForm((p) => ({ ...p, status: v }))
                }
              />
            </div>

            <Button
              data-ocid="card.save_button"
              className="w-full h-8 text-sm"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </motion.div>
        )}

        {/* Print button */}
        {!editMode && (
          <Button
            data-ocid="card.print.button"
            className="w-full gap-2"
            onClick={handlePrint}
          >
            <Printer size={15} />
            Print / Download Card
          </Button>
        )}
      </div>
    </DialogContent>
  );
}

// ---------- Main Page ----------
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
  const [attendanceOpen, setAttendanceOpen] = useState<string | null>(null);
  const [cardOpen, setCardOpen] = useState<string | null>(null);
  const [pendingCardFor, setPendingCardFor] = useState<string | null>(null);

  // Auto-open card for newly added volunteer
  useEffect(() => {
    if (!pendingCardFor || !volunteers) return;
    const found = (volunteers as VolunteerWithId[]).find(
      (v) => v.name === pendingCardFor,
    );
    if (found) {
      setCardOpen(String(found.id));
      setPendingCardFor(null);
    }
  }, [volunteers, pendingCardFor]);

  const filtered = ((volunteers ?? []) as VolunteerWithId[]).filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    try {
      const name = form.name.trim();
      await addMutation.mutateAsync({
        name,
        phone: form.phone.trim(),
        location: form.location.trim(),
        status: form.status,
      });
      toast.success("Volunteer added! ID card ready.");
      setForm({ name: "", phone: "", location: "", status: true });
      setOpen(false);
      setPendingCardFor(name);
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

  const getAttendanceDot = (v: VolunteerWithId) => {
    const status = todayStatus(String(v.id));
    if (status === "present") return "bg-green-500";
    if (status === "absent") return "bg-red-500";
    return "bg-gray-300";
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
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  {/* Avatar + attendance dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {v.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getAttendanceDot(v)}`}
                      title="Today's attendance"
                    />
                  </div>

                  {/* Info */}
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

                  {/* Attendance button */}
                  <Dialog
                    open={attendanceOpen === String(v.id)}
                    onOpenChange={(o) =>
                      setAttendanceOpen(o ? String(v.id) : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        data-ocid={`volunteers.attendance.button.${i + 1}`}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-blue-600 flex-shrink-0"
                        title="Attendance"
                      >
                        <CalendarCheck size={15} />
                      </Button>
                    </DialogTrigger>
                    <AttendanceDialog volunteer={v} />
                  </Dialog>

                  {/* Card button */}
                  <Dialog
                    open={cardOpen === String(v.id)}
                    onOpenChange={(o) => setCardOpen(o ? String(v.id) : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        data-ocid={`volunteers.card.button.${i + 1}`}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary flex-shrink-0"
                        title="Volunteer Card"
                      >
                        <CreditCard size={15} />
                      </Button>
                    </DialogTrigger>
                    <CardDialog volunteer={v} />
                  </Dialog>

                  {/* Delete button */}
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
