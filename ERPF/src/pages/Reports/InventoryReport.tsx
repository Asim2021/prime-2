import { useState, useMemo } from "react";
import { Button, Group, Stack, Text, Paper, Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import MainTable from "@components/Table";
import {
  fetchInventoryReport,
  InventoryReportResponseI,
} from "@services/reportService";
import { QUERY_KEY } from "@constants/queryKeys";
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
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";

const InventoryReport = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading, isError, error } = usePaginationDataFetch({
    queryKey: [QUERY_KEY.REPORTS, "inventory"],
    queryFn: fetchInventoryReport,
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
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

  const table = useReactTable({
    data: data?.data || [],
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
    <div className="w-full h-full pb-24 relative">
      <Group justify="space-between" maw={"100%"}>
        <Paper
          p="xs"
          withBorder
          bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
          className="flex-1"
        >
          <Text size="sm">
            <b>Total Inventory Value: </b> ₹
            {data?.meta?.total_inventory_value?.toLocaleString() || 0}
          </Text>
        </Paper>
        <Button leftSection={<MdDownload />} variant="outline">
          Export CSV
        </Button>
      </Group>

      <MainTable
        id="inventory-report-table"
        table={table}
        isLoading={isLoading}
        isError={isError}
        error={error}
        totalCount={data?.totalCount || 0}
        totalPages={data?.totalPages || 1}
        setPagination={setPagination}
        columnOrder={[
          "brand_name",
          "generic_name",
          "batch_no",
          "exp_date",
          "quantity_available",
          "mrp",
        ]}
        setColumnOrder={() => {}}
        columnIdsToSort={[
          "brand_name",
          "generic_name",
          "batch_no",
          "exp_date",
          "quantity_available",
          "mrp",
        ]}
        withFooter
      />
    </div>
  );
};

export default InventoryReport;
