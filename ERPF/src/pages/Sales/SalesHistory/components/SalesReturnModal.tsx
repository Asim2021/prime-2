import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  Loader,
  Center,
  TextInput,
  Badge,
  Grid,
  ThemeIcon,
  Box,
  Modal,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchSaleById, createSalesReturn } from "@services/salesService";
import { QUERY_KEY } from "@constants/queryKeys";
import { MdKeyboardReturn } from "react-icons/md";
import dayJs from "@utils/daysJs";

interface SalesReturnModalProps {
  opened: boolean;
  onClose: () => void;
  saleId: string | null;
}

const SalesReturnModal = ({
  opened,
  onClose,
  saleId,
}: SalesReturnModalProps) => {
  const queryClient = useQueryClient();

  const { data: sale, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SALES, saleId],
    queryFn: () => fetchSaleById(saleId!),
    enabled: !!saleId && opened,
  });

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [returnQuantities, setReturnQuantities] = useState<
    Record<string, number>
  >({});
  const [reason, setReason] = useState("");

  // Clean state when modal opens/closes or saleId changes
  useEffect(() => {
    setSelectedItems({});
    setReturnQuantities({});
    setReason("");
  }, [saleId, opened]);

  const mutation = useMutation({
    mutationFn: createSalesReturn,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Return processed successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SALES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BATCHES] });
      onClose();
    },
    onError: (err: any) => {
      notifications.show({
        title: "Error",
        message: err?.response?.data?.message || "Return failed",
        color: "red",
      });
    },
  });

  const handleToggle = (itemId: string, maxQty: number) => {
    setSelectedItems((prev) => {
      const newState = { ...prev, [itemId]: !prev[itemId] };
      if (newState[itemId]) {
        setReturnQuantities((q) => ({ ...q, [itemId]: maxQty }));
      } else {
        setReturnQuantities((q) => {
          const copy = { ...q };
          delete copy[itemId];
          return copy;
        });
      }
      return newState;
    });
  };

  const handleQtyChange = (itemId: string, val: number) => {
    setReturnQuantities((prev) => ({ ...prev, [itemId]: val }));
  };

  const calculateRefund = () => {
    if (!sale?.items) return 0;
    let total = 0;
    sale.items.forEach((item: any) => {
      if (selectedItems[item.id]) {
        total += Number(item.selling_price) * (returnQuantities[item.id] || 0);
      }
    });
    return total;
  };

  const handleSubmit = () => {
    if (!saleId) return;

    const itemsToReturn = sale?.items
      ?.filter((item: any) => selectedItems[item.id])
      ?.map((item: any) => ({
        sale_item_id: item.id,
        quantity: returnQuantities[item.id],
        batch_id: item.batch_id,
      }));

    if (!itemsToReturn || itemsToReturn.length === 0) {
      notifications.show({
        title: "Error",
        message: "Select at least one item to return",
        color: "red",
      });
      return;
    }

    if (!reason.trim()) {
      notifications.show({
        title: "Warning",
        message: "Please provide a reason for the return.",
        color: "orange",
      });
      return;
    }

    mutation.mutate({
      sale_id: saleId,
      items: itemsToReturn,
      reason,
    });
  };

  if (!saleId) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon variant="light" size="lg" color="orange" radius="md">
            <MdKeyboardReturn size={20} />
          </ThemeIcon>
          <Text fw={700} size="xl">
            Process Return
          </Text>
        </Group>
      }
      size="xl" // x-large map perfectly to tables
      radius="md"
    >
      {isLoading ? (
        <Center h={300}>
          <Stack align="center">
            <Loader color="orange" />
            <Text c="dimmed" size="sm">
              Loading invoice specifics...
            </Text>
          </Stack>
        </Center>
      ) : !sale ? (
        <Center h={300}>
          <Text c="red" fw={500}>
            Failed to load invoice information for Return.
          </Text>
        </Center>
      ) : (
        <Stack gap="lg" mt="sm">
          {/* Header Info Banner */}
          <Paper p="md" radius="md" bg="var(--mantine-color-gray-0)" darkHidden>
            <Grid align="center">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text fw={600} size="lg" c="dark.8">
                  Customer Details
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  {sale.customer_name} • {sale.customer_phone || "Walk-in"}
                </Text>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, sm: 6 }}
                style={{ textAlign: "right" }}
              >
                <Stack gap={0}>
                  <Group justify="flex-end" gap="xs">
                    <Text size="sm" c="dimmed">
                      Invoice No:
                    </Text>
                    <Text fw={700} ff="monospace">
                      {sale.bill_no}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>
                    {dayJs(sale.bill_date).format("DD MMM YYYY, hh:mm A")}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Dark Mode Alternative Banner */}
          <Paper
            p="md"
            radius="md"
            bg="var(--mantine-color-dark-6)"
            lightHidden
          >
            <Grid align="center">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text fw={600} size="lg" c="gray.1">
                  Customer Details
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  {sale.customer_name} • {sale.customer_phone || "Walk-in"}
                </Text>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, sm: 6 }}
                style={{ textAlign: "right" }}
              >
                <Stack gap={0}>
                  <Group justify="flex-end" gap="xs">
                    <Text size="sm" c="dimmed">
                      Invoice No:
                    </Text>
                    <Text fw={700} ff="monospace">
                      {sale.bill_no}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>
                    {dayJs(sale.bill_date).format("DD MMM YYYY, hh:mm A")}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Items Table */}
          <Box style={{ overflowX: "auto" }}>
            <Table striped highlightOnHover verticalSpacing="sm">
              <Table.Thead
                bg="var(--mantine-color-gray-1)"
                style={{ textTransform: "uppercase" }}
              >
                <Table.Tr>
                  <Table.Th w={40}></Table.Th>
                  <Table.Th w="35%">Item / Medicine</Table.Th>
                  <Table.Th>Batch</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Sold Qty</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Rate</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>
                    Return Qty
                  </Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>
                    Refund Amount
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sale?.items?.map((item: any) => (
                  <Table.Tr
                    key={item.id}
                    bg={
                      selectedItems[item.id]
                        ? "var(--mantine-color-blue-light)"
                        : undefined
                    }
                  >
                    <Table.Td>
                      <Checkbox
                        checked={!!selectedItems[item.id]}
                        onChange={() => handleToggle(item.id, item.quantity)}
                        color="orange"
                      />
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2} opacity={selectedItems[item.id] ? 1 : 0.6}>
                        <Text fw={600} size="sm">
                          {item?.batch?.medicine?.brand_name || "Unknown Item"}
                        </Text>
                        <Text
                          size="xs"
                          c="dimmed"
                          lineClamp={1}
                          title={item?.batch?.medicine?.composition}
                        >
                          {item?.batch?.medicine?.generic_name || "N/A"}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="outline"
                        color="gray"
                        size="sm"
                        style={{ textTransform: "none" }}
                      >
                        {item?.batch?.batch_no}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text size="sm">{item.quantity}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text size="sm">
                        ₹{Number(item.selling_price).toFixed(2)}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      <Center>
                        <NumberInput
                          size="xs"
                          w={90}
                          min={1}
                          max={item.quantity}
                          disabled={!selectedItems[item.id]}
                          value={returnQuantities[item.id]}
                          onChange={(v) => handleQtyChange(item.id, Number(v))}
                          styles={{ input: { textAlign: "center" } }}
                        />
                      </Center>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text
                        fw={600}
                        size="sm"
                        c={selectedItems[item.id] ? "blue.7" : "dimmed"}
                      >
                        ₹
                        {selectedItems[item.id]
                          ? (
                              Number(item.selling_price) *
                              (returnQuantities[item.id] || 0)
                            ).toFixed(2)
                          : "0.00"}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>

          {/* Footer / Confirmation Section */}
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Reason for Return"
                placeholder="Damaged, Expired, Wrong Item..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                size="md"
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper
                p="md"
                radius="md"
                bg="var(--mantine-color-gray-0)"
                darkHidden
              >
                <Group justify="space-between" align="center">
                  <Stack gap={0}>
                    <Text size="sm" c="dimmed" fw={500}>
                      Total Refund
                    </Text>
                    <Title order={3} c="blue.7">
                      ₹{calculateRefund().toFixed(2)}
                    </Title>
                  </Stack>
                  <Button
                    color="orange"
                    size="md"
                    onClick={handleSubmit}
                    loading={mutation.isPending}
                    leftSection={<MdKeyboardReturn size={18} />}
                  >
                    Confirm Return
                  </Button>
                </Group>
              </Paper>
              <Paper
                p="md"
                radius="md"
                bg="var(--mantine-color-dark-6)"
                lightHidden
              >
                <Group justify="space-between" align="center">
                  <Stack gap={0}>
                    <Text size="sm" c="dimmed" fw={500}>
                      Total Refund
                    </Text>
                    <Title order={3} c="blue.4">
                      ₹{calculateRefund().toFixed(2)}
                    </Title>
                  </Stack>
                  <Button
                    color="orange"
                    size="md"
                    onClick={handleSubmit}
                    loading={mutation.isPending}
                    leftSection={<MdKeyboardReturn size={18} />}
                  >
                    Confirm Return
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      )}
    </Modal>
  );
};

export default SalesReturnModal;
