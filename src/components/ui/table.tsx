import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className={cn("relative w-full rounded-md", className)}>
    {/*
      Desktop: standard table inside horizontal scroll when needed.
      Mobile: rows collapse into card-like stacked blocks using CSS.
      We keep the outer overflow wrapper so very wide tables can still scroll horizontally on small devices.
    */}
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn(
          "min-w-full w-full caption-bottom text-sm bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100",
          "rounded-lg overflow-hidden shadow-sm",
          className
        )}
        {...props}
      />
    </div>

    <style jsx>{`
      /* Small screens: transform table rows into stacked cards.
         This pattern preserves semantics (table markup) but displays each row as a block.
         It relies on each <td> having a data-label attribute (component prop: dataLabel).
      */
      @media (max-width: 768px) {
        table { border-collapse: separate; }
        table thead { display: none; }
        table, table tbody, table tr, table td, table th { display: block; width: 100%; }

        table tr {
          display: block;
          margin: 0 0 0.75rem 0;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: var(--card, #fff);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.04);
        }

        table td {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 0.5rem 0;
          border: none;
          gap: 1rem;
        }

        /* label area (left) */
        table td::before {
          content: attr(data-label);
          flex: 0 0 35%;
          max-width: 35%;
          font-size: 0.75rem;
          color: rgba(100,100,100,0.9);
          font-weight: 600;
          white-space: normal;
          margin-right: 0.75rem;
        }

        /* value area (right) - ensure wrapping */
        table td .td-value {
          flex: 1 1 65%;
          min-width: 0; /* allow flex children to shrink properly */
          text-align: right;
          word-break: break-word;
          white-space: normal;
        }

        /* ensure action buttons wrap nicely */
        table td .actions, table td .action-group { display: inline-flex; gap: 0.5rem; flex-wrap: wrap; }
      }
    `}</style>
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b border-gray-200 dark:border-slate-700 bg-transparent", className)}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-50 dark:bg-transparent font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-200 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  dataLabel?: string;
}

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(({ className, dataLabel, children, ...props }, ref) => (
  <td
    ref={ref}
    data-label={dataLabel}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0 text-sm", className)}
    {...props}
  >
    <div className="td-value">{children}</div>
  </td>
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
