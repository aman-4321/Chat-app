## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Setup

Copy `.env.example` to `.env.local` and fill in the required environment variables:

```bash
NEXT_PUBLIC_NODE_ENV="development"
NEXT_PUBLIC_API_URL="your_api_url"
NEXT_PUBLIC_WS_URL="your_websocket_url"
```

## Authentication

- All routes except `/login`, `/signup`, and `/settings` require authentication
- Unauthorized access attempts are redirected to the login page
- JWT-based authentication system
- Persistent login state

## Routes

### Public Routes

- `/login` - User login page

  - Email and password authentication
  - Redirects to home page after successful login

- `/signup` - New user registration

  - Create account with full name, email, and password
  - Profile picture upload option
  - Redirects to home page after successful registration

- `/settings` - Theme customization
  - Multiple theme options
  - Live preview of chat interface
  - Theme changes are saved automatically

### Protected Routes (Requires Authentication)

- `/` (Home) - Main chat interface

  - Sidebar with user list
  - Chat container
  - Real-time message updates
  - Online/offline status

- `/profile` - User profile management
  - View and update profile picture
  - Display user information
  - Show account details
  - Member since date
  - Account status
