import { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  Select,
  NumberInput,
  Button,
  Group,
  Text,
  Textarea,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  fetchAllMedicines,
  fetchBatchesByMedicine,
  createStockAdjustment,
} from "@services/inventoryService";
import { MdInfo } from "react-icons/md";

interface StockAdjustmentModalProps {
  opened: boolean;
  close: () => void;
}

const StockAdjustmentModal = ({ opened, close }: StockAdjustmentModalProps) => {
  const queryClient = useQueryClient();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  const form = useForm({
    initialValues: {
      medicine_id: "",
      batch_id: "",
      quantity_change: 0,
      reason: "manual_correction",
      note: "",
    },
    validate: {
      medicine_id: (value) => (value ? null : "Select a medicine"),
      batch_id: (value) => (value ? null : "Select a batch"),
      quantity_change: (value) =>
        value === 0 ? "Adjustment cannot be 0" : null,
      reason: (value) => (value ? null : "Reason is required"),
    },
  });

  // Fetch Medicines on Mount (Optimize later with search)
  useEffect(() => {
    if (opened) {
      setLoadingData(true);
      fetchAllMedicines({ page: 1, limit: 100 })
        .then((res) => {
          setMedicines(
            res.data.map((m) => ({ value: m.id, label: m.brand_name, ...m })),
          );
          setLoadingData(false);
        })
        .catch(() => setLoadingData(false));

      form.reset();
      setSelectedBatch(null);
      setBatches([]);
    }
  }, [opened]);

  // Fetch Batches when Medicine Changes
  useEffect(() => {
    if (form.values.medicine_id) {
      setLoadingData(true);
      fetchBatchesByMedicine(form.values.medicine_id)
        .then((data) => {
          setBatches(
            data.map((b: any) => ({
              value: b.id,
              label: `${b.batch_number} (Exp: ${new Date(b.expiry_date).toLocaleDateString()})`,
              ...b,
            })),
          );
          setLoadingData(false);
        })
        .catch(() => setLoadingData(false));
    } else {
      setBatches([]);
    }
  }, [form.values.medicine_id]);

  // Update Selected Batch Info
  useEffect(() => {
    if (form.values.batch_id) {
      const batch = batches.find((b) => b.id === form.values.batch_id);
      setSelectedBatch(batch);
    } else {
      setSelectedBatch(null);
    }
  }, [form.values.batch_id, batches]);

  const mutation = useMutation({
    mutationFn: createStockAdjustment,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Stock adjustment recorded successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["stock-adjustments"] });
      close();
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message:
          error?.response?.data?.message || "Failed to record adjustment",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: any) => {
    mutation.mutate(values as Partial<StockAdjustmentI>);
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="New Stock Adjustment"
      centered
      size="lg"
    >
      <LoadingOverlay visible={loadingData || mutation.isPending} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Medicine"
            placeholder="Search & Select Medicine"
            data={medicines}
            searchable
            {...form.getInputProps("medicine_id")}
          />

          <Select
            label="Batch"
            placeholder="Select Batch"
            data={batches}
            disabled={!form.values.medicine_id}
            {...form.getInputProps("batch_id")}
          />

          {selectedBatch && (
            <Alert
              icon={<MdInfo />}
              title="Current Status"
              color="blue"
              variant="light"
            >
              <Group justify="space-between">
                <Text size="sm">
                  Current Stock: <b>{selectedBatch.current_stock}</b>
                </Text>
                <Text size="sm">
                  Expiry:{" "}
                  <b>
                    {new Date(selectedBatch.expiry_date).toLocaleDateString()}
                  </b>
                </Text>
              </Group>
              <Text size="xs" mt={4}>
                New stock will be:{" "}
                <b>
                  {Number(selectedBatch.current_stock) +
                    Number(form.values.quantity_change)}
                </b>
              </Text>
            </Alert>
          )}

          <NumberInput
            label="Quantity Adjustment"
            description="Use negative values to remove stock (e.g., -5 for breakage). Positive to add (e.g., returned found stock)."
            placeholder="0"
            {...form.getInputProps("quantity_change")}
          />

          <Select
            label="Reason"
            placeholder="Select reason"
            data={[
              { value: "damage", label: "Damage" },
              { value: "expired", label: "Expired" },
              { value: "theft", label: "Theft" },
              { value: "manual_correction", label: "Manual Correction" },
              { value: "other", label: "Other" },
            ]}
            required
            {...form.getInputProps("reason")}
          />

          <Textarea
            label="Notes"
            placeholder="Additional details..."
            {...form.getInputProps("note")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Save Adjustment
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default StockAdjustmentModal;
