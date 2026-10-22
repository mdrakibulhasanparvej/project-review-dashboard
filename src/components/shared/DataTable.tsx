"use client";

import { cn } from "cn";
import type { ComponentType, ReactNode } from "react";
import MyPagination from "@/components/shared/Pagination";
import TableSkeleton from "@/components/shared/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: "true" | "false";
}>;

export interface DataTableColumn<T> {
  id: string;
  header: string;
  /** Applied to the header cell and every body cell, so alignment lives here. */
  className?: string;
  cell: (row: T) => ReactNode;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyState?: {
    icon: IconComponent;
    title: string;
    description: string;
  };
  /** Omit to render the table without a pagination footer. */
  pagination?: DataTablePagination;
}

/**
 * Table shell shared by the dashboard lists: loading skeleton, error and empty
 * states, then an optional pagination footer. Column rendering is delegated to
 * the caller through `cell`, so rows stay free to contain buttons and selects.
 */
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  isError = false,
  errorMessage = "Could not load this list. Please try again.",
  emptyState,
  pagination,
}: DataTableProps<T>) {
  if (isError) {
    return (
      <div
        className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        role="alert"
      >
        {errorMessage}
      </div>
    );
  }

  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={5} />;
  }

  if (rows.length === 0) {
    const EmptyIcon = emptyState?.icon;

    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
        {EmptyIcon && (
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <EmptyIcon
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
        )}
        <p className="font-medium">{emptyState?.title ?? "Nothing here yet"}</p>
        {emptyState?.description && (
          <p className="text-sm text-muted-foreground">
            {emptyState.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={cn(column.className)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.id} className={cn(column.className)}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <MyPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          handlePageChange={pagination.onPageChange}
          disabled={pagination.disabled}
        />
      )}
    </>
  );
}
