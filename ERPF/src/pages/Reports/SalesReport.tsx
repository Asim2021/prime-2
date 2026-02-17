import { useState } from "react";
import { Button, Group, Stack, Text, Paper, SimpleGrid } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import MantineTable from "@components/Table/MantineTable";
import { fetchSalesReport } from "@services/reportService";
import { MdDownload } from "react-icons/md";

const SalesReport = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date(),
  ]);

  const { data, isLoading } = useQuery({
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

  const columns = [
    { accessor: "invoice_no", title: "Invoice No" },
    {
      accessor: "invoice_date",
      title: "Date",
      render: (r: any) => new Date(r.invoice_date).toLocaleDateString(),
    },
    { accessor: "customer_name", title: "Customer" },
    { accessor: "payment_mode", title: "Mode" },
    {
      accessor: "total_amount",
      title: "Amount",
      render: (r: any) => `₹${r.total_amount}`,
    },
  ];

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

      <MantineTable
        headers={columns.map((c) => ({
          key: c.accessor,
          label: c.title,
          render: c.render,
        }))}
        TData={data?.data || []}
        isLoading={isLoading}
      />
    </Stack>
  );
};

export default SalesReport;
