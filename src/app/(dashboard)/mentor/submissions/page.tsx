"use client";

import { useState } from "react";
import SubmissionStats from "@/components/modules/submission/SubmissionStats";
import SubmissionTable from "@/components/modules/submission/SubmissionTable";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubmissionStatus } from "@/types";

export default function MentorDashboard() {
  const [filter, setFilter] = useState<SubmissionStatus | "">("");
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 10,
    ...(filter ? { status: filter } : {}),
  };

  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="outline" className="mb-3">
            Mentor workspace
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            Submission reviews
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review student projects and help them take the next step.
          </p>
        </div>
      </section>

      <SubmissionStats />

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Project queue</CardTitle>
            <CardDescription className="mt-1">
              Open a project link, then approve it or request a revision.
            </CardDescription>
          </div>
          <Select
            value={filter || "ALL"}
            onValueChange={(value) => {
              if (value === "ALL") {
                setFilter("");
              } else if (
                value === "PENDING" ||
                value === "APPROVED" ||
                value === "REJECTED"
              ) {
                setFilter(value);
              }
              setPage(1);
            }}
          >
            <SelectTrigger
              className="w-full sm:w-44"
              aria-label="Filter submissions by status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-4">
          <SubmissionTable
            params={params}
            page={page}
            handlePageChange={setPage}
          />
        </CardContent>
      </Card>
    </main>
  );
}
