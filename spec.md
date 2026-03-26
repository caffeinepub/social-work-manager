# Social Work Manager

## Current State
App has admin panel with login (Internet Identity), dashboard, volunteers management, tasks management, map view, and announcements. Admin can add/delete volunteers and tasks.

## Requested Changes (Diff)

### Add
- Volunteer login page: phone number based login (local state, no backend)
- Volunteer portal: separate view after volunteer login with their name, assigned tasks, and announcements
- VolunteerPortalPage: shows volunteer's assigned tasks (filtered by name) and announcements
- Landing page to choose between Admin Login or Volunteer Login

### Modify
- App.tsx: add volunteer session state (volunteerName + phone), route to volunteer portal or admin panel based on login type
- LoginPage: convert to a landing page showing two options — Admin Login and Volunteer Login

### Remove
- Nothing removed

## Implementation Plan
1. Create VolunteerLoginPage.tsx: simple form with name + phone login (matches against volunteers list from backend)
2. Create VolunteerPortalPage.tsx: shows volunteer's assigned tasks and all announcements; no edit/delete buttons
3. Update LoginPage.tsx to show two cards: Admin Login and Volunteer Login
4. Update App.tsx: add `volunteerSession` state, route to VolunteerPortalPage when logged in as volunteer
