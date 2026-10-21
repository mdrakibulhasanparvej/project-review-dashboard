"use client";

import { IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import MyPagination from "@/components/shared/Pagination";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMentors } from "@/hooks";
import getInitials from "@/utils/getInitials";

const PAGE_SIZE = 10;

export default function AdminMentorsPage() {
  const [page, setPage] = useState(1);
  const query = useGetMentors({ page, limit: PAGE_SIZE });
  const mentors = query.data?.data ?? [];
  const totalPages = query.data?.meta?.totalPages ?? 1;
  const totalMentors = query.data?.meta?.dataCount;

  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="outline" className="mb-3">
            Admin workspace
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            Mentor directory
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse the mentors registered on the platform.
          </p>
        </div>
        <Card className="min-w-44 border-primary/15 bg-primary/5">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconUsers className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold">
                {query.isLoading ? "—" : (totalMentors ?? mentors.length)}
              </p>
              <p className="text-xs text-muted-foreground">
                Registered mentors
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Mentors</CardTitle>
          <CardDescription>
            Mentor profiles and areas of specialization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {query.isError ? (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
              role="alert"
            >
              Could not load mentors. Please try again.
            </div>
          ) : query.isLoading ? (
            <TableSkeleton columns={4} rows={5} />
          ) : mentors.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                <IconUsers
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
              <p className="font-medium">No mentors found</p>
              <p className="text-sm text-muted-foreground">
                Mentor accounts will appear here once they register.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Graduated from</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentors.map((mentor) => (
                  <TableRow key={mentor.mentor_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={mentor.user.profile_url ?? undefined}
                            alt={mentor.user.name}
                          />
                          <AvatarFallback>
                            {getInitials(mentor.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {mentor.user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {mentor.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{mentor.designation || "—"}</TableCell>
                    <TableCell>
                      {mentor.specialization ? (
                        <Badge variant="secondary">
                          {mentor.specialization}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{mentor.graduated_from || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <MyPagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
            disabled={query.isLoading}
          />
        </CardContent>
      </Card>
    </main>
  );
}
