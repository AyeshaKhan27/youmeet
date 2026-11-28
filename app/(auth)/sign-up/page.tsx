"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = "Full name is required.";
    }

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password && confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.add({
        title: "Missing or invalid fields",
        description:
          errors.name ??
          errors.email ??
          errors.password ??
          errors.confirmPassword ??
          "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.add({
          title: "Sign up failed",
          description: error.message ?? "Could not create account.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Account created",
        description: "Welcome to YouMeet!",
        type: "success",
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.add({
        title: "Sign up failed",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.add({
          title: `${provider === "google" ? "Google" : "GitHub"} sign up failed`,
          description: error.message ?? `Could not continue with ${provider}.`,
          type: "error",
        });
        setSocialLoading(null);
      }
    } catch (err) {
      toast.add({
        title: "Authentication error",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
        type: "error",
      });
      setSocialLoading(null);
    }
  };

  return (
    <Card className="w-full rounded-2xl border-border/70 bg-card/95 shadow-xl shadow-rose-950/10 ring-1 ring-primary/10 backdrop-blur-sm dark:shadow-black/40">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Get started with YouMeet in just a few seconds
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full gap-2 font-medium"
            disabled={loading || socialLoading !== null}
            onClick={() => handleSocialSignIn("google")}
          >
            {socialLoading === "google" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 w-full gap-2 font-medium"
            disabled={loading || socialLoading !== null}
            onClick={() => handleSocialSignIn("github")}
          >
            {socialLoading === "github" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg
                className="size-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
            )}
            GitHub
          </Button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
            or
          </span>
          <div className="w-full border-t border-border" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className={cn(fieldErrors.name && "text-destructive")}
            >
              Full Name
            </Label>
            <div className="relative">
              <User
                className={cn(
                  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
                  fieldErrors.name && "text-destructive",
                )}
              />
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                aria-invalid={!!fieldErrors.name}
                className={cn(
                  "h-10 pl-9",
                  fieldErrors.name &&
                    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
                )}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-xs text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className={cn(fieldErrors.email && "text-destructive")}
            >
              Email
            </Label>
            <div className="relative">
              <Mail
                className={cn(
                  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
                  fieldErrors.email && "text-destructive",
                )}
              />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                className={cn(
                  "h-10 pl-9",
                  fieldErrors.email &&
                    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
                )}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className={cn(fieldErrors.password && "text-destructive")}
            >
              Password
            </Label>
            <div className="relative">
              <Lock
                className={cn(
                  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
                  fieldErrors.password && "text-destructive",
                )}
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.password}
                className={cn(
                  "h-10 pr-10 pl-9",
                  fieldErrors.password &&
                    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
                )}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className={cn(fieldErrors.confirmPassword && "text-destructive")}
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Lock
                className={cn(
                  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
                  fieldErrors.confirmPassword && "text-destructive",
                )}
              />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.confirmPassword}
                className={cn(
                  "h-10 pr-10 pl-9",
                  fieldErrors.confirmPassword &&
                    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
                )}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-10 w-full font-medium shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30"
            disabled={loading || socialLoading !== null}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border/60 pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
