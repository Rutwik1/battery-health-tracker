import React, { useState } from 'react';
import { useBatteryStore } from '../../store/batteryStore';

export default function AddBatteryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    initialCapacity: 5000,
    currentCapacity: 5000,
    healthPercentage: 100,
    cycleCount: 0,
    expectedCycles: 500,
    status: 'Good',
    initialDate: new Date().toISOString().split('T')[0],
    degradationRate: 0.5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addBattery } = useBatteryStore();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Auto-update current capacity based on health percentage if initial capacity changes
    if (name === 'initialCapacity') {
      const initialCapacity = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        currentCapacity: Math.round((initialCapacity * prev.healthPercentage) / 100)
      }));
    }
    
    // Auto-update current capacity if health percentage changes
    if (name === 'healthPercentage') {
      const healthPercentage = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        currentCapacity: Math.round((prev.initialCapacity * healthPercentage) / 100)
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addBattery({
        ...formData,
        initialDate: new Date(formData.initialDate),
        lastUpdated: new Date()
      });
      
      setIsOpen(false);
      setFormData({
        name: '',
        serialNumber: '',
        initialCapacity: 5000,
        currentCapacity: 5000,
        healthPercentage: 100,
        cycleCount: 0,
        expectedCycles: 500,
        status: 'Good',
        initialDate: new Date().toISOString().split('T')[0],
        degradationRate: 0.5,
      });
    } catch (error) {
      console.error('Error adding battery:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:opacity-90 shadow-md"
      >
        Add Battery
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gradient-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-purple-900/30 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Add New Battery</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-purple-400 uppercase">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Battery Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Battery #5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Serial Number*
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., BAT-2025-0005"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-purple-400 uppercase">Technical Specifications</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Initial Capacity (mAh)*
                    </label>
                    <input
                      type="number"
                      name="initialCapacity"
                      value={formData.initialCapacity}
                      onChange={handleChange}
                      min="100"
                      required
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 5000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Health Percentage (%)*
                    </label>
                    <input
                      type="number"
                      name="healthPercentage"
                      value={formData.healthPercentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      required
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-purple-400 uppercase">Usage Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Expected Cycles
                    </label>
                    <input
                      type="number"
                      name="expectedCycles"
                      value={formData.expectedCycles}
                      onChange={handleChange}
                      min="100"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Current Cycle Count
                    </label>
                    <input
                      type="number"
                      name="cycleCount"
                      value={formData.cycleCount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 0"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-purple-400 uppercase">Additional Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Installation Date
                    </label>
                    <input
                      type="date"
                      name="initialDate"
                      value={formData.initialDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Adding...
                    </>
                  ) : 'Add Battery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}