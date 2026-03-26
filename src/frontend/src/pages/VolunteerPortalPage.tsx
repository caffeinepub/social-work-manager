import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
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

export default function VolunteerPortalPage({ volunteer, onLogout }: Props) {
  const { data: allTasks, isLoading: tasksLoading } = useListTasks();
  const { data: announcements, isLoading: announcementsLoading } =
    useListAnnouncements();

  const myTasks = (allTasks ?? []).filter(
    (t) => t.assignedTo.toLowerCase() === volunteer.name.toLowerCase(),
  );

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

        {/* My Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
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
          transition={{ duration: 0.35, delay: 0.2 }}
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
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">
                          {ann.title}
                        </p>
                      </div>
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
