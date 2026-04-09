import { useState } from "react";
import { account } from "@/lib/appwrite";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin@123");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      await checkAuth();
      toast.success("Logged in successfully");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@luxevibes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
            
            <div className="text-xs text-muted-foreground mt-4 text-center">
              <p>Wait, don't have an account?</p>
              <Button variant="link" type="button" onClick={async () => {
                if(!email || !password) {
                  toast.error("Enter email and password to create account");
                  return;
                }
                try {
                  setIsLoading(true);
                  await account.create('unique()', email, password);
                  await account.createEmailPasswordSession(email, password);
                  await checkAuth();
                  toast.success("Account created and logged in!");
                  navigate("/admin/dashboard");
                } catch(error: any) {
                  toast.error(error.message || "Failed to create account");
                } finally {
                  setIsLoading(false);
                }
              }}>
                Create one now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
