import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Volunteer = {
    name : Text;
    phone : Text;
    status : Bool;
    location : Text;
  };

  module Volunteer {
    public func compare(volunteer1 : Volunteer, volunteer2 : Volunteer) : Order.Order {
      Text.compare(volunteer1.name, volunteer2.name);
    };
  };

  type TaskPriority = {
    #low;
    #medium;
    #high;
  };

  type TaskStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type Task = {
    title : Text;
    description : Text;
    priority : TaskPriority;
    status : TaskStatus;
    assignedTo : Text;
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Text.compare(task1.title, task2.title);
    };
  };

  type Announcement = {
    title : Text;
    content : Text;
    timestamp : Time.Time;
  };

  module Announcement {
    public func compare(announcement1 : Announcement, announcement2 : Announcement) : Order.Order {
      Text.compare(announcement1.title, announcement2.title);
    };
  };

  type DashboardStats = {
    volunteerCount : Nat;
    taskCount : Nat;
    pendingTasks : Nat;
    inProgressTasks : Nat;
    completedTasks : Nat;
    announcementCount : Nat;
  };

  let volunteers = Map.empty<Nat, Volunteer>();
  let tasks = Map.empty<Nat, Task>();
  let announcements = Map.empty<Nat, Announcement>();

  var nextVolunteerId = 0;
  var nextTaskId = 0;
  var nextAnnouncementId = 0;

  public shared ({ caller }) func addVolunteer(volunteer : Volunteer) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add volunteers");
    };
    let id = nextVolunteerId;
    volunteers.add(id, volunteer);
    nextVolunteerId += 1;
    id;
  };

  public shared ({ caller }) func deleteVolunteer(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete volunteers");
    };
    if (not volunteers.containsKey(id)) {
      Runtime.trap("Volunteer does not exist");
    };
    volunteers.remove(id);
  };

  public query ({ caller }) func listVolunteers() : async [Volunteer] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list volunteers");
    };
    volunteers.values().toArray().sort();
  };

  public shared ({ caller }) func addTask(task : Task) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add tasks");
    };
    let id = nextTaskId;
    tasks.add(id, task);
    nextTaskId += 1;
    id;
  };

  public shared ({ caller }) func deleteTask(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete tasks");
    };
    if (not tasks.containsKey(id)) {
      Runtime.trap("Task does not exist");
    };
    tasks.remove(id);
  };

  public query ({ caller }) func listTasks() : async [Task] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list tasks");
    };
    tasks.values().toArray().sort();
  };

  public shared ({ caller }) func updateTaskStatus(id : Nat, status : TaskStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update task status");
    };
    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task does not exist") };
      case (?task) {
        let updatedTask = {
          title = task.title;
          description = task.description;
          priority = task.priority;
          status;
          assignedTo = task.assignedTo;
        };
        tasks.add(id, updatedTask);
      };
    };
  };

  public shared ({ caller }) func addAnnouncement(announcement : Announcement) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add announcements");
    };
    let id = nextAnnouncementId;
    let withTimestamp = {
      title = announcement.title;
      content = announcement.content;
      timestamp = Time.now();
    };
    announcements.add(id, withTimestamp);
    nextAnnouncementId += 1;
    id;
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    if (not announcements.containsKey(id)) {
      Runtime.trap("Announcement does not exist");
    };
    announcements.remove(id);
  };

  public query ({ caller }) func listAnnouncements() : async [Announcement] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list announcements");
    };
    announcements.values().toArray().sort();
  };

  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view dashboard stats");
    };
    var pending = 0;
    var inProgress = 0;
    var completed = 0;

    tasks.values().forEach(
      func(task) {
        switch (task.status) {
          case (#pending) { pending += 1 };
          case (#inProgress) { inProgress += 1 };
          case (#completed) { completed += 1 };
        };
      }
    );

    {
      volunteerCount = volunteers.size();
      taskCount = tasks.size();
      pendingTasks = pending;
      inProgressTasks = inProgress;
      completedTasks = completed;
      announcementCount = announcements.size();
    };
  };
};
