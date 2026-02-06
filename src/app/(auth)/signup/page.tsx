"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function SignupForm({
  className,
  searchParams,
  params,
  ...props
}: React.ComponentProps<"div"> & { searchParams?: any; params?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
         // Logging for developer context if needed
        console.error("[routerError] Signup failed:", data.error?.code || "UNKNOWN");
        toast.error(data.error?.message || data.message || "Registration failed");
      } else {
        toast.success("Account created! Please login.");
        router.push("/login");
      }
    } catch (error) {
      console.error("[routerError] System error during signup:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl md:text-2xl">
                Create your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input id="password" name="password" type="password" required />
                  </Field>
                  <Field>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Sign up"}
                    </Button>
                  </Field>

                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground italic">
                      Or
                    </span>
                  </div>

                  <Field>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full" 
                      onClick={() => signIn("google", { callbackUrl: "/admin" })}
                    >
                      Signup with Google
                    </Button>
                  </Field>

                  <Link href="/login" className="mt-2 block">
                    <FieldDescription className="text-center">
                      Already have an account?{" "}
                      <span className="underline text-primary">Login</span>
                    </FieldDescription>
                  </Link>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
