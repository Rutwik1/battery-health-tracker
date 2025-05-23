
// Determine if we're running in local development or on Render
const isLocalDevelopment = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isRenderDeployment = typeof window !== 'undefined' &&
    window.location.hostname.includes('render.com');

// Set the appropriate URLs based on environment
export const isProduction = import.meta.env.PROD;

// Backend URL for deployed environment
export const BACKEND_URL = 'https://battery-health-tracker-backend.onrender.com';

// API URL configuration
export const API_BASE_URL = isRenderDeployment || isProduction
    ? `${BACKEND_URL}/api`  // For deployed frontend on Render
    : '/api'; // Use relative URLs for API calls in local development

// Frontend URL configuration
export const FRONTEND_URL = isLocalDevelopment
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : '';

// WebSocket URL configuration
export const WS_BASE_URL = isRenderDeployment
    ? `wss://battery-health-tracker-backend.onrender.com/ws`  // For deployed frontend
    : isLocalDevelopment
        ? `ws://${window.location.hostname}:5000/ws`  // Local development
        : `wss://${window.location.hostname}/ws`;  // Default secure WebSocket

// Function to get correct API URL based on environment
export function getApiUrl(endpoint: string): string {
    // Handle paths with or without /api prefix
    const cleanEndpoint = endpoint.startsWith('/api/')
        ? endpoint.substring(5)  // Remove /api/ prefix
        : endpoint.startsWith('/api')
            ? endpoint.substring(4)  // Remove /api prefix
            : endpoint.startsWith('/')
                ? endpoint.substring(1)  // Remove just the leading slash
                : endpoint;  // No changes needed

    if (isRenderDeployment || isProduction) {
        // Use absolute URL with the backend hostname
        return `${BACKEND_URL}/api/${cleanEndpoint}`;
    }

    // For local development, use relative URL with leading slash
    return `/api/${cleanEndpoint}`;
}

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