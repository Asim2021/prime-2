import { useState, useMemo } from "react";
import { Button, Group, Stack, Text, Paper, SimpleGrid } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { MdDownload } from "react-icons/md";
import dayJs from "dayjs";
import MainTable from "@components/Table";
import { fetchSalesReport } from "@services/reportService";
import { QUERY_KEY } from "@constants/queryKeys";
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
    queryKey: [QUERY_KEY.REPORTS, "sales", dateRange[0], dateRange[1]],
    queryFn: async () => {
      const [start, end] = dateRange;
      if (!start || !end)
        return {
          data: [],
          stats: { total_revenue: 0, total_orders: 0 },
        } as any;
      const res = await fetchSalesReport({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      return res;
    },
    enabled: !!dateRange[0] && !!dateRange[1],
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { id: "bill_no", accessorKey: "bill_no", header: "Invoice No" },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Date",
        cell: (value) => (
          <Text
            size="sm"
            title={dayJs(value.getValue() as string).format(
              "DD-MM-YY hh:mm:ss",
            )}
          >
            {dayJs(value.getValue() as string).format("DD-MM-YY")}
          </Text>
        ),
      },
      { id: "customer_name", accessorKey: "customer_name", header: "Customer" },
      { id: "payment_mode", accessorKey: "payment_mode", header: "Mode" },
      {
        id: "total_amount",
        accessorKey: "total_amount",
        header: "Amount",
        cell: (info) => `₹${info.getValue()}`,
      },
    ],
    [],
  );

  const tableData = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);

  const table = useReactTable({
    id: "sales-report-table",
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
    },
    initialState: {
      columnPinning: { left: ["bill_no"], right: ["total_amount"] },
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    tableId: "sales-report-table",
  } as CustomTableOptions<any>);

  const stats = useMemo(() => {
    if (data?.stats) return data.stats;
    const total_revenue = tableData.reduce(
      (acc: number, item: any) => acc + Number(item.total_amount || 0),
      0,
    );
    return {
      total_revenue,
      total_orders: tableData.length,
    };
  }, [data, tableData]);

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
        setColumnOrder={() => {}} // Placeholder as it's not and-user editable currently
        columnIdsToSort={[
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
