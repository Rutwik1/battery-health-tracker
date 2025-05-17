import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, Zap } from "lucide-react";
import { supabase } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function VerifyPage() {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute("/verify");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Check if we're returning from an email verification link
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          // The user is now logged in and verified
          setStatus("success");
          toast({
            title: "Email verified",
            description: "Your email has been verified successfully.",
            variant: "default",
          });
        } else {
          // No session yet, check for auth params in URL
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken) {
            // Process the tokens from the email verification link
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (error) {
              throw error;
            }
            
            if (data.session) {
              setStatus("success");
              toast({
                title: "Email verified",
                description: "Your email has been verified successfully.",
                variant: "default",
              });
            } else {
              throw new Error("Failed to verify email. Please try again.");
            }
          } else {
            // Just show instructions if no tokens are present
            setStatus("error");
            setErrorMessage("Please check your email for the verification link.");
          }
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "There was an error verifying your email. Please try again.");
      }
    };

    handleEmailVerification();
  }, [toast]);

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
          <span className="text-gradient">Email Verification</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {status === "loading" 
            ? "Verifying your email address..." 
            : status === "success" 
              ? "Your email has been verified successfully." 
              : "We need to verify your email address."}
        </p>
      </div>
      
      <Card className="w-full max-w-md backdrop-blur-md bg-card/30 border border-border/30 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" 
              ? "Processing your verification..." 
              : status === "success" 
                ? "You're all set!" 
                : "Please check your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="text-center mt-4">Verifying your email address...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center mt-4">Your email has been verified successfully.</p>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex flex-col items-center gap-4 w-full">
              {errorMessage && (
                <Alert variant="default" className="mb-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <div className="text-center space-y-4">
                <p>We've sent a verification link to your email address.</p>
                <p className="text-sm text-muted-foreground">Please check your inbox and click the link to verify your account.</p>
                <p className="text-sm text-muted-foreground">Don't see the email? Check your spam folder.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "success" ? (
            <Button
              className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background shadow-md shadow-primary/20 group"
              onClick={() => setLocation("/dashboard")}
            >
              <span className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity"></span>
              Continue to Dashboard
            </Button>
          ) : status === "error" ? (
            <div className="flex flex-col w-full gap-2">
              <Button
                variant="outline"
                className="w-full bg-white/5 border-border/50 backdrop-blur-md hover:bg-white/10"
                onClick={() => window.location.reload()}
              >
                Check Verification Status
              </Button>
              <Button
                variant="link"
                className="text-muted-foreground"
                onClick={() => setLocation("/login")}
              >
                Back to Login
              </Button>
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}