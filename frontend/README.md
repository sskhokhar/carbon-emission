# Carbon Calculator Frontend

A Next.js application for calculating carbon emissions from various sources.

## Environment Setup

This project uses environment variables for configuration. Create a `.env.local` file in the project root with the following variables:

```
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NEXT_PUBLIC_ENV=development
```

### Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of the backend API server (default: http://localhost:3001)
- `NEXT_PUBLIC_ENV`: The environment to run the application in (development, production)

## API Configuration

The application communicates directly with the backend API. Make sure the backend server has CORS properly configured to allow requests from the frontend origin.

## Development

To run the development server:

```bash
npm run dev
```

This will start the frontend application on [http://localhost:3000](http://localhost:3000).

## Building for Production

To build the application for production:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## Architecture

The application follows a smart/dumb component architecture:

- **Smart components**: Handle business logic, state management, and API calls
- **Dumb components**: Handle presentation and user input

### Form Components

Form components are implemented as dumb components and receive handlers from parent components:

- `ElectricityForm`: Form for electricity emissions calculations
- `VehicleForm`: Form for vehicle emissions calculations
- `FlightForm`: Form for flight emissions calculations

### API Module

The `/lib/api.ts` module provides functions for interacting with the backend API:

- `estimateElectricityEmissions`: Calculate emissions from electricity consumption
- `estimateVehicleEmissions`: Calculate emissions from vehicle travel
- `estimateFlightEmissions`: Calculate emissions from flights

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
