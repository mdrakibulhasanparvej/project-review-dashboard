import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading({
  label = "Verifying account",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="flex items-center gap-3">
        <Spinner className="size-6" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
