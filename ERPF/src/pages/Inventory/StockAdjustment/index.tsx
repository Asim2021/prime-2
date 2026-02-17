import { useState } from "react";
import { Button, Group, Stack, Title, Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchStockAdjustments } from "@services/inventoryService";
import MantineTable from "@components/Table/MantineTable";
import { MdAdd, MdHistory } from "react-icons/md";
import StockAdjustmentModal from "./StockAdjustmentModal";
import { useDisclosure } from "@mantine/hooks";

const StockAdjustment = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["stock-adjustments", page],
    queryFn: () => fetchStockAdjustments({ page, limit }),
  });

  const columns = [
    {
      accessor: "created_at",
      title: "Date",
      render: (record: any) => new Date(record.created_at).toLocaleString(),
    },
    {
      accessor: "medicine.brand_name",
      title: "Medicine",
      render: (record: any) => record.medicine?.brand_name || "N/A",
    },
    {
      accessor: "batch.batch_number",
      title: "Batch",
      render: (record: any) => record.batch?.batch_number || "N/A",
    },
    {
      accessor: "quantity_adjustment",
      title: "Adjustment",
      render: (record: any) => (
        <Badge color={record.quantity_adjustment > 0 ? "green" : "red"}>
          {record.quantity_adjustment > 0 ? "+" : ""}
          {record.quantity_adjustment}
        </Badge>
      ),
    },
    {
      accessor: "reason",
      title: "Reason",
    },
    {
      accessor: "created_by",
      title: "User",
      render: (record: any) => record.created_by || "System",
    },
  ];

  return (
    <Stack h="100%" p="md">
      <Group justify="space-between">
        <Group>
          <MdHistory size={24} color="gray" />
          <Title order={3}>Stock Adjustments</Title>
        </Group>

        <Button leftSection={<MdAdd />} onClick={open}>
          New Adjustment
        </Button>
      </Group>

      <MantineTable
        TData={(data?.data || []) as any[]}
        headers={columns.map((c) => ({
          key: c.accessor,
          label: c.title,
          render: c.render,
        }))}
        total={data?.totalCount || 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      <StockAdjustmentModal opened={opened} close={close} />
    </Stack>
  );
};

export default StockAdjustment;
