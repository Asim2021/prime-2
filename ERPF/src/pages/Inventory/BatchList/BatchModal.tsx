import { useEffect } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
  Grid,
  Select,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useBatchStore } from "./useBatchColumns";
import {
  addBatch,
  editBatch,
  fetchAllMedicines,
} from "@services/inventoryService";

const BatchModal = () => {
  const { modalAction, setModalAction, detail, setDetail } = useBatchStore();
  const queryClient = useQueryClient();

  // Fetch medicines for selection. We might need a search API if list is huge, but for now fetch all (paginated? default 100?)
  // fetchAllMedicines requires params. I'll pass limit: 1000 for now or implement search in Select.
  // For simplicity, I'll fetch first 100.
  const { data: medicinesData } = useQuery({
    queryKey: ["medicines-select"],
    queryFn: () => fetchAllMedicines({ page: 1, limit: 100 }),
  });

  const medicineOptions =
    medicinesData?.data?.map((m) => ({
      value: m.id,
      label: `${m.brand_name} (${m.generic_name})`,
    })) || [];

  const form = useForm<Partial<BatchI>>({
    initialValues: {
      item_id: "",
      batch_number: "",
      expiry_date: "",
      purchase_price: 0,
      sale_price: 0,
      mrp: 0,
      current_stock: 0,
    },
    validate: {
      item_id: (value) => (value ? null : "Medicine is required"),
      batch_number: (value) => (value ? null : "Batch Number is required"),
      expiry_date: (value) => (value ? null : "Expiry Date is required"),
      mrp: (value) => ((value || 0) > 0 ? null : "MRP must be positive"),
    },
  });

  useEffect(() => {
    if (modalAction === "EDIT" && detail) {
      form.setValues({
        ...detail,
        expiry_date: detail.expiry_date
          ? new Date(detail.expiry_date)
          : undefined,
      } as any);
    } else {
      form.reset();
    }
  }, [modalAction, detail]);

  const mutation = useMutation({
    mutationFn: (values: Partial<BatchI>) => {
      const payload = {
        ...values,
        expiry_date: values.expiry_date
          ? new Date(values.expiry_date).toISOString()
          : undefined,
      };
      if (modalAction === "EDIT" && detail) {
        return editBatch(detail.id, payload);
      }
      return addBatch(payload);
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `Batch ${modalAction === "EDIT" ? "updated" : "added"} successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      handleClose();
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Operation failed",
        color: "red",
      });
    },
  });

  const handleClose = () => {
    setModalAction(null);
    setDetail(null);
    form.reset();
  };

  const handleSubmit = (values: Partial<BatchI>) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      opened={!!modalAction}
      onClose={handleClose}
      title={`${modalAction === "EDIT" ? "Edit" : "Add"} Batch`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Medicine"
              placeholder="Select Medicine"
              data={medicineOptions}
              searchable
              required
              disabled={modalAction === "EDIT"} // Usually batch is tied to item, changing item might be weird but allowed if needed.
              {...form.getInputProps("item_id")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Batch Number"
              placeholder="Batch No"
              required
              {...form.getInputProps("batch_number")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="Expiry Date"
              placeholder="Expiry Date"
              required
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps("expiry_date")}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <NumberInput
              label="Purchase Price"
              min={0}
              {...form.getInputProps("purchase_price")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Sale Price"
              min={0}
              {...form.getInputProps("sale_price")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="MRP"
              min={0}
              required
              {...form.getInputProps("mrp")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Current Stock"
              min={0}
              required
              {...form.getInputProps("current_stock")}
            />
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default BatchModal;
