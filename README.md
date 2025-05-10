# Carbon Emissions Calculator

This project consists of a Next.js frontend and a NestJS backend for calculating carbon emissions.

## Running with Docker Compose

### Prerequisites

- Docker and Docker Compose installed on your machine

### Starting the Application

The application is pre-configured with all necessary environment variables in the docker-compose.yml file.

1. Build and start the containers:

```bash
docker-compose up -d
```

2. The services will be available at:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:3001

### Stopping the Application

```bash
docker-compose down
```

### Architecture

- The backend runs on port 3000 and provides the API for carbon emissions calculations
- The frontend runs on port 3001 and communicates with the backend API
- Both services are connected through a Docker network

## Development Without Docker

### Backend

```bash
cd backend
npm install
# Create a .env file with the following content:
# NODE_ENV=development
# PORT=3000
# CARBON_INTERFACE_API=your_api_key_here
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
# Create a .env.local file with the following content:
# NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```

## Project Structure

- `backend/`: NestJS API for carbon emissions calculations
- `frontend/`: Next.js application for the user interface
- `docker-compose.yml`: Configuration for running both services together

## Docker Configuration

The project uses a multi-stage Docker build process for both services:

### Backend (NestJS)

- Builds the application in a build stage
- Runs the production build in a lightweight container
- Exposes port 3000

### Frontend (Next.js)

- Uses Next.js standalone output for optimized production builds
- Configured to communicate with the backend API
- Exposes port 3001
