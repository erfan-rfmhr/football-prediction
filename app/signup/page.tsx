"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { signup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }
    
    setIsLoading(true);

    try {
      await signup(username, password, email || undefined);
      setIsLoading(false);
      router.push(callbackUrl);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Signup failed");
    }
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">ثبت‌نام</CardTitle>
        <CardDescription className="text-muted-foreground">
          برای ایجاد حساب کاربری، اطلاعات زیر را وارد کنید.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2 relative">
            <div className="relative">
              <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="نام کاربری (الزامی)"
                className="pr-9 rtl:pl-3 rtl:pr-9 bg-background/50 border-white/10 focus-visible:ring-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="ایمیل (اختیاری)"
                className="pr-9 rtl:pl-3 rtl:pr-9 bg-background/50 border-white/10 focus-visible:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="رمز عبور (الزامی)"
                className="pr-9 rtl:pl-3 rtl:pr-9 bg-background/50 border-white/10 focus-visible:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="تکرار رمز عبور (الزامی)"
                className="pr-9 rtl:pl-3 rtl:pr-9 bg-background/50 border-white/10 focus-visible:ring-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
        <p>
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="text-primary hover:underline underline-offset-4">
            وارد شوید
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full flex justify-center px-4">
        <Suspense fallback={<div className="w-full max-w-md h-96 bg-white/5 animate-pulse rounded-xl" />}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
