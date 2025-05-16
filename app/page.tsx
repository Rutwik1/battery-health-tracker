import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Image src="/logo.svg" alt="Coulomb.ai Logo" width={140} height={32} priority />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="#features" 
                className="text-sm font-medium text-foreground/80 hover:text-foreground hover:underline underline-offset-4"
              >
                Features
              </Link>
              <Link 
                href="#about" 
                className="text-sm font-medium text-foreground/80 hover:text-foreground hover:underline underline-offset-4"
              >
                About
              </Link>
              <Link 
                href="#contact" 
                className="text-sm font-medium text-foreground/80 hover:text-foreground hover:underline underline-offset-4"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground border border-border/50 hover:border-border"
              >
                Login
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 gradient-heading">
                Battery Health Dashboard
              </h1>
              <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Monitor and optimize your battery performance with advanced analytics and real-time insights.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                >
                  Get Started
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium border border-border/50 hover:border-border"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-card/30 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold gradient-heading mb-4">Key Features</h2>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                Our platform provides comprehensive tools to monitor and optimize battery performance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-xl border border-border/30 card-glow">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 10V14M17.5 10V14M6.5 7H4C2.89543 7 2 7.89543 2 9V15C2 16.1046 2.89543 17 4 17H6.5V7ZM17.5 7H20C21.1046 7 22 7.89543 22 9V15C22 16.1046 21.1046 17 20 17H17.5V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 13H6.5M17.5 8H6.5M17.5 11H6.5M17.5 16H6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-foreground/80">
                  Track battery health metrics with live data updates and detailed insights on performance.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-xl border border-border/30 card-glow">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M21 7L15.4 13.8C15.1276 14.1326 14.9915 14.2989 14.8258 14.3692C14.68 14.4311 14.5201 14.4493 14.3618 14.4214C14.1827 14.3892 14.0215 14.2638 13.699 14.013L10.301 11.487C9.97854 11.2362 9.81731 11.1108 9.63818 11.0786C9.47992 11.0507 9.32001 11.0689 9.17423 11.1308C9.00848 11.2011 8.87238 11.3674 8.60018 11.7L3 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-foreground/80">
                  Powerful data visualization and predictive analysis tools to help optimize battery lifespan.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-xl border border-border/30 card-glow">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-foreground/80">
                  Get actionable insights to optimize battery performance and extend overall lifespan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card/30 backdrop-blur-md border-t border-border/40 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image src="/logo.svg" alt="Coulomb.ai Logo" width={120} height={30} />
              <p className="mt-2 text-sm text-foreground/60">
                &copy; {new Date().getFullYear()} Coulomb.ai. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-foreground/60 hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}