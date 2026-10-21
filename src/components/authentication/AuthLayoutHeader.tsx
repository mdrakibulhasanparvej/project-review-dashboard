import Link from "next/link";
import ThemeToggleButton from "@/components/Buttons/ThemeToggleButton";
import Logo from "@/components/shared/Logo";

export default function AuthLayoutHeader() {
  return (
    <header className="bg-muted flex h-12 shrink-0 items-center border-b">
      <div className="flex w-full items-center px-4 lg:px-6">
        <Link href="/" aria-label="project-review-dashboard home">
          <Logo />
        </Link>
        <div className="ml-auto">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
