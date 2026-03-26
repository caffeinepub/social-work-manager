import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Task {
    status: TaskStatus;
    title: string;
    assignedTo: string;
    description: string;
    priority: TaskPriority;
}
export interface Announcement {
    title: string;
    content: string;
    timestamp: Time;
}
export interface Volunteer {
    status: boolean;
    name: string;
    phone: string;
    location: string;
}
export interface DashboardStats {
    completedTasks: bigint;
    volunteerCount: bigint;
    taskCount: bigint;
    pendingTasks: bigint;
    inProgressTasks: bigint;
    announcementCount: bigint;
}
export interface UserProfile {
    name: string;
}
export enum TaskPriority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum TaskStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnnouncement(announcement: Announcement): Promise<bigint>;
    addTask(task: Task): Promise<bigint>;
    addVolunteer(volunteer: Volunteer): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteTask(id: bigint): Promise<void>;
    deleteVolunteer(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAnnouncements(): Promise<Array<Announcement>>;
    listTasks(): Promise<Array<Task>>;
    listVolunteers(): Promise<Array<Volunteer>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTaskStatus(id: bigint, status: TaskStatus): Promise<void>;
}
