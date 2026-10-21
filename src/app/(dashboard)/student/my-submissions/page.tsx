import { IconSend } from "@tabler/icons-react";
import Link from "next/link";
import StudentSubmissionTable from "@/components/modules/submission/StudentSubmissionTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MySubmissionsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="outline" className="mb-3">
            Student workspace
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            My submissions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track the review status and read the feedback your mentor left.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/student/submissions" />}
        >
          <IconSend aria-hidden="true" />
          Submit another project
        </Button>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Submission history</CardTitle>
          <CardDescription>
            Every project you have sent for review, with its current status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentSubmissionTable />
        </CardContent>
      </Card>
    </main>
  );
}
