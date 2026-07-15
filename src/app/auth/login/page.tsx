"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const setUser = useAppStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          if (data.session) {
            setUser(data.user);
            document.cookie = "flow_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            router.push("/dashboard");
          } else {
            setSuccess("Registration successful! Please check your email for a confirmation link.");
            setEmail("");
            setPassword("");
          }
        }
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          setUser(data.user);
          document.cookie = "flow_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete authentication. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({
      id: "demo-user-id",
      email: "stolaputih@gmail.com",
      role: "authenticated",
      aud: "authenticated",
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
    } as any);
    document.cookie = "flow_demo_mode=true; path=/; max-age=2592000; SameSite=Lax; Secure";
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center rotate-3 shadow-sm">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center -rotate-6 shadow-lg">
              {isSignUp ? <UserPlus className="text-white" size={32} /> : <LogIn className="text-white" size={32} />}
            </div>
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold tracking-tight text-foreground">
          {isSignUp ? "Create your account" : "Sign in to Project 2.0"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Church Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 shadow-xl shadow-slate-200/40 dark:shadow-none border border-border rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-start gap-3 text-sm">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-start gap-3 text-sm">
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3 border border-border rounded-2xl bg-background placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3 border border-border rounded-2xl bg-background placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading 
                  ? (isSignUp ? "Signing up..." : "Signing in...") 
                  : (isSignUp ? "Sign Up" : "Sign In")
                }
              </button>

              <div className="text-center text-sm text-slate-500 mt-4">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="font-semibold text-primary-600 hover:text-primary-500 hover:underline focus:outline-none"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>

              {!isSignUp && (
                <>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full flex justify-center py-3.5 px-4 border border-primary-600 dark:border-primary-500 rounded-2xl shadow-sm text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98]"
                  >
                    Use Demo Account
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
