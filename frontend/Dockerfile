# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app files
COPY . .

# Set build-time environment variable (passed via --build-arg)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js app
RUN npm run build

# Expose port and set production mode
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start Next.js app (standalone output preferred for production)
CMD ["npm", "start"]
