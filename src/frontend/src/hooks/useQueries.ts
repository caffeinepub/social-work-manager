import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Announcement, Task, TaskStatus, Volunteer } from "../backend";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListVolunteers() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<Volunteer & { id: bigint }>>({
    queryKey: ["volunteers"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.listVolunteers();
      return list.map((v, i) => ({ ...v, id: BigInt(i) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVolunteer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (volunteer: Volunteer) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addVolunteer(volunteer);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["volunteers"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteVolunteer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteVolunteer(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["volunteers"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useListTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<Task & { id: bigint }>>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.listTasks();
      return list.map((t, i) => ({ ...t, id: BigInt(i) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addTask(task);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: TaskStatus }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateTaskStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteTask(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useListAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<Announcement & { id: bigint }>>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.listAnnouncements();
      return list.map((a, i) => ({ ...a, id: BigInt(i) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (announcement: Announcement) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addAnnouncement(announcement);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
