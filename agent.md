# Agent Notes

This is the staff/admin web portal for the Bail House app.

It is separate from the resident-facing Angular/Ionic app.

Core workflows:
- Staff login via browser.
- View pending absence and visitor requests.
- Approve or reject requests.
- Add, edit, and deactivate residents.
- Maintain request and resident records.

Build direction:
- Use Angular.
- Run the project on port 4300 for local development.
- When working on a new feature, always check whether it should start on a new git branch before making changes.
- Optimize for staff browser workflows on desktop and tablet.
- Keep service/model boundaries clean so mock data can later be replaced by a backend API.
- Avoid mobile-app-style screens unless needed for responsiveness.
