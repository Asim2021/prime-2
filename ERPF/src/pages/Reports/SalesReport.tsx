import { useState, useMemo } from "react";
import { Button, Group, Stack, Text, Paper, SimpleGrid } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import MainTable from "@components/Table";
import { fetchSalesReport } from "@services/reportService";
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

const SalesReport = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date(),
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reports", "sales", dateRange],
    queryFn: () => {
      const [start, end] = dateRange;
      if (!start || !end) return { data: [], stats: {} };
      return fetchSalesReport({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
    },
    enabled: !!dateRange[0] && !!dateRange[1],
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: "invoice_no", header: "Invoice No" },
      {
        accessorKey: "invoice_date",
        header: "Date",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
      { accessorKey: "customer_name", header: "Customer" },
      { accessorKey: "payment_mode", header: "Mode" },
      {
        accessorKey: "total_amount",
        header: "Amount",
        cell: (info) => `₹${info.getValue()}`,
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
    tableId: "sales-report-table",
  } as CustomTableOptions<any>);

  const stats = data?.stats || { total_revenue: 0, total_orders: 0 };

  return (
    <Stack>
      <Group justify="space-between" align="end">
        <DatePickerInput
          type="range"
          label="Date Range"
          placeholder="Select dates"
          value={dateRange}
          onChange={(val) => setDateRange(val as any)}
          w={300}
        />
        <Button leftSection={<MdDownload />} variant="outline">
          Export CSV
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            Total Revenue
          </Text>
          <Text size="xl" fw={700}>
            ₹{stats.total_revenue?.toLocaleString() || 0}
          </Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            Total Orders
          </Text>
          <Text size="xl" fw={700}>
            {stats.total_orders || 0}
          </Text>
        </Paper>
      </SimpleGrid>

      <MainTable
        id="sales-report-table"
        table={table}
        isLoading={isLoading}
        isError={isError}
        error={error}
        totalCount={tableData.length}
        totalPages={Math.ceil(tableData.length / pagination.pageSize)}
        setPagination={setPagination}
        columnOrder={[
          "invoice_no",
          "invoice_date",
          "customer_name",
          "payment_mode",
          "total_amount",
        ]}
        withFooter
      />
    </Stack>
  );
};

export default SalesReport;
