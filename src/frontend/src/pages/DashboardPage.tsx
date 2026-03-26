import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Megaphone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { TaskPriority, TaskStatus } from "../backend";
import {
  useDashboardStats,
  useListTasks,
  useListVolunteers,
} from "../hooks/useQueries";

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: number | bigint;
  accent: string;
  loading?: boolean;
}) {
  return (
    <Card className="shadow-card border-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}
          >
            <Icon size={18} className="text-white" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-16 mb-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground">{String(value)}</p>
        )}
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}

function statusPill(status: TaskStatus) {
  const map: Record<TaskStatus, { label: string; className: string }> = {
    [TaskStatus.pending]: {
      label: "Pending",
      className: "bg-warning/15 text-warning-foreground border-warning/20",
    },
    [TaskStatus.inProgress]: {
      label: "In Progress",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    [TaskStatus.completed]: {
      label: "Completed",
      className: "bg-success/15 text-success border-success/20",
    },
  };
  const s = map[status];
  return (
    <Badge variant="outline" className={`text-xs ${s.className}`}>
      {s.label}
    </Badge>
  );
}

function priorityPill(priority: TaskPriority) {
  const map: Record<TaskPriority, { label: string; className: string }> = {
    [TaskPriority.low]: {
      label: "Low",
      className: "bg-muted text-muted-foreground",
    },
    [TaskPriority.medium]: {
      label: "Medium",
      className: "bg-warning/15 text-warning-foreground",
    },
    [TaskPriority.high]: {
      label: "High",
      className: "bg-destructive/10 text-destructive",
    },
  };
  const p = map[priority];
  return <Badge className={`text-xs ${p.className}`}>{p.label}</Badge>;
}

export default function DashboardPage({
  onNavigate,
}: { onNavigate: (page: any) => void }) {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: tasks, isLoading: tasksLoading } = useListTasks();
  const { data: volunteers } = useListVolunteers();

  const recentTasks = tasks?.slice(0, 5) ?? [];
  const activeVolunteers = volunteers?.filter((v) => v.status) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground">Welcome back 👋</h2>
        <p className="text-sm text-muted-foreground">
          Here's what's happening in your organization
        </p>
      </div>

      <div
        data-ocid="dashboard.section"
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
      >
        <StatCard
          icon={Users}
          label="Volunteers"
          value={stats?.volunteerCount ?? 0n}
          accent="bg-primary"
          loading={statsLoading}
        />
        <StatCard
          icon={ClipboardList}
          label="Total Tasks"
          value={stats?.taskCount ?? 0n}
          accent="bg-chart-5"
          loading={statsLoading}
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats?.pendingTasks ?? 0n}
          accent="bg-warning"
          loading={statsLoading}
        />
        <StatCard
          icon={AlertCircle}
          label="In Progress"
          value={stats?.inProgressTasks ?? 0n}
          accent="bg-chart-1"
          loading={statsLoading}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats?.completedTasks ?? 0n}
          accent="bg-success"
          loading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Recent Tasks
              </CardTitle>
              <button
                type="button"
                data-ocid="dashboard.tasks.link"
                onClick={() => onNavigate("tasks")}
                className="text-xs text-primary hover:underline"
              >
                View all →
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {tasksLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div
                data-ocid="dashboard.tasks.empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No tasks yet</p>
              </div>
            ) : (
              <div data-ocid="dashboard.tasks.list" className="space-y-2">
                {recentTasks.map((task, i) => (
                  <div
                    key={String(task.id)}
                    data-ocid={`dashboard.tasks.item.${i + 1}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {task.assignedTo}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {priorityPill(task.priority)}
                      {statusPill(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Active Volunteers
              </CardTitle>
              <button
                type="button"
                data-ocid="dashboard.volunteers.link"
                onClick={() => onNavigate("volunteers")}
                className="text-xs text-primary hover:underline"
              >
                View all →
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {activeVolunteers.length === 0 ? (
              <div
                data-ocid="dashboard.volunteers.empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No active volunteers</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeVolunteers.slice(0, 5).map((v, i) => (
                  <div
                    key={String(v.id)}
                    data-ocid={`dashboard.volunteers.item.${i + 1}`}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-muted/40"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {v.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {v.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {v.location}
                      </p>
                    </div>
                    <Badge
                      className="text-xs bg-success/15 text-success border-success/20"
                      variant="outline"
                    >
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-0">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-chart-5/20 flex items-center justify-center">
            <Megaphone size={18} className="text-chart-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Total Announcements
            </p>
            <p className="text-xs text-muted-foreground">Posted by admin</p>
          </div>
          <span className="text-2xl font-bold text-foreground">
            {String(stats?.announcementCount ?? 0n)}
          </span>
          <button
            type="button"
            data-ocid="dashboard.announcements.link"
            onClick={() => onNavigate("announcements")}
            className="text-xs text-primary hover:underline"
          >
            View →
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
