# Sweet Delights 🍰

Sweet Delights is a premium online bakery platform where customers can browse, customize, and order high-quality sweets, cakes, and cupcakes.

## Features
- **Browse Sweets**: A curated selection of cakes, cupcakes, and other treats.
- **Custom Cake Builder**: Design your own cakes with specific layers and toppings.
- **Secure Checkout**: Integrated with Razorpay for safe and easy payments.
- **Admin Dashboard**: Manage products, orders, and customer messages.
- **User Authentication**: Secure login and registration for customers.
- **3D Visuals**: Immersive experience with 3D cake and cupcake visuals.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Three.js (R3F)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Payments**: Razorpay
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- Razorpay account (for payments)
- Google OAuth credentials (for social login)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/nawaladitya06/Sweet-Delights.git
   ```
2. Install dependencies for the server:
   ```bash
   cd server
   npm install
   ```
3. Install dependencies for the client:
   ```bash
   cd client
   npm install
   ```
4. Set up environment variables:
   - In `server/.env`:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     ```
   - In `client/.env`:
     ```env
     VITE_API_URL=http://localhost:5000
     VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
     ```

### Running the application
- **Start Backend**: `cd server && npm run dev`
- **Start Frontend**: `cd client && npm run dev`

## Deployment
The project is configured for deployment on Vercel. See `vercel.json` for details.

---
Built with ❤️ by [Aditya](https://github.com/nawaladitya06)
