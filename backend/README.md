## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Docker (for local DB or full Docker setup)

### Install Dependencies

```bash
cd backend
npm install
```

## Development

### With Docker (recommended)

Run `npm run docker` from the project root — no manual DB setup needed.

### Locally

1. Start the database: `npm run db:start`
2. Start the server: `npm start`

> `npm run db:start` is for local development only. Docker Compose handles postgres automatically.

Server runs on: `http://localhost:3000`
