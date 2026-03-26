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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ClipboardList, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TaskPriority, TaskStatus } from "../backend";
import {
  useAddTask,
  useDeleteTask,
  useListTasks,
  useUpdateTaskStatus,
} from "../hooks/useQueries";

function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; className: string }> = {
    [TaskStatus.pending]: {
      label: "Pending",
      className: "bg-warning/15 text-warning-foreground border-warning/30",
    },
    [TaskStatus.inProgress]: {
      label: "In Progress",
      className: "bg-primary/10 text-primary border-primary/30",
    },
    [TaskStatus.completed]: {
      label: "Completed",
      className: "bg-success/15 text-success border-success/30",
    },
  };
  const s = map[status];
  return (
    <Badge variant="outline" className={`text-xs ${s.className}`}>
      {s.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
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

const nextStatus: Partial<Record<TaskStatus, TaskStatus>> = {
  [TaskStatus.pending]: TaskStatus.inProgress,
  [TaskStatus.inProgress]: TaskStatus.completed,
};
const nextLabel: Partial<Record<TaskStatus, string>> = {
  [TaskStatus.pending]: "Start",
  [TaskStatus.inProgress]: "Complete",
};

export default function TasksPage() {
  const { data: tasks, isLoading } = useListTasks();
  const addMutation = useAddTask();
  const updateMutation = useUpdateTaskStatus();
  const deleteMutation = useDeleteTask();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: TaskPriority.medium,
    assignedTo: "",
  });

  const byStatus = {
    pending: (tasks ?? []).filter((t) => t.status === TaskStatus.pending),
    inProgress: (tasks ?? []).filter((t) => t.status === TaskStatus.inProgress),
    completed: (tasks ?? []).filter((t) => t.status === TaskStatus.completed),
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    try {
      await addMutation.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        assignedTo: form.assignedTo.trim(),
        status: TaskStatus.pending,
      });
      toast.success("Task added!");
      setForm({
        title: "",
        description: "",
        priority: TaskPriority.medium,
        assignedTo: "",
      });
      setOpen(false);
    } catch {
      toast.error("Failed to add task");
    }
  };

  const handleAdvance = async (id: bigint, status: TaskStatus) => {
    const next = nextStatus[status];
    if (!next) return;
    try {
      await updateMutation.mutateAsync({ id, status: next });
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const renderTaskList = (taskList: typeof tasks, tab: string) => {
    if (isLoading) {
      return (
        <div data-ocid="tasks.loading_state" className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }
    if (!taskList || taskList.length === 0) {
      return (
        <div
          data-ocid={`tasks.${tab}.empty_state`}
          className="text-center py-12 text-muted-foreground"
        >
          <ClipboardList size={40} className="mx-auto mb-3 opacity-25" />
          <p className="text-sm font-medium">No {tab} tasks</p>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {taskList.map((task, i) => (
          <div
            key={String(task.id)}
            data-ocid={`tasks.item.${i + 1}`}
            className="flex items-start gap-3 p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground">
                  {task.title}
                </p>
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              {task.assignedTo && (
                <p className="text-xs text-muted-foreground mt-1">
                  Assigned to:{" "}
                  <span className="font-medium">{task.assignedTo}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {nextStatus[task.status] && (
                <Button
                  data-ocid={`tasks.advance_button.${i + 1}`}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs h-7"
                  onClick={() => handleAdvance(task.id, task.status)}
                  disabled={updateMutation.isPending}
                >
                  {nextLabel[task.status]}
                  <ArrowRight size={12} />
                </Button>
              )}
              <Button
                data-ocid={`tasks.delete_button.${i + 1}`}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-7 w-7"
                onClick={() => handleDelete(task.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="tasks.open_modal_button" className="gap-2">
              <Plus size={16} /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="tasks.dialog" className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  data-ocid="tasks.title.input"
                  placeholder="Health camp in village"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  data-ocid="tasks.description.textarea"
                  placeholder="Brief description..."
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, priority: v as TaskPriority }))
                    }
                  >
                    <SelectTrigger data-ocid="tasks.priority.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskPriority.low}>Low</SelectItem>
                      <SelectItem value={TaskPriority.medium}>
                        Medium
                      </SelectItem>
                      <SelectItem value={TaskPriority.high}>High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assigned To</Label>
                  <Input
                    data-ocid="tasks.assigned.input"
                    placeholder="Volunteer name"
                    value={form.assignedTo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, assignedTo: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Button
                data-ocid="tasks.submit_button"
                className="w-full"
                onClick={handleAdd}
                disabled={!form.title.trim() || addMutation.isPending}
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Add Task
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ClipboardList size={16} className="text-primary" />
            Task List
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList data-ocid="tasks.filter.tab" className="mb-4">
              <TabsTrigger value="pending">
                Pending{" "}
                <Badge variant="secondary" className="ml-1.5 text-xs">
                  {byStatus.pending.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inProgress">
                In Progress{" "}
                <Badge variant="secondary" className="ml-1.5 text-xs">
                  {byStatus.inProgress.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed{" "}
                <Badge variant="secondary" className="ml-1.5 text-xs">
                  {byStatus.completed.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {renderTaskList(byStatus.pending, "pending")}
            </TabsContent>
            <TabsContent value="inProgress">
              {renderTaskList(byStatus.inProgress, "inProgress")}
            </TabsContent>
            <TabsContent value="completed">
              {renderTaskList(byStatus.completed, "completed")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
