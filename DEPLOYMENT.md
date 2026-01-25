# Deployment Guide for Sweet Delights

This guide outlines the steps to deploy the Sweet Delights MERN stack application.

## Prerequisites

- **Node.js**: v14 or higher
- **MongoDB**: A running MongoDB instance (local or Atlas)
- **Git**: For version control

## Environment Variables

Ensure you have the following environment variables set up.

### Client (`client/.env`)

Create a `.env` file in the `client` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=https://your-backend-url.com
```

*Note: For local development, `VITE_API_URL` uses `http://localhost:5000` by default if not set.*

### Server (`server/.env`)

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
BYTEZ_API_KEY=your_bytez_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

## Build and Run Instructions

### 1. Backend (Server)

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Start the server:

```bash
npm start
```

### 2. Frontend (Client)

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Build the frontend for production:

```bash
npm run build
```

The build output will be in the `client/dist` directory.

### Serving the Frontend

You can serve the static files from `client/dist` using a static file server or by configuring the backend to serve them.

## Deployment Platforms

### Render / Heroku / Vercel

1.  **Backend**: Deploy the `server` directory. Set the environment variables in the platform's dashboard.
2.  **Frontend**: Deploy the `client` directory. Set `VITE_API_URL` to your deployed backend URL.
    -   **Vercel/Netlify**: Build command: `npm run build`, Output directory: `dist`.
    -   **Render**: Build command: `npm install && npm run build`, Publish directory: `dist`.

## Verification

-   Visit the deployed frontend URL.
-   Check functionality: Login, Product Listing, Cart, Checkout.
-   Verify API calls in the Network tab are hitting the correct backend URL.
