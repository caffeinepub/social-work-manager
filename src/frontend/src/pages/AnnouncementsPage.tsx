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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Megaphone, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddAnnouncement,
  useDeleteAnnouncement,
  useListAnnouncements,
} from "../hooks/useQueries";

export default function AnnouncementsPage() {
  const { data: announcements, isLoading } = useListAnnouncements();
  const addMutation = useAddAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const handleAdd = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    try {
      await addMutation.mutateAsync({
        title: form.title.trim(),
        content: form.content.trim(),
        timestamp: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Announcement posted!");
      setForm({ title: "", content: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to post announcement");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Announcement removed");
    } catch {
      toast.error("Failed to delete announcement");
    }
  };

  const formatDate = (ns: bigint) => {
    const ms = Number(ns) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <Button
              data-ocid="announcements.open_modal_button"
              className="gap-2"
            >
              <Plus size={16} /> New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="announcements.dialog" className="max-w-md">
            <DialogHeader>
              <DialogTitle>Post Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  data-ocid="announcements.title.input"
                  placeholder="Health camp on Saturday"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Content *</Label>
                <Textarea
                  data-ocid="announcements.content.textarea"
                  placeholder="Write announcement details..."
                  rows={4}
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                />
              </div>
              <Button
                data-ocid="announcements.submit_button"
                className="w-full"
                onClick={handleAdd}
                disabled={
                  !form.title.trim() ||
                  !form.content.trim() ||
                  addMutation.isPending
                }
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Megaphone size={16} className="mr-2" />
                    Post Announcement
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
            <Megaphone size={16} className="text-primary" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div data-ocid="announcements.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !announcements || announcements.length === 0 ? (
            <div
              data-ocid="announcements.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <Megaphone size={40} className="mx-auto mb-3 opacity-25" />
              <p className="text-sm font-medium">No announcements yet</p>
              <p className="text-xs mt-1">
                Post the first announcement to notify your team
              </p>
            </div>
          ) : (
            <div data-ocid="announcements.list" className="space-y-3">
              {announcements.map((a, i) => (
                <div
                  key={String(a.id)}
                  data-ocid={`announcements.item.${i + 1}`}
                  className="p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(a.timestamp)}
                      </p>
                      <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                        {a.content}
                      </p>
                    </div>
                    <Button
                      data-ocid={`announcements.delete_button.${i + 1}`}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => handleDelete(a.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
