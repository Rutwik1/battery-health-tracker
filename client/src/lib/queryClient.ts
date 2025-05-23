
import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL } from "./apiConfig";

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
  // Add API_BASE_URL to the URL if it's a relative path
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
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
      // Get the URL from the query key
      const path = queryKey[0] as string;

      // Handle paths that may or may not already have /api prefix
      const cleanPath = path.startsWith('/api/')
        ? path.substring(5) // Remove /api/ to prevent duplication
        : path.startsWith('/api')
          ? path.substring(4) // Remove /api to prevent duplication
          : path.startsWith('/')
            ? path.substring(1) // Remove leading slash
            : path;

      // Add API_BASE_URL to the path if it's a relative path
      const fullUrl = path.startsWith('http')
        ? path
        : `${API_BASE_URL}/${cleanPath}`;

      const res = await fetch(fullUrl, {
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