"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

type PostsTableSkeletonProps = {
  rows?: number;
};

/**
 * Custom skeleton for posts table matching column structure:
 * Image | Title + Address | Price | Type | Status | Creator | Created
 */
export function PostsTableSkeleton({ rows = 5 }: PostsTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {/* Image column */}
          <TableCell>
            <Skeleton className="h-12 w-16 rounded-md" />
          </TableCell>
          {/* Title + Address column */}
          <TableCell>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </TableCell>
          {/* Price column */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          {/* Type column */}
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          {/* Status column */}
          <TableCell>
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          {/* Creator column */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          {/* Created column */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
