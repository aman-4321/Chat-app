# Full Stack Real-Time Chat Application

A modern, real-time chat application built with Next.js and Node.js, featuring instant messaging, file sharing, and user presence detection.

## Project Structure

```
chat-app/
├── frontend/     # Next.js frontend application
└── backend/      # Node.js REST API & WebSocket server
```

## Features

- 🔐 Secure authentication with JWT
- 💬 Real-time messaging using WebSocket
- 📸 Image sharing
- 👤 User presence detection (online/offline status)
- 🌓 Dark/Light theme support

## Tech Stack

### Frontend

- Next.js 13+
- TypeScript
- TailwindCSS
- Native Websocket
- Zustand (State Management)
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Websockets
- JWT Authentication
- Cloudinary (Image Storage)

## Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/aman-4321/chat-app.git

cd chat-app
```

## Documentation

- Backend API documentation is available in [Backend Readme](./backend/README.md)
- Frontend Setup is available in [Frontend Readme](./frontend/README.md)
