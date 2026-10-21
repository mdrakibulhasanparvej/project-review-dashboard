import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export default function TableSkeleton({
  columns = 6,
  rows = 5,
}: TableSkeletonProps) {
  const rowKeys = Array.from({ length: rows }, (_, index) => `row-${index}`);
  const columnKeys = Array.from(
    { length: columns },
    (_, index) => `column-${index}`,
  );

  return (
    <Table>
      <TableBody>
        {rowKeys.map((rowKey) => (
          <TableRow key={rowKey}>
            {columnKeys.map((columnKey) => (
              <TableCell key={columnKey}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
