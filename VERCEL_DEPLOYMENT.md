# Vercel Deployment Guide for Sweet Delights

This guide explains how to deploy the full MERN stack (Frontend + Backend) to Vercel for free.

## 1. Prepare Database (MongoDB Atlas)

Since Vercel is serverless and doesn't host databases, you need a cloud database.

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  Create a **Free Cluster (Shared)**.
3.  Create a Database User (username/password). **Remember these!**
4.  Network Access: Allow Access from Anywhere (`0.0.0.0/0`).
5.  Get Connection String:
    -   Click "Connect" -> "Drivers".
    -   Copy string like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    -   Replace `<username>` and `<password>` with your real credentials.

## 2. Push to GitHub

Ensure your project is pushed to a GitHub repository.

```bash
git add .
git commit -m "Prepared for Vercel deployment"
git push origin main
```

## 3. Deploy on Vercel

1.  Go to [Vercel](https://vercel.com/) and Login/Sign Up.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your **Sweet Delights** repository.
4.  **Configure Project**:
    -   **Framework Preset**: Select "Other" or let it detect (Custom configuration is handled by `vercel.json`).
    -   **Root Directory**: Leave as `./` (Root).
    -   **Environment Variables**: Add the following:
        -   `MONGODB_URI`: Your MongoDB Atlas connection string.
        -   `JWT_SECRET`: A secret string for authentication.
        -   `VITE_API_URL`: Set this to nothing or `/` (since we are on same domain) OR your Vercel URL (e.g., `https://your-project.vercel.app`). *Recommendation: Use `/` relative path or full URL after first deploy.*
        -   `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID.
        -   `BYTEZ_API_URL` and keys if needed.
        -   `RAZORPAY_KEY_ID`: Your Razorpay Key.

5.  Click **Deploy**.

## 4. Post-Deployment Checks

-   **Frontend**: Visit the Vercel URL.
-   **Backend API**: Test `${VERCEL_URL}/api/products`.
-   **Images**:
    -   *Note*: Vercel Serverless is **Ephemeral**. Images uploaded securely to `uploads/` folder via the "AI Photo Designer" **WILL DISAPPEAR** after a short time.
    -   **Recommendation**: For a permanent production solution, refactor the code to use **Cloudinary** or **AWS S3**.
    -   The `BYTEZ_API_KEY` is mandatory for the "Generate" button to work in the AI Designer.

## Troubleshooting

-   **CORS**: Since frontend and backend are on the same domain in this setup, CORS issues should be minimal.
-   **Build Failures**: Check Vercel logs. Ensure `client` build passes locally.
