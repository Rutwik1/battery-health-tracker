import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useBatteryStore } from '../store/batteryStore';
import { Battery } from '../store/batteryStore';
import AddBatteryModal from '../components/nextjs/AddBatteryModal';
import Link from 'next/link';

// Dashboard UI components
const DashboardHeader: React.FC = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
      Battery Health Dashboard
    </h1>
    <div className="flex items-center space-x-2">
      <AddBatteryModal />
    </div>
  </div>
);

const BatteryOverview: React.FC<{ batteries: Battery[] }> = ({ batteries }) => {
  // Calculate summary statistics
  const averageHealth = batteries.length 
    ? batteries.reduce((sum, b) => sum + b.healthPercentage, 0) / batteries.length 
    : 0;
    
  const criticalBatteries = batteries.filter(b => b.status === "Critical").length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Total Batteries</h3>
        <p className="text-4xl font-bold text-white">{batteries.length}</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Average Health</h3>
        <p className="text-4xl font-bold text-white">{averageHealth.toFixed(1)}%</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Critical Status</h3>
        <p className="text-4xl font-bold text-white">{criticalBatteries}</p>
      </div>
    </div>
  );
};

const BatteryTable: React.FC<{ 
  batteries: Battery[],
  onDelete: (id: number) => Promise<void>
}> = ({ batteries, onDelete }) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this battery?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting battery:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 overflow-hidden animate-glow">
      <h2 className="text-xl font-semibold text-white mb-4">Battery Health Details</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-sm font-medium text-gray-400">Name</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-400">Health</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-400">Cycles</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batteries.map(battery => (
              <tr key={battery.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-white">{battery.name}</div>
                    <div className="text-sm text-gray-400">{battery.serialNumber}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${battery.status === 'Good' ? 'bg-green-900/30 text-green-400' : 
                      battery.status === 'Fair' ? 'bg-yellow-900/30 text-yellow-400' :
                      battery.status === 'Poor' ? 'bg-orange-900/30 text-orange-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                    {battery.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-white">{battery.healthPercentage}%</span>
                    <div className="w-full h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          battery.healthPercentage > 80 ? 'bg-green-500' :
                          battery.healthPercentage > 60 ? 'bg-yellow-500' :
                          battery.healthPercentage > 40 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${battery.healthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-white">{battery.cycleCount}</div>
                  <div className="text-sm text-gray-400">of {battery.expectedCycles}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Link href={`/battery/${battery.id}`}>
                      <a className="p-1 bg-blue-900/30 rounded-lg hover:bg-blue-800/50 text-blue-400">
                        View
                      </a>
                    </Link>
                    <button 
                      className="p-1 bg-red-900/30 rounded-lg hover:bg-red-800/50 text-red-400"
                      onClick={() => handleDelete(battery.id)}
                      disabled={deletingId === battery.id}
                    >
                      {deletingId === battery.id ? (
                        <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                      ) : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RealtimeIndicator: React.FC = () => {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 rounded-full text-xs text-white flex items-center">
      <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
      <span>Real-time updates{dots}</span>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { 
    batteries, 
    fetchBatteries, 
    isLoading, 
    startRealtimeUpdates,
    deleteBattery 
  } = useBatteryStore();
  
  useEffect(() => {
    // Fetch battery data on initial load
    fetchBatteries();
    
    // Start simulated real-time updates
    startRealtimeUpdates();
    
    // Cleanup function to stop real-time updates when unmounting
    return () => {
      useBatteryStore.getState().stopRealtimeUpdates();
    };
  }, [fetchBatteries, startRealtimeUpdates]);
  
  const handleDeleteBattery = async (id: number) => {
    await deleteBattery(id);
  };
  
  return (
    <>
      <Head>
        <title>Battery Health Dashboard | Coulomb.ai</title>
        <meta name="description" content="Monitor your battery health, performance metrics, and receive maintenance recommendations in real-time." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader />
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              <BatteryOverview batteries={batteries} />
              <BatteryTable batteries={batteries} onDelete={handleDeleteBattery} />
            </>
          )}
          
          <RealtimeIndicator />
        </div>
      </div>
    </>
  );
};

export default Dashboard;