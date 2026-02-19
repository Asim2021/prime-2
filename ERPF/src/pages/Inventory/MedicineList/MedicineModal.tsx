import { useEffect } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
  Grid,
  Select,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import useMedicineStore from "@stores/medicineStore";
import { addMedicine, editMedicine } from "@services/inventoryService";
import { QUERY_KEY } from "@constants/queryKeys";

const MedicineModal = () => {
  const { modalAction, setModalAction, detail, setDetail } = useMedicineStore();
  const queryClient = useQueryClient();

  // Removed manufacturer/category fetch as they are now free text or not implemented
  const form = useForm<Partial<MedicineI>>({
    initialValues: {
      brand_name: "",
      generic_name: "",
      manufacturer: "",
      composition: "",
      gst_percent: 12,
      hsn_code: "",
      schedule_type: "H",
      reorder_level: 10,
      barcode: "",
    },
    validate: {
      brand_name: (value) => (value ? null : "Brand Name is required"),
      generic_name: (value) => (value ? null : "Generic Name is required"),
      manufacturer: (value) => (value ? null : "Manufacturer is required"),
      hsn_code: (value) =>
        value && value.length >= 4
          ? null
          : "HSN Code is required (min 4 chars)",
      schedule_type: (value) => (value ? null : "Schedule Type is required"),
    },
  });

  useEffect(() => {
    if (modalAction === "EDIT" && detail) {
      form.setValues(detail);
    } else {
      form.reset();
    }
  }, [modalAction, detail]);

  const mutation = useMutation({
    mutationFn: (values: Partial<MedicineI>) => {
      if (modalAction === "EDIT" && detail) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, updated_at, ...payload } = values;
        return editMedicine(detail.id, payload);
      }
      return addMedicine(values);
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `Medicine ${modalAction === "EDIT" ? "updated" : "added"} successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MEDICINES] });
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

  const handleSubmit = (values: Partial<MedicineI>) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      opened={!!modalAction}
      onClose={handleClose}
      title={`${modalAction === "EDIT" ? "Edit" : "Add"} Medicine`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Brand Name"
              placeholder="e.g. Dolo 650"
              required
              {...form.getInputProps("brand_name")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Generic Name"
              placeholder="e.g. Paracetamol"
              required
              {...form.getInputProps("generic_name")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="HSN Code"
              placeholder="HSN"
              required
              {...form.getInputProps("hsn_code")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Manufacturer"
              placeholder="Enter Manufacturer"
              required
              {...form.getInputProps("manufacturer")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              label="Schedule Type"
              data={["H", "H1", "X", "OTC"]}
              required
              {...form.getInputProps("schedule_type")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <NumberInput
              label="GST Percent (%)"
              placeholder="12"
              min={0}
              max={28}
              required
              {...form.getInputProps("gst_percent")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Reorder Level"
              min={0}
              {...form.getInputProps("reorder_level")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Barcode"
              placeholder="Scan or enter barcode"
              {...form.getInputProps("barcode")}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Composition"
              placeholder="e.g. Paracetamol 650mg"
              {...form.getInputProps("composition")}
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

export default MedicineModal;
