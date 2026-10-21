import { IconRocket } from "@tabler/icons-react";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SubmissionPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground shadow-sm md:px-9 md:py-10">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white hover:bg-white/10">
            Student workspace
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Share what you&apos;ve built.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80 md:text-base">
            Submit your project for mentor review. Include working links and a
            clear overview so reviewers can get started quickly.
          </p>
        </div>
        <IconRocket
          className="absolute -right-3 -bottom-12 size-56 rotate-12 text-white/10 md:right-8 md:bottom-[-5rem] md:size-72"
          aria-hidden="true"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
            <CardDescription>
              Complete each field before sending your project for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubmissionForm />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Before you submit</CardTitle>
            <CardDescription>
              A few details help mentors give useful feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              {[
                [
                  "Check your links",
                  "Make sure your repository and live demo are accessible.",
                ],
                [
                  "Add context",
                  "Explain the goal, key features, and tools you used.",
                ],
                [
                  "Ask for feedback",
                  "Mention a specific area where you want guidance.",
                ],
              ].map(([title, description], index) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
