import { useEffect } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
  Grid,
  Switch,
  Stack,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useBatchStore } from "./useBatchColumns";
import { editBatch } from "@services/inventoryService";

const BatchModal = () => {
  const { modalAction, setModalAction, detail, setDetail } = useBatchStore();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      medicine_id: "",
      batch_no: "",
      mfg_date: new Date(),
      exp_date: new Date(),
      purchase_rate: 0,
      mrp: 0,
      quantity_available: 0,
      rack_location: "UNASSIGNED",
      is_active: true,
      vendor_id: "",
    },
    validate: {
      mrp: (value) => ((value || 0) > 0 ? null : "MRP must be positive"),
      rack_location: (value) => (value ? null : "Rack location is required"),
    },
  });

  useEffect(() => {
    if (modalAction === "EDIT" && detail) {
      form.setValues({
        ...detail,
        mfg_date: detail.mfg_date ? new Date(detail.mfg_date) : new Date(),
        exp_date: detail.exp_date ? new Date(detail.exp_date) : new Date(),
      } as any);
    } else {
      form.reset();
    }
  }, [modalAction, detail]);

  const mutation = useMutation({
    mutationFn: (values: any) => {
      if (modalAction === "EDIT" && detail) {
        // Only allow updating editable fields
        const payload = {
          mrp: values.mrp,
          rack_location: values.rack_location,
          is_active: values.is_active,
        };
        return editBatch(detail.id, payload);
      }
      throw new Error(
        "Add batch not supported via this modal. Use Purchase Entry.",
      );
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Batch updated successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      handleClose();
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message:
          error?.response?.data?.message || error.message || "Operation failed",
        color: "red",
      });
    },
  });

  const handleClose = () => {
    setModalAction(null);
    setDetail(null);
    form.reset();
  };

  const handleSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      opened={!!modalAction}
      onClose={handleClose}
      title="Edit Batch Details"
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={500}>
                  Medicine
                </Text>
                <Text fw={600}>{detail?.item_name || "N/A"}</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Batch Number"
                readOnly
                variant="filled"
                {...form.getInputProps("batch_no")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={500}>
                  Vendor
                </Text>
                <Text size="sm">{detail?.vendor_name || "N/A"}</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <DateInput
                label="Mfg Date"
                readOnly
                variant="filled"
                valueFormat="DD/MM/YYYY"
                {...form.getInputProps("mfg_date")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <DateInput
                label="Expiry Date"
                readOnly
                variant="filled"
                valueFormat="DD/MM/YYYY"
                {...form.getInputProps("exp_date")}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <NumberInput
                label="Purchase Rate"
                readOnly
                variant="filled"
                prefix="₹"
                {...form.getInputProps("purchase_rate")}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <NumberInput
                label="Quantity Available"
                readOnly
                variant="filled"
                {...form.getInputProps("quantity_available")}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <NumberInput
                label="MRP"
                min={0}
                required
                prefix="₹"
                {...form.getInputProps("mrp")}
              />
            </Grid.Col>

            <Grid.Col span={8}>
              <TextInput
                label="Rack Location"
                placeholder="Shelf/Rack ID"
                required
                {...form.getInputProps("rack_location")}
              />
            </Grid.Col>

            <Grid.Col span={4} pt="xl">
              <Switch
                label="Is Active"
                {...form.getInputProps("is_active", { type: "checkbox" })}
              />
            </Grid.Col>
          </Grid>
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default BatchModal;
