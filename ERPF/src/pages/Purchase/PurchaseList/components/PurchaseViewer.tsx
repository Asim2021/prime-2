import { FC } from "react";
import {
  Modal,
  Text,
  Group,
  Stack,
  Divider,
  Badge,
  Table,
  Paper,
  Grid,
  Title,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@constants/queryKeys";
import { fetchPurchaseById } from "@services/purchaseService";
import dayJs from "@utils/daysJs";
import { MdShoppingCart, MdStorefront } from "react-icons/md";

interface PurchaseViewerProps {
  opened: boolean;
  onClose: () => void;
  purchaseId: string;
}

const PurchaseViewer: FC<PurchaseViewerProps> = ({
  opened,
  onClose,
  purchaseId,
}) => {
  const { data: purchase, isFetching } = useQuery({
    queryKey: [QUERY_KEY.PURCHASES, purchaseId],
    queryFn: () => fetchPurchaseById(purchaseId),
    enabled: !!purchaseId && opened,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon variant="light" size="lg" color="blue" radius="md">
            <MdShoppingCart size={20} />
          </ThemeIcon>
          <Text fw={700} size="xl">
            Purchase Details
          </Text>
        </Group>
      }
      size="xl"
      radius="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      {isFetching ? (
        <Stack align="center" justify="center" h={300}>
          <Text c="dimmed" size="sm">
            Loading purchase specifics...
          </Text>
        </Stack>
      ) : purchase ? (
        <Stack gap="lg" mt="sm">
          {/* Header Info Banner */}
          <Paper p="md" radius="md" bg="var(--mantine-color-gray-0)" darkHidden>
            <Grid align="center">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="xs" mb={4}>
                  <ThemeIcon variant="light" color="gray" size="sm">
                    <MdStorefront />
                  </ThemeIcon>
                  <Text fw={600} size="lg" c="dark.8">
                    {(purchase as any).vendor?.name || purchase.vendor_id}
                  </Text>
                </Group>
                {(purchase as any).vendor?.phone ? (
                  <Text size="sm" c="dimmed">
                    📞 {(purchase as any).vendor?.phone}
                  </Text>
                ) : null}
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
                      {purchase.invoice_no}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>
                    {dayJs(purchase.invoice_date).format("DD MMM YYYY")}
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
                <Group gap="xs" mb={4}>
                  <ThemeIcon variant="light" color="gray" size="sm">
                    <MdStorefront />
                  </ThemeIcon>
                  <Text fw={600} size="lg" c="gray.1">
                    {(purchase as any).vendor?.name || purchase.vendor_id}
                  </Text>
                </Group>
                {(purchase as any).vendor?.phone ? (
                  <Text size="sm" c="dimmed">
                    📞 {(purchase as any).vendor?.phone}
                  </Text>
                ) : null}
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
                      {purchase.invoice_no}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>
                    {dayJs(purchase.invoice_date).format("DD MMM YYYY")}
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
                  <Table.Th w="40%">Item / Medicine</Table.Th>
                  <Table.Th>Batch</Table.Th>
                  <Table.Th>Expiry</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>P. Rate</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Qty</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Subtotal</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {purchase?.items?.map((item: any) => {
                  const subtotal =
                    Number(item.batch?.purchase_rate || 0) *
                    Number(item.purchase_quantity || 0);
                  return (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text fw={600} size="sm">
                            {item?.batch?.medicine?.brand_name ||
                              "Unknown Item"}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
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
                      <Table.Td>
                        <Text size="sm">
                          {dayJs(item?.batch?.exp_date).format("MMM YYYY")}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        <Text size="sm">
                          ₹{Number(item?.batch?.purchase_rate || 0).toFixed(2)}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        <Text size="sm">{item.purchase_quantity}</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        <Text fw={600} size="sm">
                          ₹{subtotal.toFixed(2)}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Box>

          <Divider variant="dashed" />

          {/* Totals section */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              {/* Optional metrics space */}
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper
                p="md"
                radius="md"
                bg="var(--mantine-color-gray-0)"
                darkHidden
              >
                <Stack gap="xs">
                  {Number(purchase.gst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Included GST
                      </Text>
                      <Text size="sm">
                        ₹{Number(purchase.gst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}

                  <Group justify="space-between">
                    <Title order={4} c="dark.8">
                      Total Amount
                    </Title>
                    <Title order={3} c="blue.7">
                      ₹{Number(purchase.total_amount).toFixed(2)}
                    </Title>
                  </Group>
                </Stack>
              </Paper>
              {/* Dark mode Totals block */}
              <Paper
                p="md"
                radius="md"
                bg="var(--mantine-color-dark-6)"
                lightHidden
              >
                <Stack gap="xs">
                  {Number(purchase.gst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Included GST
                      </Text>
                      <Text size="sm">
                        ₹{Number(purchase.gst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}

                  <Group justify="space-between">
                    <Title order={4} c="gray.1">
                      Total Amount
                    </Title>
                    <Title order={3} c="blue.4">
                      ₹{Number(purchase.total_amount).toFixed(2)}
                    </Title>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      ) : (
        <Stack align="center" justify="center" h={200}>
          <Text py="xl" c="red" fw={500}>
            Failed to load purchase information.
          </Text>
        </Stack>
      )}
    </Modal>
  );
};

export default PurchaseViewer;
