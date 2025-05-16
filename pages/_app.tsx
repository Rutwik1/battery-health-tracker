import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { useBatteryStore } from '../store/batteryStore';
import MainLayout from '../components/layout/MainLayout';

export default function App({ Component, pageProps }: AppProps) {
  const { startRealtimeUpdates, stopRealtimeUpdates } = useBatteryStore();

  useEffect(() => {
    // Start the real-time updates when the app mounts
    startRealtimeUpdates();

    // Clean up on unmount
    return () => {
      stopRealtimeUpdates();
    };
  }, [startRealtimeUpdates, stopRealtimeUpdates]);

  return (
    <>
      <Head>
        <title>Coulomb.ai Battery Health Dashboard</title>
        <meta name="description" content="Monitor and optimize your battery performance with real-time analytics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}