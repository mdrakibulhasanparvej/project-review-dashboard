"use client";
import {
  IconEye,
  IconEyeClosed,
  IconSchool,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/schemas";
import triggerToast from "@/utils/triggerToast";

/**
 * Seeded accounts (see the backend `seed` script). Clicking one fills the
 * email and password fields — the Login button then signs in with that role.
 */
const ROLE_ACCOUNTS = [
  {
    role: "Student",
    email: "student@test.com",
    password: "Student123",
    icon: IconUser,
  },
  {
    role: "Mentor",
    email: "mentor@example.com",
    password: "Mentor@123",
    icon: IconSchool,
  },
  {
    role: "Admin",
    email: "admin@example.com",
    password: "Admin@123",
    icon: IconShieldCheck,
  },
] as const;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: login, isPending } = useLogin();

  const authenticate = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: (res) => {
          setActiveRole(null);
          if (!res.success) {
            triggerToast({
              type: "error",
              title: "Login Failure",
              description: res.message || "Internal Server error",
            });
            return;
          }
          const role = res.data?.role;
          const destination =
            role === "STUDENT"
              ? "/student/submissions"
              : role === "MENTOR"
                ? "/mentor/submissions"
                : role === "ADMIN"
                  ? "/admin/overview"
                  : undefined;

          if (!destination) {
            triggerToast({
              type: "error",
              title: "Unable to open dashboard",
              description: "The account role is not supported.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Login Successful",
            description: "Welcome back.",
          });
          router.push(destination);
        },
        onError: (err: FetchError) => {
          setActiveRole(null);
          const message = err.data?.message;
          triggerToast({
            type: "error",
            title: "Error while login",
            description: message || "Internal Server Error",
          });
        },
      },
    );
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      authenticate(value.email, value.password);
    },
  });

  const fillRole = (account: (typeof ROLE_ACCOUNTS)[number]) => {
    setActiveRole(account.role);
    form.setFieldValue("email", account.email);
    form.setFieldValue("password", account.password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your project-review-dashboard account
                </p>
              </div>

              {/* email */}
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        name={field.name}
                        id={field.name}
                        type="email"
                        onBlur={field.handleBlur}
                        placeholder="m@example.com"
                        required
                        onChange={(e) => {
                          setActiveRole(null);
                          field.handleChange(e.target.value);
                        }}
                        value={field.state.value}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* password */}
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setShowPassword((visible) => !visible)}
                          className="absolute right-0.5 top-1/2 -translate-y-1/2"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <IconEye size={20} />
                          ) : (
                            <IconEyeClosed size={20} />
                          )}
                        </Button>
                        <Input
                          name={field.name}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          onBlur={field.handleBlur}
                          placeholder="your password"
                          onChange={(e) => field.handleChange(e.target.value)}
                          value={field.state.value}
                          aria-invalid={isInvalid}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* forget button */}
              <Button disabled={isPending} type="submit">
                {isPending && <Spinner />}
                {isPending ? "Logging in.." : "Login"}
              </Button>

              <FieldSeparator>Use a demo account</FieldSeparator>

              <div className="grid gap-2 sm:grid-cols-3">
                {ROLE_ACCOUNTS.map((account) => {
                  const Icon = account.icon;
                  const isActive = activeRole === account.role;
                  return (
                    <Button
                      key={account.role}
                      type="button"
                      variant={isActive ? "secondary" : "outline"}
                      disabled={isPending}
                      onClick={() => fillRole(account)}
                      aria-label={`Fill the ${account.role} demo account`}
                      aria-pressed={isActive}
                    >
                      <Icon aria-hidden="true" />
                      {account.role}
                    </Button>
                  );
                })}
              </div>

              <FieldDescription className="text-center text-xs">
                Pick a role to fill the form, then press Login.
              </FieldDescription>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/registration">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              fill
              src="/loginBanner.png"
              alt="Login banner"
              sizes="(min-width: 768px) 50vw, 0px"
              quality={90}
              className="object-cover dark:brightness-[0.8]"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
