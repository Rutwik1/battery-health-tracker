

// // client/src/lib/apiConfig.js
// const isProduction = window.location.hostname !== 'localhost';

// // Use environment variables for production URLs
// export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ||
//     (isProduction ? 'https://battery-health-tracker-backend.onrender.com' : '');

// export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL ||
//     (isProduction ? 'https://battery-health-tracker-frontend.onrender.com' : window.location.origin);

// // WebSocket URL construction
// // In production, use wss:// with the backend URL domain
// // In development, use the local WebSocket endpoint
// export const WS_BASE_URL = isProduction
//     ? 'wss://battery-health-tracker-backend.onrender.com/ws'
//     : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

// // Log configuration in non-production environments
// if (!isProduction) {
//     console.log("API Configuration:", {
//         isProduction,
//         API_BASE_URL,
//         FRONTEND_URL,
//         WS_BASE_URL
//     });
// }


/**
 * API Configuration
 * 
 * This file provides a centralized configuration for API endpoints,
 * handling both local development and production environments.
 */

// Determine if we're running in local development or on Render
const isLocalDevelopment = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isRenderDeployment = typeof window !== 'undefined' &&
    window.location.hostname.includes('render.com');

// Set the appropriate URLs based on environment
export const isProduction = import.meta.env.PROD;

// API URL configuration
export const API_BASE_URL = isRenderDeployment
    ? 'https://battery-health-tracker-backend.onrender.com/api'  // For deployed frontend on Render
    : ''; // Use relative URLs for API calls in local development

// Frontend URL configuration
export const FRONTEND_URL = isLocalDevelopment
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : '';

// WebSocket URL configuration
export const WS_BASE_URL = isRenderDeployment
    ? 'wss://battery-health-tracker-backend.onrender.com/ws'  // For deployed frontend
    : isLocalDevelopment
        ? `ws://${window.location.hostname}:5000/ws`  // Local development
        : `wss://${window.location.hostname}/ws`;  // Default secure WebSocket

// Log configuration in development
console.log('API Configuration:', {
    isProduction,
    API_BASE_URL,
    FRONTEND_URL,
    WS_BASE_URL
});

// Export other API-related configurations
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

// Helper function for making API requests
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API Request to: ${url}`);

    const response = await fetch(url, {
        ...options,
        headers: {
            ...DEFAULT_HEADERS,
            ...(options.headers || {})
        }
    });

    return response;
}