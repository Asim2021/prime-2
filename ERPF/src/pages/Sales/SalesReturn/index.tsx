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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchSaleById, createSalesReturn } from "@services/salesService";
import { QUERY_KEY } from "@constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

const SalesReturn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: sale, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SALES, id],
    queryFn: () => fetchSaleById(id!),
    enabled: !!id,
  });

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [returnQuantities, setReturnQuantities] = useState<
    Record<string, number>
  >({});
  const [reason, setReason] = useState("");

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
      navigate(-1);
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
    const itemsToReturn = sale.items
      .filter((item: any) => selectedItems[item.id])
      .map((item: any) => ({
        sale_item_id: item.id,
        quantity: returnQuantities[item.id],
        batch_id: item.batch_id,
      }));

    if (itemsToReturn.length === 0) {
      notifications.show({
        title: "Error",
        message: "Select at least one item to return",
        color: "red",
      });
      return;
    }

    mutation.mutate({
      sale_id: id,
      items: itemsToReturn,
      reason,
    });
  };

  if (isLoading)
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );

  return (
    <Stack p="md" gap="md">
      <Group justify="space-between">
        <Title order={3}>Process Return for Invoice #{sale?.bill_no}</Title>
        <Button variant="default" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Group>

      <Paper withBorder p="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}></Table.Th>
              <Table.Th>Item</Table.Th>
              <Table.Th>Batch</Table.Th>
              <Table.Th>Sold Qty</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Return Qty</Table.Th>
              <Table.Th>Refund Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sale?.items?.map((item: any) => (
              <Table.Tr
                key={item.id}
                bg={selectedItems[item.id] ? "blue.0" : undefined}
              >
                <Table.Td>
                  <Checkbox
                    checked={!!selectedItems[item.id]}
                    onChange={() => handleToggle(item.id, item.quantity)}
                  />
                </Table.Td>
                <Table.Td>{item.medicine_name || item.brand_name}</Table.Td>
                <Table.Td>{item.batch?.batch_number}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>₹{Number(item.selling_price).toFixed(2)}</Table.Td>
                <Table.Td>
                  <NumberInput
                    size="xs"
                    w={80}
                    min={1}
                    max={item.quantity}
                    disabled={!selectedItems[item.id]}
                    value={returnQuantities[item.id]}
                    onChange={(v) => handleQtyChange(item.id, Number(v))}
                  />
                </Table.Td>
                <Table.Td fw={600}>
                  ₹
                  {selectedItems[item.id]
                    ? (
                        Number(item.selling_price) *
                        (returnQuantities[item.id] || 0)
                      ).toFixed(2)
                    : "0.00"}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Paper withBorder p="md" bg="gray.0">
        <Stack>
          <TextInput
            label="Reason for Return"
            placeholder="Damaged, Expired, Wrong Item..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Group justify="space-between" align="center">
            <Title order={3}>
              Total Refund:{" "}
              <Text span c="blue">
                ₹{calculateRefund().toFixed(2)}
              </Text>
            </Title>
            <Button
              color="red"
              size="md"
              onClick={handleSubmit}
              loading={mutation.isPending}
            >
              Confirm Return
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SalesReturn;
