import { Suspense } from "react";
import OAuthProgress from "@/components/authentication/OAuthProgress";
import { Spinner } from "@/components/ui/spinner";

export default function OAuthProgressPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <OAuthProgress />
    </Suspense>
  );
}
