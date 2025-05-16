import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Coulomb.ai - Advanced Battery Health Management</title>
        <meta name="description" content="Transform your battery management with Coulomb.ai's cutting-edge dashboard. Monitor health, track performance, and extend battery life with real-time analytics." />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent z-0"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                Battery Management Reimagined
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Transform complex battery data into actionable insights with our real-time monitoring platform
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/dashboard">
                  <a className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all">
                    Go to Dashboard
                  </a>
                </Link>
                
                <a 
                  href="#features" 
                  className="px-8 py-3 border border-purple-500/50 rounded-lg text-purple-400 font-medium hover:bg-purple-500/10 transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-950">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Advanced Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 hover:translate-y-[-5px] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-700/30 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-Time Monitoring</h3>
                <p className="text-gray-400">Track battery health, cycles, and performance metrics with live updates and historical data visualization.</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 hover:translate-y-[-5px] transition-all duration-300">
                <div className="w-12 h-12 bg-blue-700/30 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Predictive Analytics</h3>
                <p className="text-gray-400">Forecast battery lifespan and performance with AI-powered analytics that predict degradation patterns.</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 hover:translate-y-[-5px] transition-all duration-300">
                <div className="w-12 h-12 bg-green-700/30 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Smart Recommendations</h3>
                <p className="text-gray-400">Receive personalized maintenance suggestions and optimization tips to extend battery lifespan.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-10 border border-purple-500/20 shadow-xl">
              <h2 className="text-3xl font-bold text-center mb-6 text-white">
                Ready to Optimize Your Battery Performance?
              </h2>
              
              <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
                Start monitoring your batteries in real-time and gain valuable insights with our comprehensive dashboard.
              </p>
              
              <div className="flex justify-center">
                <Link href="/dashboard">
                  <a className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all">
                    Go to Dashboard
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}