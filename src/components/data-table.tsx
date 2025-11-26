"use client"

import * as React from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  OnChangeFn,
  RowSelectionState
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table-pagination"
import { SingleSelect } from "./single-select";

export function DataTable<T extends { publicId: string }>({
  filters,
  data,
  columns,
  rowSelection,
  onRowSelectionChange,
}: {
  filters: {id: string; value: unknown}[]
  data: T[]
  columns: ColumnDef<T, any>[]
  rowSelection: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: onRowSelectionChange,
    onPaginationChange: setPagination,
    getRowId: (row) => row.publicId,
    state: {
      sorting,
      columnFilters: filters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  // console.log('initialState',table.initialState)
  // console.log('state',table.getState())
  // console.log('allColumns',table.getAllColumns())
  // console.log('headerGroups',table.getHeaderGroups())
  console.log('rows',table.getRowModel().rows)

  return (
    <div className="w-full max-w-full">
      <div className="relative max-w-full overflow-x-auto rounded-md border">
        <Table className="min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  const isFirst = idx === 0
                  const isLast = idx === headerGroup.headers.length - 1
                  const stickyClass = isFirst
                    ? "sticky left-0 z-10 bg-background"
                    : isLast
                    ? "sticky right-0 z-10 bg-background"
                    : ""
                  return (
                    <TableHead key={header.id} className={stickyClass}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    const isFirst = idx === 0
                    const isLast = idx === row.getVisibleCells().length - 1
                    const stickyClass = isFirst
                      ? "sticky left-0 z-10 bg-background"
                      : isLast
                      ? "sticky right-0 z-10 bg-background"
                      : ""
                    return (
                      <TableCell key={cell.id} className={stickyClass}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-end py-4 gap-6">
        <div className="flex-1 text-sm flex items-center justify-between">
            <div className="text-muted-foreground w-30">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} selected.
            </div>
          <div className="flex items-center">
            <SingleSelect
              value={pagination.pageSize}
              onChange={(value) => setPagination({ ...pagination, pageSize: value })}
              label="每页显示条数"
              canClear={false}
              options={[
              { label: "5", value: 5 },
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "30", value: 30 },
            ]}
            className="!w-11"
            
          />
          <span className="ml-2 w-12 ">行 / 页</span>
        </div>
        </div>

        <div className="shrink">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}
