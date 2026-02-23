
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";

const formSchema = z.object({
  passcode: z.string().length(6, "Passcode must be 6 digits"),
});

type FormValues = z.infer<typeof formSchema>;

const PASSCODES = {
  admin: "987654",
  doctor: "123456",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"admin" | "doctor" | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setError(null);
    if (selectedRole && data.passcode === PASSCODES[selectedRole]) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("doctor-auth", "true");
        sessionStorage.setItem("user-role", selectedRole);
      }
      router.push("/dashboard");
    } else {
      setError("Invalid passcode. Please try again.");
    }
  };

  if (!selectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl">Doctor Portal</CardTitle>
            <CardDescription>Please choose your role to log in.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => setSelectedRole("admin")} size="lg">
              Login as Admin
            </Button>
            <Button onClick={() => setSelectedRole("doctor")} size="lg">
              Login as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">
            {selectedRole === "admin" ? "Admin" : "Doctor"} Login
          </CardTitle>
          <CardDescription>
            Enter your 6-digit passcode to access the dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode">6-Digit Passcode</Label>
              <Input
                id="passcode"
                type="password"
                maxLength={6}
                {...register("passcode")}
                autoFocus
              />
              {errors.passcode && (
                <p className="text-sm text-destructive">
                  {errors.passcode.message}
                </p>
              )}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setSelectedRole(null)}
              className="w-full"
            >
              Back to role selection
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
