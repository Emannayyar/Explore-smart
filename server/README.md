# ExploreSmart API

A deliberately small Express server. Data is one JSON file, no database.

## Run

```
yarn server      # API only, http://localhost:3001
yarn dev:all     # Vite (5173) + API with auto-restart; Vite proxies /api to 3001
```

`API_PORT=3101 yarn server` changes the port.

## Data

Everything lives in `server/data/db.json` (git-ignored, created on first start):
`{ users, sessions, savedTrips, messages, notifications }`. Delete the file to reset.
The trip catalogue is not stored here; it comes from `src/data/trips.js`, and eco scores
are computed on the server with `src/utils/ecoScore.js`.

## Endpoints

Auth = `Authorization: Bearer <token>`. Errors are `{ "error": "message" }`.

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | /api/health | no | `{ ok: true }` |
| POST | /api/auth/signup | no | `{name,email,password}` -> `{token,user}` |
| POST | /api/auth/signin | no | `{email,password}` -> `{token,user}` |
| POST | /api/auth/signout | yes | 204 |
| GET | /api/me | yes | `{user}` |
| PATCH | /api/me | yes | name, phone, location, about, preferences (emailNotifications, tripReminders, weatherAlerts, profilePublic, shareActivity, dataCollection; other keys are ignored) |
| PUT | /api/me/password | yes | `{currentPassword,newPassword}`, 204, other sessions end |
| GET | /api/me/export | yes | profile, saved trips and notifications as a download |
| DELETE | /api/me | yes | `{password}`, 204 |
| GET | /api/trips | no | catalogue |
| GET | /api/saved-trips | yes | newest first |
| POST | /api/saved-trips | yes | `{kind:"plan",...}` or `{kind:"trip",tripId}` |
| DELETE | /api/saved-trips/:id | yes | owner only, 204 |
| GET | /api/stats | yes | counts and average eco score |
| POST | /api/contact | no | `{name,email,subject,message}`, 201 |
| GET | /api/weather | no | Open-Meteo, cached 15 min, 503 if unavailable |
| GET | /api/notifications | yes | `{notifications, unread}`, newest first |
| POST | /api/notifications/read-all | yes | 204 |
| PATCH | /api/notifications/:id | yes | `{read:true}` -> `{notification}`, owner only |
| DELETE | /api/notifications/:id | yes | owner only, 204 |
| DELETE | /api/notifications | yes | clears all of your notifications, 204 |

Notifications are created when an account is created (welcome), a trip is saved and the
password is changed. At most 50 are kept per user (oldest dropped); deleting an account removes them.
