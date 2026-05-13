<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0d5e21ae-dd74-48fb-8af6-b34b11190b73

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## MySQL Initialization

If you want a local MySQL seed for authentication, run [database/init.sql](database/init.sql) against your MySQL server. It creates the `dhldac_incident_report` database, adds an `admin` role, and seeds a default admin account.

Default credentials:

- Username: `admin`
- Password: `Admin@12345`

Example:

```bash
mysql -u root -p < database/init.sql
```

## Backend API

The app now includes a small Express backend for user management and login.

1. Copy [.env.example](.env.example) to [.env.local](.env.local) and fill in your MySQL settings.
2. Start the API with `npm run dev:api`.
3. Keep the Vite app running with `npm run dev`.

Available endpoints:

- `GET /api/health`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/auth/login`
