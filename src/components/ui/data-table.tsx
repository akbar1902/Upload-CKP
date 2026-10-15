import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Primitives tabel bersama (memakai token semantik) ─────
   Ringan, tanpa dependency tabel eksternal. Gunakan DataTable
   sebagai wrapper untuk scroll horizontal + state loading/kosong,
   lalu susun isinya dengan Table/TableHeader/TableBody/dst. */

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tampilkan baris skeleton saat data sedang dimuat. */
  isLoading?: boolean;
  /** Jumlah baris skeleton (default 5). */
  skeletonRows?: number;
  /** Jumlah kolom skeleton (default 4). */
  skeletonCols?: number;
  /** Bila true dan `emptyState` diisi, isi tabel diganti empty state. */
  isEmpty?: boolean;
  /** Konten yang tampil saat data kosong (mis. <EmptyState />). */
  emptyState?: React.ReactNode;
}

export function DataTable({
  className,
  isLoading = false,
  skeletonRows = 5,
  skeletonCols = 4,
  isEmpty = false,
  emptyState,
  children,
  ...props
}: DataTableProps) {
  return (
    <div
      className={cn("overflow-x-auto rounded-xl border", className)}
      style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
      {...props}
    >
      {isLoading ? (
        <Table>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <TableRow key={rowIdx} className="hover:bg-transparent" aria-hidden="true">
                {Array.from({ length: skeletonCols }).map((_, colIdx) => (
                  <TableCell key={colIdx} className="py-4">
                    <div
                      className="skeleton h-4"
                      style={{ width: `${[72, 48, 60, 40, 56][colIdx % 5]}%`, minWidth: 56 }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : isEmpty && emptyState ? (
        emptyState
      ) : (
        children
      )}
    </div>
  );
}

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full text-left text-[13px] border-collapse", className)}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("text-[12px]", className)}
      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b last:border-b-0 transition-colors hover:bg-[var(--sand-subtle)]",
        className
      )}
      style={{ borderColor: "var(--border)", ...style }}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-4 py-3 text-left font-medium whitespace-nowrap", className)}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}
