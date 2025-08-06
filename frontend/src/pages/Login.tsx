import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Login: isAuthenticated is true, navigating to /dashboard");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard"); // Ensure navigation after login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                StudySync
              </span>
            </div>
            <div className="text-sm text-gray-600">
              New to StudySync?
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </CardTitle>
              <p className="text-lg text-gray-600">
                Sign in to continue your study journey
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Lock className="w-4 h-4 mr-1" />
                      Password
                    </Label>
                    <p className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Forgot password?
                    </p>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 h-auto font-medium"
                >
                  <span className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
