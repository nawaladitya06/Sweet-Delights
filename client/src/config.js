
// In production, we usually serve the API on the same domain at /api
// Defaulting to empty string ensures it works on the current host in production
export const API_URL = import.meta.env.VITE_API_URL || '';
