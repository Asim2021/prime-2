import {
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdArrowBack, MdPrint } from "react-icons/md";
import { fetchSaleById } from "@services/salesService";
import { QUERY_KEY } from "@constants/queryKeys";
import dayjs from "dayjs";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const {
    data: sale,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEY.SALES, id],
    queryFn: () => fetchSaleById(id!),
    enabled: !!id,
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${sale?.bill_no || "Bill"}`,
  });

  if (isLoading)
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );
  if (isError || !sale)
    return (
      <Center h="100%">
        <Text c="red">Failed to load invoice</Text>
      </Center>
    );

  return (
    <Stack h="100%" p="md" gap="md">
      {/* Header Actions - Hidden in Print */}
      <Group justify="space-between" className="print:hidden">
        <Button
          variant="subtle"
          leftSection={<MdArrowBack />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Group>
          <Button
            color="red"
            variant="outline"
            onClick={() => navigate("return")}
          >
            Return Items
          </Button>
          <Button leftSection={<MdPrint />} onClick={() => handlePrint()}>
            Print Invoice
          </Button>
        </Group>
      </Group>

      {/* Printable Area */}
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        withBorder
        bg="white"
        ref={printRef}
        className="print:shadow-none print:border-none print:p-0"
      >
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" align="start">
            <Stack gap={0}>
              <Title order={2}>PIMS PHARMACY</Title>
              <Text size="sm" c="dimmed">
                123, Health Street, Med City
              </Text>
              <Text size="sm" c="dimmed">
                Phone: +91 98765 43210
              </Text>
              <Text size="sm" c="dimmed">
                GSTIN: 27ABCDE1234F1Z5
              </Text>
            </Stack>
            <Stack gap={0} align="end">
              <Title order={3}>INVOICE</Title>
              <Text fw={600}>{sale.bill_no}</Text>
              <Text size="sm">
                Date: {dayjs(sale.bill_date).format("DD MMM YYYY, hh:mm A")}
              </Text>
            </Stack>
          </Group>

          <Divider />

          {/* Patient / Customer Info */}
          <Group justify="space-between" align="start">
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Billed To:
              </Text>
              <Text fw={600} size="md">
                {sale.customer_name}
              </Text>
              {sale.customer_phone && (
                <Text size="sm">Ph: {sale.customer_phone}</Text>
              )}
            </Stack>
            <Stack gap={0} align="end">
              <Text size="sm" c="dimmed">
                Payment Mode:
              </Text>
              <Text fw={600} tt="capitalize">
                {sale.payment_mode}
              </Text>
            </Stack>
          </Group>

          {/* Items Table */}
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead bg="gray.1">
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Item</Table.Th>
                <Table.Th>Batch</Table.Th>
                <Table.Th>Exp</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>MRP</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Qty</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sale.items?.map((item: any, index: number) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    {item.medicine_name || item.brand_name || "Medicine"}
                  </Table.Td>
                  <Table.Td>{item.batch?.batch_number}</Table.Td>
                  <Table.Td>
                    {item.batch?.expiry_date
                      ? dayjs(item.batch.expiry_date).format("MM/YY")
                      : "-"}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {Number(item.mrp_at_sale).toFixed(2)}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {item.quantity}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {(Number(item.selling_price) * item.quantity).toFixed(2)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {/* Footer / Totals */}
          <Group justify="flex-end" align="start" gap="xl">
            <Stack gap="xs" w={200}>
              <Group justify="space-between">
                <Text size="sm">Taxable Amount:</Text>
                <Text size="sm" fw={600}>
                  {Number(sale.taxable_amount).toFixed(2)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">CGST:</Text>
                <Text size="sm" fw={600}>
                  {Number(sale.cgst_amount).toFixed(2)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">SGST:</Text>
                <Text size="sm" fw={600}>
                  {Number(sale.sgst_amount).toFixed(2)}
                </Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text size="lg" fw={700}>
                  Total:
                </Text>
                <Text size="lg" fw={700}>
                  ₹{Number(sale.total_amount).toFixed(2)}
                </Text>
              </Group>
            </Stack>
          </Group>

          <Divider />
          <Text size="xs" ta="center" c="dimmed">
            Thank you for your business! | Terms & Conditions Apply.
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default InvoiceDetails;
