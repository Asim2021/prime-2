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
import { fetchSaleById } from "@services/salesService";
import dayJs from "@utils/daysJs";
import { MdReceipt, MdPayments } from "react-icons/md";

interface InvoiceViewerProps {
  opened: boolean;
  onClose: () => void;
  saleId: string;
}

const InvoiceViewer: FC<InvoiceViewerProps> = ({ opened, onClose, saleId }) => {
  const { data: sale, isFetching } = useQuery({
    queryKey: [QUERY_KEY.SALES, saleId],
    queryFn: () => fetchSaleById(saleId),
    enabled: !!saleId && opened,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon variant="light" size="lg" color="blue" radius="md">
            <MdReceipt size={20} />
          </ThemeIcon>
          <Text fw={700} size="xl">
            Invoice Details
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
            Loading invoice specifics...
          </Text>
        </Stack>
      ) : sale ? (
        <Stack gap="lg" mt="sm">
          {/* Header Info Banner */}
          <Paper p="md" radius="md" bg="var(--mantine-color-gray-0)" darkHidden>
            <Grid align="center">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="xs" mb={4}>
                  <Text fw={600} size="lg" c="dark.8">
                    {sale.customer_name}
                  </Text>
                  {sale.is_credit && (
                    <Badge color="red" variant="filled" size="sm">
                      CREDIT OUTSTANDING
                    </Badge>
                  )}
                  {sale.returns && sale.returns.length > 0 && (
                    <Badge color="red" variant="light" size="sm">
                      RETURNED
                    </Badge>
                  )}
                </Group>
                {sale.customer_phone ? (
                  <Text size="sm" c="dimmed">
                    📞 {sale.customer_phone}
                  </Text>
                ) : (
                  <Text size="sm" c="dimmed">
                    Walk-in Customer
                  </Text>
                )}
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
                  <Group gap="xs" justify="flex-end" mt="xs">
                    <Badge
                      variant="light"
                      color={
                        sale.payment_mode === "cash"
                          ? "green"
                          : sale.payment_mode === "upi"
                            ? "blue"
                            : "orange"
                      }
                      leftSection={<MdPayments size={12} />}
                    >
                      {sale.payment_mode?.toUpperCase()}
                    </Badge>
                  </Group>
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
                  <Text fw={600} size="lg" c="gray.1">
                    {sale.customer_name}
                  </Text>
                  {sale.is_credit && (
                    <Badge color="red" variant="filled" size="sm">
                      CREDIT OUTSTANDING
                    </Badge>
                  )}
                  {sale.returns && sale.returns.length > 0 && (
                    <Badge color="red" variant="light" size="sm">
                      RETURNED
                    </Badge>
                  )}
                </Group>
                {sale.customer_phone ? (
                  <Text size="sm" c="dimmed">
                    📞 {sale.customer_phone}
                  </Text>
                ) : (
                  <Text size="sm" c="dimmed">
                    Walk-in Customer
                  </Text>
                )}
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
                  <Group gap="xs" justify="flex-end" mt="xs">
                    <Badge
                      variant="light"
                      color={
                        sale.payment_mode === "cash"
                          ? "green"
                          : sale.payment_mode === "upi"
                            ? "blue"
                            : "orange"
                      }
                      leftSection={<MdPayments size={12} />}
                    >
                      {sale.payment_mode?.toUpperCase()}
                    </Badge>
                  </Group>
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
                  <Table.Th style={{ textAlign: "right" }}>Rate</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Qty</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sale?.items?.map((item: any) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Stack gap={2}>
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
                      <Text size="sm">
                        ₹{Number(item.selling_price).toFixed(2)}
                      </Text>
                      {Number(item.mrp_at_sale) >
                        Number(item.selling_price) && (
                        <Text size="xs" c="dimmed" td="line-through">
                          ₹{Number(item.mrp_at_sale).toFixed(2)}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text size="sm">{item.quantity}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fw={600} size="sm">
                        ₹
                        {(Number(item.selling_price) * item.quantity).toFixed(
                          2,
                        )}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>

          <Divider variant="dashed" />

          {/* Totals section */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              {/* Note / Hash section */}
              {sale.invoice_hash && (
                <Group gap="xs" mt="auto" h="100%" align="flex-end">
                  <Text
                    size="xs"
                    c="dimmed"
                    ff="monospace"
                    title={sale.invoice_hash}
                  >
                    Hash: {sale.invoice_hash.substring(0, 16)}...
                  </Text>
                </Group>
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper
                p="md"
                radius="md"
                bg="var(--mantine-color-gray-0)"
                darkHidden
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Taxable Amount
                    </Text>
                    <Text size="sm" fw={500}>
                      ₹{Number(sale.taxable_amount).toFixed(2)}
                    </Text>
                  </Group>

                  {Number(sale.cgst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        CGST
                      </Text>
                      <Text size="sm">
                        ₹{Number(sale.cgst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}
                  {Number(sale.sgst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        SGST
                      </Text>
                      <Text size="sm">
                        ₹{Number(sale.sgst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}
                  {Number(sale.igst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        IGST
                      </Text>
                      <Text size="sm">
                        ₹{Number(sale.igst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}

                  <Divider my="xs" />

                  {sale.returns && sale.returns.length > 0 && (
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" c="red.6" fw={600}>
                        Total Refunded
                      </Text>
                      <Text size="sm" c="red.6" fw={600}>
                        - ₹
                        {Number(
                          sale.returns.reduce(
                            (sum: number, r: any) =>
                              sum + Number(r.total_refund),
                            0,
                          ),
                        ).toFixed(2)}
                      </Text>
                    </Group>
                  )}

                  <Group justify="space-between">
                    <Title order={4} c="dark.8">
                      Total Amount
                    </Title>
                    <Title order={3} c="blue.7">
                      ₹{Number(sale.total_amount).toFixed(2)}
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
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Taxable Amount
                    </Text>
                    <Text size="sm" fw={500}>
                      ₹{Number(sale.taxable_amount).toFixed(2)}
                    </Text>
                  </Group>

                  {Number(sale.cgst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        CGST
                      </Text>
                      <Text size="sm">
                        ₹{Number(sale.cgst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}
                  {Number(sale.sgst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        SGST
                      </Text>
                      <Text size="sm">
                        ₹{Number(sale.sgst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}
                  {Number(sale.igst_amount) > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        IGST
                      </Text>
                      <Text size="sm">
                        ₹{Number(sale.igst_amount).toFixed(2)}
                      </Text>
                    </Group>
                  )}

                  <Divider my="xs" />

                  {sale.returns && sale.returns.length > 0 && (
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" c="red.4" fw={600}>
                        Total Refunded
                      </Text>
                      <Text size="sm" c="red.4" fw={600}>
                        - ₹
                        {Number(
                          sale.returns.reduce(
                            (sum: number, r: any) =>
                              sum + Number(r.total_refund),
                            0,
                          ),
                        ).toFixed(2)}
                      </Text>
                    </Group>
                  )}

                  <Group justify="space-between">
                    <Title order={4} c="gray.1">
                      Total Amount
                    </Title>
                    <Title order={3} c="blue.4">
                      ₹{Number(sale.total_amount).toFixed(2)}
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
            Failed to load invoice information.
          </Text>
        </Stack>
      )}
    </Modal>
  );
};

export default InvoiceViewer;
