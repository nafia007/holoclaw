# PicoClaw Web Interface

## Prerequisites
- Node.js (v18+)
- Go (v1.22+)
- PicoClaw Backend (in `picoclaw_repo`)

## Setup

1. **Backend**:
   Navigate to `picoclaw_repo` and build the backend:
   ```bash
   cd picoclaw_repo
   go build ./cmd/picoclaw
   ```
   Start the gateway server:
   ```bash
   ./picoclaw gateway
   ```
   The API server will start on port 18790 (default).

2. **Frontend**:
   Install dependencies:
   ```bash
   npm install
   ```
   Start the development server:
   ```bash
   npm run dev
   ```
   Access the web interface at `http://localhost:5173`.

## Features
- real-time chat via WebSocket
- Conversation history management
- Settings configuration
- Markdown rendering with code highlighting
- Responsive design

## Configuration
- Frontend: `.env` file for VITE variables (URL, etc.)
- Backend: `~/.picoclaw/config.json` or `config.json` in working directory.
