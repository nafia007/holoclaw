# ZeroClaw Web Interface

A modern, beautiful web interface for ZeroClaw AI agent.

## Features

- 🦀 **ZeroClaw Integration**: Full support for ZeroClaw's gateway API
- 💬 **Real-time Chat**: Interactive chat interface with loading states
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Security**: Supports ZeroClaw's pairing and authentication system
- 📊 **Health Monitoring**: Check ZeroClaw gateway status

## Getting Started

### Prerequisites

1. **ZeroClaw Installed**: Make sure ZeroClaw is built and installed
2. **Node.js**: For running the frontend

### Running the Interface

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running ZeroClaw Gateway

```bash
# Start ZeroClaw gateway (default port: 8080)
zeroclaw gateway

# Or start with custom port
zeroclaw gateway --port 8081
```

### Configuration

- **API URL**: Default: `http://localhost:8080` (can be configured via `VITE_API_URL` environment variable)
- **Pairing**: If ZeroClaw requires pairing, the interface will handle it

## Usage

1. Start the ZeroClaw gateway
2. Open the web interface
3. Start chatting!

## Technologies

- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Axios (for API calls)

## License

MIT
