"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

interface MyPaginationProps {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

export default function MyPagination({
  page,
  totalPages,
  handlePageChange,
  className,
  disabled = false,
}: MyPaginationProps) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between border-t pt-4",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => handlePageChange(Math.max(1, page - 1))}
        >
          <IconChevronLeft aria-hidden="true" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page >= totalPages}
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        >
          Next
          <IconChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
