

// client/src/lib/apiConfig.js
const isProduction = window.location.hostname !== 'localhost';

// Use environment variables for production URLs
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ||
    (isProduction ? 'https://battery-health-tracker-backend.onrender.com' : '');

export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL ||
    (isProduction ? 'https://battery-health-tracker-frontend.onrender.com' : window.location.origin);

// WebSocket URL construction
// In production, use wss:// with the backend URL domain
// In development, use the local WebSocket endpoint
export const WS_BASE_URL = isProduction
    ? 'wss://battery-health-tracker-backend.onrender.com/ws'
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

// Log configuration in non-production environments
if (!isProduction) {
    console.log("API Configuration:", {
        isProduction,
        API_BASE_URL,
        FRONTEND_URL,
        WS_BASE_URL
    });
}