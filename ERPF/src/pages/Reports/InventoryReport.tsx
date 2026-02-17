import { Button, Group, Stack, Text, Paper, Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import MantineTable from "@components/Table/MantineTable";
import { fetchInventoryReport } from "@services/reportService";
import { MdDownload } from "react-icons/md";

const InventoryReport = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["reports", "inventory"],
    queryFn: () => fetchInventoryReport({}),
  });

  const columns = [
    { accessor: "brand_name", title: "Medicine" },
    { accessor: "manufacturer", title: "Manufacturer" },
    { accessor: "current_stock", title: "Stock Left" },
    {
      accessor: "stock_value",
      title: "Value",
      render: (r: any) => `₹${r.stock_value}`,
    },
    {
      accessor: "status",
      title: "Status",
      render: (r: any) => (
        <Badge color={r.status === "LOW" ? "red" : "green"}>{r.status}</Badge>
      ),
    },
  ];

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

export default InventoryReport;
