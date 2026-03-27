# Social Work Manager

## Current State
- Admin panel: Login, Dashboard, Volunteers (add/delete), Tasks, Map, Announcements
- Volunteer panel: Login by name, view tasks/announcements/profile
- No attendance tracking exists
- No volunteer card feature exists

## Requested Changes (Diff)

### Add
- **Attendance Module (Admin):** In VolunteersPage, add an "Attendance" button per volunteer. Admin can mark Present/Absent for today's date. Show attendance history per volunteer (date-wise log stored in localStorage).
- **Attendance View (Volunteer Portal):** In VolunteerPortalPage, add an "My Attendance" section showing the volunteer's attendance history.
- **Digital Volunteer Card:** When a volunteer is added (or from their profile), display/generate a printable digital volunteer card showing: Name, Phone, Location, Volunteer ID (auto-generated), Join Date, Status, and organization name "Social Work Manager". Card should have a professional card design with print/download option.

### Modify
- VolunteersPage: Add attendance marking button per volunteer row
- VolunteerPortalPage: Add attendance history section
- App.tsx: Add "attendance" page or modal support if needed

### Remove
- Nothing removed

## Implementation Plan
1. Create attendance store in localStorage (key: `volunteer_attendance`, value: `{volunteerId: [{date, status}]}`)
2. In VolunteersPage, add "Mark Attendance" button that opens a dialog to mark Present/Absent for today, show today's status on volunteer row
3. Create VolunteerCard component: styled card with volunteer info, ID (VOL-XXXX), join date, org logo area, print CSS
4. In VolunteersPage, add "View Card" button per volunteer that opens the digital card in a dialog with print option
5. In VolunteerPortalPage, add "My Attendance" section pulling from localStorage
