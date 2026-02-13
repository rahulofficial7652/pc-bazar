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
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is installed as per package.json

export default function LoginForm({
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Logged in successfully");

        // Fetch session to check role
        const session = await getSession();
        if (session?.user && (session.user as any).role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
        router.refresh();
      }
    } catch (error) {
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
                Login to your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email to login your account
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
                      placeholder="example@gmail.com"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </Field>
                  <div className="flex items-center gap-2">
                    <input
                      id="show-password"
                      type="checkbox"
                      className="h-4 w-4 rounded border-input"
                      onChange={(e) => {
                        const input = document.getElementById("password") as HTMLInputElement;
                        if (input) input.type = e.target.checked ? "text" : "password";
                      }}
                    />
                    <label
                      htmlFor="show-password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show password
                    </label>
                  </div>
                   

                  <Field>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
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
                      onClick={() => signIn("google", { callbackUrl: "/account" })}
                    >
                      Login with Google
                    </Button>
                  </Field>

                  <div className="mt-2 text-center text-sm"> {/* Spacing for signup link */}
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <Link href="/signup" className="underline text-primary">
                        Sign up
                      </Link>
                    </FieldDescription>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
