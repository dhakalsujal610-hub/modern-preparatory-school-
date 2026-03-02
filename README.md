# Riverside Academy Full‑Stack Website

This workspace contains a static frontend and a Node.js/Express backend with a MySQL database. The site offers:

- Public pages (`index.html` etc.) for general visitors
- Separate **admin login** page (`login.html`) and **admin panel** (`admin.html`)
- Backend API for authentication and application data, using MySQL via Sequelize

## Project Structure
```
scool/
├── backend/               # Node.js server and database code
│   ├── models/            # Sequelize models (User, Application)
│   ├── routes/            # API routes
│   ├── init_db.js         # script to create schema + seed admin user
│   ├── server.js          # Express server entry point
│   └── .env               # env vars (not committed)
├── css/                   # styles for login/admin pages
├── js/                    # front-end JS logic for login/admin
├── index.html             # main public homepage
├── login.html             # admin authentication page
├── admin.html             # admin dashboard (protected)
└── README.md
```

## Setup and Running
1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Choose a database engine**
   - By default the app uses MySQL; set `DB_DIALECT=mysql` in `.env`.
   - If you don't have MySQL available you can use a local SQLite file instead:
     ```env
     DB_DIALECT=sqlite
     DB_FILE=database.sqlite
     ```
   - For MySQL ensure a server is running, create a database (e.g. `scool`),
     and update `.env` with the proper host/user/password.

   Example MySQL config:
   ```env
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_NAME=scool
   DB_USER=root
   DB_PASS=yourpassword
   SESSION_SECRET=some-secret
   PORT=3000
   ```

3. **Initialize schema**
   ```bash
   npm run init-db
   ```
   This will drop/create tables and seed a default admin user (`admin` / `password`).

4. **Start the server**
   ```bash
   npm start        # or npm run dev if you have nodemon
   ```

5. **Browse**
   - Public site: `http://localhost:3000/`
   - Admin login: `http://localhost:3000/login.html`
   - After login, you'll be redirected to the admin panel.

## API Endpoints
| Method | Path             | Description                        | Auth required |
|--------|------------------|------------------------------------|---------------|
| POST   | `/api/login`     | Authenticate admin user            | no            |
| POST   | `/api/logout`    | Log out current session            | yes           |
| GET    | `/api/me`        | Check login state                  | no            |
| GET    | `/api/applications`           | Fetch all submitted applications           | yes           |
| POST   | `/api/applications`          | Submit a new admission form                | no            |
| PUT    | `/api/applications/:id`      | Update application (e.g. change status)    | yes           |
| PUT    | `/api/applications/:id/status` | Change only application status            | yes           |
| PUT    | `/api/applications/bulk/status` | Bulk update statuses for multiple records | yes           |
| DELETE | `/api/applications/:id`      | Delete a single application                 | yes           |
| DELETE | `/api/applications/bulk`     | Bulk delete applications                    | yes           |

The public admissions form on `index.html` now POSTs to `/api/applications` and the backend stores the data in MySQL. Administrators can review incoming entries through the admin panel.
## Frontend Notes
- Tailwind CSS via CDN is used for quick, clean UI styles.
- Login page features a centred card, error handling, and animations.
- Admin panel displays applications in a simple responsive table with a logout button.
- All interactive frontend code lives under `js/` and styling under `css/`.

## Next Steps / Improvements
- Replace demo credentials with real user management or OAuth.
- Add application submission form and admin controls (approve/reject).
- Implement input validation and sanitization.
- Enhance UI/UX using branding, icons, and responsive considerations.

Feel free to build upon this scaffold! 🎓