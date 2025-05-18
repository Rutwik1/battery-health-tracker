// import { QueryClient, QueryFunction } from "@tanstack/react-query";



// async function throwIfResNotOk(res: Response) {
//   if (!res.ok) {
//     const text = (await res.text()) || res.statusText;
//     throw new Error(`${res.status}: ${text}`);
//   }
// }

// export async function apiRequest(
//   method: string,
//   url: string,
//   data?: unknown | undefined,
// ): Promise<Response> {
//   const res = await fetch(url, {
//     method,
//     headers: data ? { "Content-Type": "application/json" } : {},
//     body: data ? JSON.stringify(data) : undefined,
//     credentials: "include",
//   });

//   await throwIfResNotOk(res);
//   return res;
// }

// type UnauthorizedBehavior = "returnNull" | "throw";
// export const getQueryFn: <T>(options: {
//   on401: UnauthorizedBehavior;
// }) => QueryFunction<T> =
//   ({ on401: unauthorizedBehavior }) =>
//     async ({ queryKey }) => {
//       const res = await fetch(queryKey[0] as string, {
//         credentials: "include",
//       });

//       if (unauthorizedBehavior === "returnNull" && res.status === 401) {
//         return null;
//       }

//       await throwIfResNotOk(res);
//       return await res.json();
//     };

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       queryFn: getQueryFn({ on401: "throw" }),
//       refetchInterval: false,
//       refetchOnWindowFocus: false,
//       staleTime: Infinity,
//       retry: false,
//     },
//     mutations: {
//       retry: false,
//     },
//   },
// });




















// here down all full deploy code 

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Determine if we're in a local development environment
 */
export const isLocalDevelopment = (): boolean => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

/**
 * Get the appropriate API base URL depending on environment
 */
export const getApiBaseUrl = (): string => {
  if (isLocalDevelopment()) {
    // Use the local development server
    return '';
  } else {
    // Use the production Render backend - ensure this is always the backend URL
    // not the frontend URL to avoid 404 errors
    return 'https://battery-health-tracker-backend.onrender.com';
  }
}

/**
 * Format a URL with the appropriate base
 */
export const formatApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  // If path already starts with http, it's an absolute URL
  if (path.startsWith('http')) return path;
  // Make sure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Format the URL with the appropriate base URL for the environment
  const formattedUrl = formatApiUrl(url);

  const res = await fetch(formattedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      // Use the formatted URL with the appropriate base URL
      const formattedUrl = formatApiUrl(queryKey[0] as string);

      const res = await fetch(formattedUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

