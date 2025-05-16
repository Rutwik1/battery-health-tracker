import React, { useEffect } from 'react';
import Head from 'next/head';
import { useBatteryStore } from '../store/batteryStore';
import AddBatteryModal from '../components/nextjs/AddBatteryModal';
import { BatteryOverview } from '../components/dashboard/BatteryStatusCards';
import BatteryGrid from '../components/dashboard/BatteryGrid';

// Dashboard Header Component
const DashboardHeader = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
        Battery Health Dashboard
      </h1>
      <p className="text-gray-400 mt-1">Monitor and optimize your battery performance with real-time analytics</p>
    </div>
    <div className="flex items-center space-x-2">
      <AddBatteryModal />
    </div>
  </div>
);

// Realtime Indicator Component
const RealtimeIndicator = () => {
  const [dots, setDots] = React.useState('.');
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 rounded-full text-xs text-white flex items-center z-50">
      <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
      <span>Real-time updates{dots}</span>
    </div>
  );
};

// Main Dashboard Page
export default function Dashboard() {
  const { 
    batteries, 
    fetchBatteries, 
    isLoading
  } = useBatteryStore();
  
  useEffect(() => {
    // Fetch battery data on initial load
    fetchBatteries();
  }, [fetchBatteries]);
  
  return (
    <>
      <Head>
        <title>Battery Health Dashboard | Coulomb.ai</title>
        <meta name="description" content="Monitor your battery health, performance metrics, and receive maintenance recommendations in real-time." />
      </Head>
      
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader />
        
        {/* Battery Overview Statistics */}
        <BatteryOverview batteries={batteries} />
        
        {/* Batteries Grid Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Your Batteries</h2>
            
            <div className="flex items-center space-x-2">
              <select 
                className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5"
                defaultValue="all"
              >
                <option value="all">All Batteries</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="critical">Critical</option>
              </select>
              
              <button className="p-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="21" y1="18" x2="3" y2="18"></line>
                </svg>
              </button>
              
              <button className="p-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>
          </div>
          
          <BatteryGrid batteries={batteries} isLoading={isLoading} />
        </div>
        
        <RealtimeIndicator />
      </div>
    </>
  );
}