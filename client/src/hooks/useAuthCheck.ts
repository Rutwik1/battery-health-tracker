import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { isAuthenticated } from '@/lib/auth';

/**
 * Custom hook to check authentication status and redirect if not authenticated
 * @param redirectTo Page to redirect to if not authenticated
 * @param skipCheck Flag to skip authentication check (for public pages)
 * @returns Loading state
 */
export function useAuthCheck(redirectTo: string = '/login', skipCheck: boolean = false) {
  const [isLoading, setIsLoading] = useState(true);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (skipCheck) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        
        if (!authenticated) {
          // Not authenticated, redirect to login
          setLocation(redirectTo);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoading(false);
        setLocation(redirectTo);
      }
    };

    checkAuth();
  }, [redirectTo, skipCheck, setLocation]);

  return { isLoading };
}