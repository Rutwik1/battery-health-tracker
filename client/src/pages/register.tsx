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
      await signUp(email, password, username);
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now sign in.",
        variant: "default",
      });
      setLocation("/login");
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
            
            {/* Google login option removed since it's not currently enabled in Supabase */}
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