
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "signIn" | "signUp";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    let errorMsg = "";
    if (mode === "signIn") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) errorMsg = error.message;
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) errorMsg = error.message;
    }
    setLoading(false);
    if (errorMsg) {
      toast({ title: "Authentication failed", description: errorMsg, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "You are signed in.", variant: "default" });
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "signIn" ? "Log In" : "Sign Up"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleAuth}>
            <div>
              <Input
                required
                autoFocus
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                required
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? (mode === "signIn" ? "Logging in..." : "Signing up...")
                : (mode === "signIn" ? "Login" : "Sign up")}
            </Button>
          </form>
          <div className="flex justify-between mt-4 text-sm">
            {mode === "signIn" ? (
              <span>
                New here?{" "}
                <button className="text-primary underline" type="button" onClick={() => setMode("signUp")}>
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button className="text-primary underline" type="button" onClick={() => setMode("signIn")}>
                  Log In
                </button>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
