import { useState } from "react";
import { useLocation } from "wouter";
import { signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await signUp(email, password, username);
      
      if (response.user) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
          variant: "default",
        });
        // Redirect to verification page instead of login
        setLocation("/verify");
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { supabase } = await import("@/lib/auth");
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-primary/5 via-accent/3 to-transparent -z-10"></div>
      <div className="absolute top-40 left-20 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] -z-10"></div>
      <div className="absolute top-80 right-20 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[100px] -z-10"></div>
      
      <div className="mb-12 text-center">
        <div className="inline-flex items-center space-x-2 mb-6">
          <div className="bg-primary/10 p-2 rounded-md backdrop-blur-md">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <span className="text-2xl font-medium text-primary">Coulomb.ai</span>
        </div>
        <h1 className="text-4xl font-heading font-bold mb-3">
          <span className="text-gradient">Create Account</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Sign up to access your battery health dashboard and analytics
        </p>
      </div>
      
      <Card className="w-full max-w-md backdrop-blur-md bg-card/30 border border-border/30 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="bg-white/10 backdrop-blur-md border-border/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-white/10 backdrop-blur-md border-border/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="bg-white/10 backdrop-blur-md border-border/50"
              />
              <p className="text-sm text-muted-foreground">
                Password must be at least 6 characters
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background shadow-md shadow-primary/20 group"
              disabled={loading}
            >
              <span className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity"></span>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/30 backdrop-blur-md px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/5 border-border/50 backdrop-blur-md hover:bg-white/10"
              onClick={handleGoogleSignUp}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => setLocation("/login")}
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}