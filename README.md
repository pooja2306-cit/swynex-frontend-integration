# QuickDesk

A lightweight helpdesk web application where customers raise support tickets and support agents track, assign, and resolve them in one place.

> **Status:** Work in progress. The architecture document, a React frontend integrated with a Node.js/Express REST API, and persistent storage for the Tickets resource are complete. Authentication and comments are planned.

## Problem

Small teams often handle support through scattered emails and chats, so requests get lost, ownership is unclear, and there is no visibility into ticket status. QuickDesk gives them a single, simple place to manage support requests.

## Users and Roles

- **Customer:** creates tickets, views their status, and replies to agents
- **Agent:** views the ticket queue, assigns tickets, updates status, and replies
- **Admin (optional):** manages agents

## Features

**Implemented**
- Create, view, update, and delete support tickets
- Ticket status (Open, In Progress, Resolved, Closed) and priority (Low, Medium, High)
- Agent queue with status and priority filters
- Server-side validation with clear error messages
- Loading, error, empty, and success states across the UI
- Persistent storage (data survives server restarts)

**Planned**
- Register and log in (JWT authentication and roles)
- Comment thread on each ticket
- Ticket assignment to agents

**Out of scope (for now):** email integration, file attachments, SLA timers, live chat, analytics.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Fetch API |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3), planned migration to PostgreSQL |
| Auth | JWT-based authentication (planned) |

## Documentation

The full design lives in [`docs/architecture.md`](docs/architecture.md), covering the product idea, system diagram, data models, API routes, and frontend screens.

## Project Structure

```
quickdesk/
├── README.md
├── .gitignore
├── client/                          # React frontend
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── tickets.js           # API calls (fetch wrapper)
│       ├── components/
│       │   ├── Loading.jsx          # Loading spinner
│       │   └── ErrorMessage.jsx     # Error display with retry
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── MyTickets.jsx
│           ├── NewTicket.jsx
│           ├── TicketDetail.jsx
│           └── AgentQueue.jsx
└── server/                          # Express REST API
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.js                 # App entry point
        ├── db.js                    # SQLite connection and table setup
        ├── routes/
        │   └── ticket.routes.js
        └── validators/
            └── ticket.validator.js
```

## Getting Started

### Prerequisites

- Node.js 18 or later

You need **two terminals**, one for the API and one for the frontend.

### 1. Backend (API)

```bash
cd server
npm install
cp .env.example .env      # on Windows CMD: copy .env.example .env
npm run dev
```

The API runs at `http://localhost:5000`. A `quickdesk.db` SQLite file is created automatically on first run. Check it works at `http://localhost:5000/api/health`.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env      # on Windows CMD: copy .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`. Restart the frontend after creating or changing `.env`.

## Environment Variables

**server/.env**

```
PORT=5000
```

**client/.env**

```
VITE_API_URL=http://localhost:5000/api
```

## Frontend Screens

| Screen | Route | Integration |
|---|---|---|
| My Tickets | `/tickets` | Loads tickets from the API (loading, error with retry, empty state) |
| New Ticket | `/tickets/new` | Creates a ticket via the API (submitting state, server validation errors, success message) |
| Ticket Detail | `/tickets/:id` | Loads one ticket, updates its status, and deletes it (loading, not-found, and action errors) |
| Agent Queue | `/agent/queue` | Loads tickets with status and priority filters from the API |
| Login / Register | `/login`, `/register` | Static screens (authentication is planned) |

### UI states handled

- **Loading:** a spinner is shown while data is fetched
- **Error:** a clear message is shown, including "Cannot reach the server" when the API is down, with a **Try again** button
- **Validation errors:** messages returned by the API are listed to the user
- **Empty:** a friendly message when there are no tickets or no filter matches
- **Success:** confirmation after creating a ticket

## Backend API

The **Tickets** resource is fully implemented with create, read, update, and delete operations, input validation, and persistent storage.

Base URL: `http://localhost:5000/api`

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/tickets` | List tickets (optional filters: `?status=OPEN&priority=HIGH`) |
| GET | `/tickets/:id` | Get a single ticket |
| POST | `/tickets` | Create a ticket |
| PATCH | `/tickets/:id` | Update a ticket (any of title, description, status, priority) |
| DELETE | `/tickets/:id` | Delete a ticket |

### Ticket fields

| Field | Type | Rules |
|---|---|---|
| id | Integer | Auto-generated |
| title | String | Required, 3 to 100 characters |
| description | String | Required, 10 to 1000 characters |
| status | String | `OPEN` (default), `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| priority | String | `LOW`, `MEDIUM` (default), `HIGH` |
| createdAt | Timestamp | Auto-generated |
| updatedAt | Timestamp | Auto-updated |

### Example: create a ticket

Request: `POST /api/tickets`

```json
{
  "title": "Cannot reset password",
  "description": "The reset link shows an error.",
  "priority": "HIGH"
}
```

Response: `201 Created`

```json
{
  "id": 1,
  "title": "Cannot reset password",
  "description": "The reset link shows an error.",
  "status": "OPEN",
  "priority": "HIGH",
  "createdAt": "2026-11-06 10:30:00",
  "updatedAt": "2026-11-06 10:30:00"
}
```

### Validation and errors

Invalid requests return a `400` status with the list of problems:

```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      "title is required and must be 3-100 characters",
      "priority must be one of: LOW, MEDIUM, HIGH"
    ]
  }
}
```

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Ticket created |
| 204 | Ticket deleted |
| 400 | Validation error, invalid id, or invalid JSON body |
| 404 | Ticket or route not found |
| 500 | Internal server error |

### Testing the API with curl

```bash
# Create
curl -X POST http://localhost:5000/api/tickets -H "Content-Type: application/json" -d "{\"title\":\"Cannot reset password\",\"description\":\"The reset link shows an error.\",\"priority\":\"HIGH\"}"

# List
curl http://localhost:5000/api/tickets

# Update status
curl -X PATCH http://localhost:5000/api/tickets/1 -H "Content-Type: application/json" -d "{\"status\":\"IN_PROGRESS\"}"

# Delete
curl -X DELETE http://localhost:5000/api/tickets/1
```

## Roadmap

- [x] Product idea and architecture document
- [x] Frontend screens
- [x] REST API for Tickets with validation
- [x] Persistent storage (SQLite)
- [x] Connect frontend to the API with loading and error states
- [ ] Authentication (JWT) and user roles
- [ ] Comments resource
- [ ] Agent assignment
- [ ] Migrate to PostgreSQL

## Author

Pooja Ravi
