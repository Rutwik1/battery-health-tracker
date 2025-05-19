// client/src/lib/apiConfig.js

// Check if we're in development or production
const isProduction = window.location.hostname !== 'localhost';

// API Base URL - use environment variable or construct based on environment
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ||
    (isProduction ? 'https://battery-health-tracker-backend.onrender.com' : '');

// Frontend URL - use environment variable or fallback
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL ||
    (isProduction ? 'https://battery-health-tracker-frontend.onrender.com' : window.location.origin);

// WebSocket URL - derived from API_BASE_URL or local host
export const WS_BASE_URL = isProduction
    ? (API_BASE_URL ? `${API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/ws` : 'wss://battery-health-tracker-backend.onrender.com/ws')
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

// Helper function to log API configuration during development
if (!isProduction) {
    console.log("API Configuration:", {
        isProduction,
        API_BASE_URL,
        FRONTEND_URL,
        WS_BASE_URL
    });
}