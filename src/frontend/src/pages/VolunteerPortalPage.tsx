import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Volunteer } from "../backend";
import { TaskPriority, TaskStatus } from "../backend";
import { useListAnnouncements, useListTasks } from "../hooks/useQueries";

interface Props {
  volunteer: Volunteer;
  onLogout: () => void;
}

const statusLabel: Record<string, string> = {
  [TaskStatus.pending]: "Pending",
  [TaskStatus.inProgress]: "In Progress",
  [TaskStatus.completed]: "Completed",
};

const statusVariant: Record<string, "secondary" | "default" | "outline"> = {
  [TaskStatus.pending]: "secondary",
  [TaskStatus.inProgress]: "default",
  [TaskStatus.completed]: "outline",
};

const priorityLabel: Record<string, string> = {
  [TaskPriority.low]: "Low",
  [TaskPriority.medium]: "Medium",
  [TaskPriority.high]: "High",
};

const priorityColor: Record<string, string> = {
  [TaskPriority.low]: "bg-green-100 text-green-700",
  [TaskPriority.medium]: "bg-yellow-100 text-yellow-700",
  [TaskPriority.high]: "bg-red-100 text-red-700",
};

type AttendanceEntry = { date: string; status: "present" | "absent" };

function getSelfAttendance(name: string): AttendanceEntry[] {
  try {
    const store: Record<string, AttendanceEntry[]> = JSON.parse(
      localStorage.getItem("volunteer_self_attendance") ?? "{}",
    );
    return store[name] ?? [];
  } catch {
    return [];
  }
}

function saveSelfAttendance(name: string, entries: AttendanceEntry[]) {
  try {
    const store: Record<string, AttendanceEntry[]> = JSON.parse(
      localStorage.getItem("volunteer_self_attendance") ?? "{}",
    );
    store[name] = entries;
    localStorage.setItem("volunteer_self_attendance", JSON.stringify(store));
  } catch {
    // ignore
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function VolunteerPortalPage({ volunteer, onLogout }: Props) {
  const { data: allTasks, isLoading: tasksLoading } = useListTasks();
  const { data: announcements, isLoading: announcementsLoading } =
    useListAnnouncements();

  const myTasks = (allTasks ?? []).filter(
    (t) => t.assignedTo.toLowerCase() === volunteer.name.toLowerCase(),
  );

  const [attendance, setAttendance] = useState<AttendanceEntry[]>(() =>
    getSelfAttendance(volunteer.name),
  );

  const presentCount = attendance.filter((e) => e.status === "present").length;
  const absentCount = attendance.filter((e) => e.status === "absent").length;

  const todayEntry = useMemo(
    () => attendance.find((e) => e.date === todayStr()),
    [attendance],
  );

  function markAttendance(status: "present" | "absent") {
    const today = todayStr();
    setAttendance((prev) => {
      const filtered = prev.filter((e) => e.date !== today);
      const updated = [{ date: today, status }, ...filtered].sort((a, b) =>
        b.date.localeCompare(a.date),
      );
      saveSelfAttendance(volunteer.name, updated);
      return updated;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-30 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-60">Social Work Manager</p>
            <p className="font-semibold text-sm">{volunteer.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-ocid="volunteer_portal.button"
            onClick={onLogout}
            className="border-sidebar-border text-sidebar-foreground bg-transparent hover:bg-sidebar-accent gap-1.5"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card data-ocid="volunteer_portal.card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User size={16} className="text-primary" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User size={14} />
                <span className="font-medium text-foreground">
                  {volunteer.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={14} />
                <span>{volunteer.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                <span>{volunteer.location || "—"}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={volunteer.status ? "default" : "secondary"}>
                  {volunteer.status ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          <Card data-ocid="volunteer_portal.attendance.card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck size={16} className="text-primary" />
                My Attendance
                {todayEntry && (
                  <Badge
                    variant="outline"
                    className={
                      todayEntry.status === "present"
                        ? "ml-auto bg-green-100 text-green-700 border-green-200 text-xs"
                        : "ml-auto bg-red-100 text-red-700 border-red-200 text-xs"
                    }
                  >
                    Today:{" "}
                    {todayEntry.status === "present" ? "Present ✓" : "Absent ✗"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Mark Attendance Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  data-ocid="volunteer_portal.attendance.present.button"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1.5"
                  onClick={() => markAttendance("present")}
                  disabled={todayEntry?.status === "present"}
                >
                  ✓ Mark Present
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="volunteer_portal.attendance.absent.button"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 gap-1.5"
                  onClick={() => markAttendance("absent")}
                  disabled={todayEntry?.status === "absent"}
                >
                  ✗ Mark Absent
                </Button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">
                    {presentCount}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">Days Present</p>
                </div>
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
                  <p className="text-2xl font-bold text-red-700">
                    {absentCount}
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">Days Absent</p>
                </div>
              </div>

              {/* History */}
              {attendance.length === 0 ? (
                <div
                  data-ocid="volunteer_portal.attendance.empty_state"
                  className="text-center py-6 text-muted-foreground text-sm"
                >
                  <CalendarCheck
                    size={28}
                    className="mx-auto mb-2 opacity-30"
                  />
                  No attendance records yet. Mark your attendance above.
                </div>
              ) : (
                <ScrollArea className="h-40">
                  <div className="space-y-1.5 pr-2">
                    {attendance.map((e, i) => (
                      <div
                        key={e.date}
                        data-ocid={`volunteer_portal.attendance.item.${i + 1}`}
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
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* My Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" />
                My Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="space-y-3" data-ocid="tasks.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : myTasks.length === 0 ? (
                <div
                  data-ocid="tasks.empty_state"
                  className="text-center py-8 text-muted-foreground text-sm"
                >
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                  No tasks assigned to you yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {myTasks.map((task, idx) => (
                    <div
                      key={String(task.id)}
                      data-ocid={`tasks.item.${idx + 1}`}
                      className="border border-border rounded-xl p-3 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-foreground">
                          {task.title}
                        </p>
                        <Badge
                          variant={statusVariant[task.status] ?? "secondary"}
                          className="shrink-0 text-xs"
                        >
                          {statusLabel[task.status] ?? task.status}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${priorityColor[task.priority] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {priorityLabel[task.priority] ?? task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell size={16} className="text-primary" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="announcements.loading_state"
                >
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : (announcements ?? []).length === 0 ? (
                <div
                  data-ocid="announcements.empty_state"
                  className="text-center py-8 text-muted-foreground text-sm"
                >
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  No announcements yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {(announcements ?? []).map((ann, idx) => (
                    <div
                      key={String(ann.id)}
                      data-ocid={`announcements.item.${idx + 1}`}
                      className="border border-border rounded-xl p-3 space-y-1"
                    >
                      <p className="font-medium text-sm text-foreground">
                        {ann.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ann.content}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-60">
                        <Clock size={11} />
                        {new Date(
                          Number(ann.timestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </main>
    </div>
  );
}
