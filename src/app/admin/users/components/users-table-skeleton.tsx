"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

type UsersTableSkeletonProps = {
  rows?: number;
};

/**
 * Custom skeleton for users table matching column structure:
 * Avatar + Name/Email | Phone | Role | Join Date
 */
export function UsersTableSkeleton({ rows = 5 }: UsersTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {/* User column: Avatar + Name/Email */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </TableCell>
          {/* Phone column */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          {/* Role column */}
          <TableCell>
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          {/* Join Date column */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
