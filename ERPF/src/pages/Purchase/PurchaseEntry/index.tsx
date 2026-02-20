import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdSave } from "react-icons/md";
import { useNavigate } from "react-router";
import { ENDPOINT } from "@constants/endpoints";
import { createPurchase } from "@services/purchaseService";
import { fetchAllVendors } from "@services/partnerService";
import { fetchAllMedicines } from "@services/inventoryService";
import dayjs from "dayjs";
import { QUERY_KEY } from "@constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

// Helper components for async select could be abstracted, but keeping simple here
// For Medicine Select, we need to fetch medicines.

const PurchaseEntry = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [vendors, setVendors] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [medicines, setMedicines] = useState<
    { value: string; label: string }[]
  >([]);

  // 1. Fetch Vendors
  const { data: vendorData } = useQuery({
    queryKey: [QUERY_KEY.VENDORS, "all"],
    queryFn: () => fetchAllVendors({ page: 1, limit: 100 }), // Simplified for now
  });

  // 2. Fetch Medicines
  const { data: medicineData } = useQuery({
    queryKey: [QUERY_KEY.MEDICINES, "all"],
    queryFn: () => fetchAllMedicines({ page: 1, limit: 1000 }), // Fetching large list for dropdown
  });

  useEffect(() => {
    if (vendorData?.data) {
      setVendors(vendorData.data.map((v) => ({ value: v.id, label: v.name })));
    }
  }, [vendorData]);

  useEffect(() => {
    if (medicineData?.data) {
      // Map medicine to include necessary details for defaults if needed
      setMedicines(
        medicineData.data.map((m) => ({
          value: m.id,
          label: `${m.brand_name} (${m.generic_name})`,
        })),
      );
    }
  }, [medicineData]);

  const form = useForm({
    initialValues: {
      vendor_id: "",
      invoice_no: "",
      invoice_date: new Date(),
      items: [
        {
          medicine_id: "",
          batch_no: "",
          mfg_date: null as Date | null,
          exp_date: null as Date | null,
          mrp: 0,
          purchase_rate: 0,
          quantity: 1,
          amount: 0, // Virtual field
        },
      ],
      total_amount: 0,
      gst_amount: 0,
    },
    validate: {
      vendor_id: (value) => (value ? null : "Vendor is required"),
      invoice_no: (value) => (value ? null : "Invoice No is required"),
      items: {
        medicine_id: (value) => (value ? null : "Medicine is required"),
        batch_no: (value) => (value ? null : "Batch No is required"),
        mrp: (value) => (value > 0 ? null : "MRP must be > 0"),
        purchase_rate: (value, _values, _path) => {
          // path is like items.0.purchase_rate.
          // We need to compare with this item's MRP.
          // Simplified:
          return value > 0 ? null : "Rate > 0";
        },
      },
    },
  });

  // Auto-calculate Item Amount and Grand Total
  useEffect(() => {
    const updatedItems = form.values.items.map((item) => ({
      ...item,
      amount: item.purchase_rate * item.quantity,
    }));

    // Check if we need to set values to avoid infinite loop
    const total = updatedItems.reduce((acc, item) => acc + item.amount, 0);

    // Only update if changed significantly (primitive check)
    // Actually, setting state inside effect that depends on state is risky.
    // Better to calculate derived values during render or use specific handlers.
    // But specific handlers for every input is verbose.
    // Let's rely on derived calculation for display, but we need to submit `total_amount`.

    // Actually simple approach: Calculate total on submit or just update it when relevant fields change?
    // Let's update `total_amount` in form only when submitting or use a separate state?
    // No, let's keep it in sync.

    if (total !== form.values.total_amount) {
      form.setFieldValue("total_amount", total);
    }
  }, [
    JSON.stringify(
      form.values.items.map((i) => ({ p: i.purchase_rate, q: i.quantity })),
    ),
  ]);

  const mutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Purchase entry created successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PURCHASES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BATCHES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MEDICINES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VENDORS] });
      navigate(ENDPOINT.PURCHASE.BASE);
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to create purchase",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    // Transform data for API
    const payload = {
      ...values,
      gst_amount: 0, // TODO: Calculate GST based on medicine tax info? For now 0 or manual.
      invoice_date: dayjs(values.invoice_date).format("YYYY-MM-DD"),
      items: values.items.map((item) => ({
        medicine_id: item.medicine_id,
        batch_no: item.batch_no,
        mfg_date: dayjs(item.mfg_date).format("YYYY-MM-DD"),
        exp_date: dayjs(item.exp_date).format("YYYY-MM-DD"),
        mrp: item.mrp,
        purchase_rate: item.purchase_rate,
        quantity: item.quantity,
      })),
    };

    mutation.mutate(payload as any);
  };

  return (
    <Stack gap="md" pb={50}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group justify="end" mt={"sm"}>
          <Button
            loading={mutation.isPending}
            leftSection={<MdSave size={18} />}
            type="submit"
          >
            Save Purchase
          </Button>
        </Group>
      </form>

      <Card withBorder shadow="sm" radius="md">
        <Title order={5} mb="md">
          Invoice Details
        </Title>
        <Grid>
          <Grid.Col span={4}>
            <Select
              label="Vendor"
              placeholder="Select Vendor"
              data={vendors}
              searchable
              {...form.getInputProps("vendor_id")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Invoice No"
              placeholder="e.g. INV-2024-001"
              {...form.getInputProps("invoice_no")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <DateInput
              label="Invoice Date"
              placeholder="Select Date"
              {...form.getInputProps("invoice_date")}
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder shadow="sm" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={5}>Items</Title>
          <Button
            variant="light"
            size="xs"
            leftSection={<MdAdd />}
            onClick={() =>
              form.insertListItem("items", {
                medicine_id: "",
                batch_no: "",
                mfg_date: null,
                exp_date: null,
                mrp: 0,
                purchase_rate: 0,
                quantity: 1,
                amount: 0,
              })
            }
          >
            Add Item
          </Button>
        </Group>

        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={250}>Medicine</Table.Th>
              <Table.Th>Batch No</Table.Th>
              <Table.Th>Mfg / Exp Date</Table.Th>
              <Table.Th>MRP</Table.Th>
              <Table.Th>Cost Price</Table.Th>
              <Table.Th>Qty</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th w={50}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.items.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Select
                    data={medicines}
                    searchable
                    placeholder="Search Medicine"
                    {...form.getInputProps(`items.${index}.medicine_id`)}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    placeholder="Batch"
                    {...form.getInputProps(`items.${index}.batch_no`)}
                  />
                </Table.Td>
                <Table.Td>
                  <DateInput
                    placeholder="Mfg Date"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps(`items.${index}.mfg_date`)}
                    mb="xs"
                  />
                  <DateInput
                    placeholder="Exp Date"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps(`items.${index}.exp_date`)}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    min={0}
                    hideControls
                    {...form.getInputProps(`items.${index}.mrp`)}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    min={0}
                    hideControls
                    {...form.getInputProps(`items.${index}.purchase_rate`)}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    min={1}
                    hideControls
                    {...form.getInputProps(`items.${index}.quantity`)}
                  />
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>
                    ₹{(item.purchase_rate * item.quantity).toFixed(2)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => form.removeListItem("items", index)}
                    disabled={form.values.items.length === 1}
                  >
                    <MdDelete size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="flex-end" mt="md">
          <Title order={3}>Total: ₹{form.values.total_amount.toFixed(2)}</Title>
        </Group>
      </Card>
    </Stack>
  );
};

export default PurchaseEntry;
