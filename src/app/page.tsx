import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with logo and navigation */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 fixed w-full z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl gradient-text">Coulomb.ai</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
              Benefits
            </Link>
            <Button asChild variant="gradient">
              <Link href="/dashboard">Launch Dashboard</Link>
            </Button>
          </nav>
          <Button asChild variant="gradient" className="md:hidden">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-background"></div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight gradient-text">
              Advanced Battery Health Monitoring
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Transform complex battery data into actionable insights with our AI-powered analytics platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" variant="gradient" className="text-base">
                <Link href="/dashboard">Launch Dashboard</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Powerful Battery Analytics</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive monitoring and optimization tools for all your battery assets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="battery-card p-6 glow">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v5"></path><path d="M12 17v5"></path><path d="m4.93 10.93 3.54 3.54"></path><path d="m15.54 15.54 3.54 3.54"></path><path d="M2 12h5"></path><path d="M17 12h5"></path><path d="m10.93 4.93-3.54 3.54"></path><path d="m15.54 8.46 3.54-3.54"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Track battery health, performance, and usage patterns in real-time with intuitive dashboards.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="battery-card p-6 glow">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Predictive Analytics</h3>
              <p className="text-muted-foreground">
                AI-powered algorithms predict battery life, maintenance needs, and optimize performance.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="battery-card p-6 glow">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Customizable Reports</h3>
              <p className="text-muted-foreground">
                Generate detailed reports and export data for analysis and compliance documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section id="benefits" className="py-20 bg-muted/20 relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Why Choose Coulomb.ai</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our battery management solution provides tangible benefits for businesses of all sizes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {/* Benefit 1 */}
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Extend Battery Life</h3>
                  <p className="text-muted-foreground">
                    Maximize the lifespan of your batteries with optimization recommendations and early issue detection.
                  </p>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Reduce Costs</h3>
                  <p className="text-muted-foreground">
                    Lower replacement and maintenance costs through proactive management and usage optimization.
                  </p>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Compliance Ready</h3>
                  <p className="text-muted-foreground">
                    Comprehensive reporting and audit trails to meet regulatory and compliance requirements.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Benefits image/illustration */}
            <div className="relative h-full min-h-[300px] flex items-center justify-center">
              <div className="battery-card w-full h-full p-8 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full max-w-xs">
                  <div className="absolute inset-0 glow opacity-60"></div>
                  <div className="w-full h-full relative flex flex-col items-center justify-center text-center p-6">
                    <div className="text-5xl font-bold gradient-text">40%</div>
                    <div className="text-xl mt-2">Longer Battery Life</div>
                    <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent my-4"></div>
                    <div className="text-4xl font-bold gradient-text">60%</div>
                    <div className="text-xl mt-2">Reduced Failures</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-background"></div>
        <div className="container relative z-10">
          <div className="battery-card p-10 md:p-16 text-center max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 glow opacity-20"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Ready to optimize your battery performance?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get started with our advanced battery management platform today and see the difference.
            </p>
            <Button asChild size="lg" variant="gradient" className="text-base">
              <Link href="/dashboard">Launch Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="font-bold gradient-text">Coulomb.ai</span>
              <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} All rights reserved</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}