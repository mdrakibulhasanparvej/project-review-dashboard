import { IconArrowLeft, IconShieldLock } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
  return (
    <section className="flex min-h-svh flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 flex size-24 items-center justify-center rounded-3xl border border-primary/15 bg-primary/5 text-primary shadow-sm">
          <span className="absolute inset-2 rounded-2xl border border-primary/10" />
          <IconShieldLock
            aria-hidden="true"
            className="relative size-10"
            stroke={1.5}
          />
        </div>

        <p className="mb-3 font-mono text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Error 403
        </p>
        <h1
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          id="access-denied-title"
        >
          This area is restricted
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          Your account doesn&apos;t have permission to view this page. If you
          think this is a mistake, contact your administrator.
        </p>

        <Button className="mt-8" size="lg" render={<Link href="/login" />}>
          <IconArrowLeft aria-hidden="true" />
          Return to Login
        </Button>
      </div>
    </section>
  );
}
