# Deployment Guide

This document provides guidelines for deploying the Carbon Calculator frontend application.

## Environment Configuration

The application uses environment variables for configuration. These can be set differently depending on your deployment environment.

### Required Environment Variables

| Variable              | Description                                 | Default                 | Required |
| --------------------- | ------------------------------------------- | ----------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL                             | `http://localhost:3001` | Yes      |
| `NEXT_PUBLIC_ENV`     | Environment (`development` or `production`) | `development`           | Yes      |

### Setting Environment Variables

#### Local Development

For local development, create a `.env.local` file in the project root with the following content:

```
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NEXT_PUBLIC_ENV=development
```

#### Production Deployment

For production deployments, you have several options:

##### Vercel Deployment

If deploying to Vercel, set environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add the required environment variables:
   - `NEXT_PUBLIC_API_URL` = Your production backend URL (e.g., `https://api.yourapp.com`)
   - `NEXT_PUBLIC_ENV` = `production`

##### Docker Deployment

If using Docker, pass environment variables in your Docker Compose or Kubernetes configuration:

```yaml
# docker-compose.yml example
version: "3"
services:
  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourapp.com
      - NEXT_PUBLIC_ENV=production
    ports:
      - "3000:3000"
```

##### Traditional Hosting

For traditional hosting environments, set environment variables according to your hosting provider's instructions. Most platforms provide a way to set environment variables through a configuration panel.

## Backend CORS Configuration

The frontend application communicates directly with the backend API, so it's essential that the backend has CORS properly configured to allow requests from the frontend domain.

Make sure the backend server includes your frontend domain in its allowed CORS origins. For example, if your frontend is hosted at `https://app.example.com`, the backend should include this domain in its CORS configuration.

## Build Process

To build the application for production:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

## Health Checks

The application doesn't have a dedicated health check endpoint by default. If you need one, consider adding a simple API route:

Create a file at `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
```

This will create a `/api/health` endpoint that can be used for health checks.
