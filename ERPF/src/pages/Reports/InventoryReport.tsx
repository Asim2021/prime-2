import { useState, useMemo } from "react";
import { Button, Group, Stack, Text, Paper, Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import MainTable from "@components/Table";
import { fetchInventoryReport } from "@services/reportService";
import { MdDownload } from "react-icons/md";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { CustomTableOptions } from "@src/types/table";

const InventoryReport = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reports", "inventory"],
    queryFn: () => fetchInventoryReport({}),
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: "brand_name", header: "Medicine" },
      { accessorKey: "manufacturer", header: "Manufacturer" },
      { accessorKey: "current_stock", header: "Stock Left" },
      {
        accessorKey: "stock_value",
        header: "Value",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const val = info.getValue() as string;
          return <Badge color={val === "LOW" ? "red" : "green"}>{val}</Badge>;
        },
      },
    ],
    [],
  );

  const tableData = data?.data || [];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    tableId: "inventory-report-table",
  } as CustomTableOptions<any>);

  return (
    <Stack>
      <Group justify="flex-end">
        <Button leftSection={<MdDownload />} variant="outline">
          Export CSV
        </Button>
      </Group>
      <Paper
        p="md"
        withBorder
        bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
      >
        <Text size="sm">
          <b>Total Inventory Value:</b> ₹
          {data?.total_value?.toLocaleString() || 0}
        </Text>
      </Paper>

      <MainTable
        id="inventory-report-table"
        table={table}
        isLoading={isLoading}
        isError={isError}
        error={error}
        totalCount={tableData.length}
        totalPages={Math.ceil(tableData.length / pagination.pageSize)}
        setPagination={setPagination}
        columnOrder={[
          "brand_name",
          "manufacturer",
          "current_stock",
          "stock_value",
          "status",
        ]}
        withFooter
      />
    </Stack>
  );
};

export default InventoryReport;
