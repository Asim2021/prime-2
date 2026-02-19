import {
  ActionIcon,
  Button,
  Card,
  Group,
  NumberInput,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { MdDelete } from "react-icons/md";
import { useCartStore } from "@stores/cartStore";

const POSCart = ({ onCheckout }: { onCheckout: () => void }) => {
  const { items, removeItem, updateQty, getTotals, reset } = useCartStore();
  const totals = getTotals();

  return (
    <Stack h="100%" gap="xs">
      <Group justify="space-between">
        <Title order={4}>Current Cart</Title>
        <Button
          variant="subtle"
          color="red"
          size="xs"
          onClick={reset}
          disabled={items.length === 0}
        >
          Clear
        </Button>
      </Group>

      <Card withBorder radius="md" flex={1} p={0} className="overflow-hidden">
        <ScrollArea h="100%">
          <Table verticalSpacing="xs" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Item</Table.Th>
                <Table.Th w={80}>Qty</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th w={40}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">
                      Cart is empty
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                items.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {item.medicine_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Batch: {item.batch_no}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        size="xs"
                        min={1}
                        max={item.quantity_available}
                        value={item.cartQty}
                        onChange={(v) => updateQty(item.id, Number(v))}
                        hideControls
                      />
                    </Table.Td>
                    <Table.Td>₹{item.cartPrice}</Table.Td>
                    <Table.Td fw={600}>
                      ₹{(item.cartPrice * item.cartQty).toFixed(2)}
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        size="sm"
                        color="red"
                        variant="subtle"
                        onClick={() => removeItem(item.id)}
                      >
                        <MdDelete size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      <Card
        withBorder
        radius="md"
        bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
      >
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm">Subtotal</Text>
            <Text fw={600}>₹{totals.taxable.toFixed(2)}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Tax (GST)</Text>
            <Text fw={600}>₹{totals.gst.toFixed(2)}</Text>
          </Group>
          <Group
            justify="space-between"
            pt="sm"
            style={{
              borderTop: "1px dashed var(--mantine-color-default-border)",
            }}
          >
            <Title order={3}>Total</Title>
            <Title order={3} c="blue">
              ₹{totals.total.toFixed(2)}
            </Title>
          </Group>

          <Button
            fullWidth
            size="md"
            color="green"
            mt="md"
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            Checkout (F2)
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};

export default POSCart;
