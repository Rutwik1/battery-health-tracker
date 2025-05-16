import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard page on initial load
    router.push('/dashboard');
  }, [router]);
  
  return null;
}