import { useEffect, useState } from "react";
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
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useBatchStore } from "./useBatchColumns";
import {
  editBatch,
  addBatch,
  fetchAllMedicines,
} from "@services/inventoryService";
import { fetchAllVendors } from "@services/partnerService";

const BatchModal = () => {
  const { modalAction, setModalAction, detail, setDetail } = useBatchStore();
  const queryClient = useQueryClient();
  const [medicines, setMedicines] = useState<
    { value: string; label: string }[]
  >([]);
  const [vendors, setVendors] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch medicines and vendors when modal opens in ADD mode
  useEffect(() => {
    const loadData = async () => {
      if (modalAction === "ADD") {
        setIsLoadingData(true);
        try {
          // Fetching top 100 for now, could be optimized with async search
          const [medsRes, vendorsRes] = await Promise.all([
            fetchAllMedicines({ limit: 100 }),
            fetchAllVendors({ limit: 100 }),
          ]);

          setMedicines(
            medsRes.data.map((m) => ({ value: m.id, label: m.brand_name })),
          );
          setVendors(
            vendorsRes.data.map((v) => ({ value: v.id, label: v.name })),
          );
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Failed to load form data",
            color: "red",
          });
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    if (modalAction === "ADD") {
      loadData();
    }
  }, [modalAction]);

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
      medicine_id: (value) =>
        modalAction === "ADD" && !value ? "Medicine is required" : null,
      vendor_id: (value) =>
        modalAction === "ADD" && !value ? "Vendor is required" : null,
      batch_no: (value) =>
        modalAction === "ADD" && !value ? "Batch number is required" : null,
      mrp: (value) => (value <= 0 ? "MRP must be positive" : null),
      purchase_rate: (value) =>
        value < 0 ? "Purchase rate cannot be negative" : null,
      exp_date: (value, values) =>
        new Date(value) <= new Date(values.mfg_date)
          ? "Expiry must be after Mfg Date"
          : null,
      rack_location: (value) => (!value ? "Rack location is required" : null),
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
      // Set defaults for new entry
      form.setFieldValue("mfg_date", new Date());
      form.setFieldValue(
        "exp_date",
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      ); // +90 days
    }
  }, [modalAction, detail]);

  const mutation = useMutation({
    mutationFn: (values: any) => {
      const payload = { ...values };

      if (modalAction === "EDIT" && detail) {
        // For Edit, restricted fields
        return editBatch(detail.id, {
          mrp: values.mrp,
          rack_location: values.rack_location,
          is_active: values.is_active,
        });
      } else {
        // For Add
        return addBatch(payload);
      }
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `Batch ${modalAction === "ADD" ? "created" : "updated"} successfully`,
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

  const isAdd = modalAction === "ADD";

  return (
    <Modal
      opened={!!modalAction}
      onClose={handleClose}
      title={isAdd ? "Add New Batch" : "Edit Batch Details"}
      size="lg"
    >
      <LoadingOverlay visible={isLoadingData} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              {isAdd ? (
                <Select
                  label="Medicine"
                  placeholder="Select medicine"
                  data={medicines}
                  searchable
                  required
                  {...form.getInputProps("medicine_id")}
                />
              ) : (
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={500}>
                    Medicine
                  </Text>
                  <Text fw={600}>
                    {detail?.item_name || detail?.medicine?.brand_name || "N/A"}
                  </Text>
                </Stack>
              )}
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Batch Number"
                placeholder="Ex. B123"
                readOnly={!isAdd}
                variant={isAdd ? "default" : "filled"}
                required
                {...form.getInputProps("batch_no")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              {isAdd ? (
                <Select
                  label="Vendor"
                  placeholder="Select vendor"
                  data={vendors}
                  searchable
                  required
                  {...form.getInputProps("vendor_id")}
                />
              ) : (
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={500}>
                    Vendor
                  </Text>
                  <Text size="sm">
                    {detail?.vendor_name || detail?.vendor?.name || "N/A"}
                  </Text>
                </Stack>
              )}
            </Grid.Col>

            <Grid.Col span={6}>
              <DateInput
                label="Mfg Date"
                readOnly={!isAdd}
                variant={isAdd ? "default" : "filled"}
                valueFormat="DD/MM/YYYY"
                required
                {...form.getInputProps("mfg_date")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <DateInput
                label="Expiry Date"
                readOnly={!isAdd}
                variant={isAdd ? "default" : "filled"}
                valueFormat="DD/MM/YYYY"
                required
                minDate={form.values.mfg_date}
                {...form.getInputProps("exp_date")}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <NumberInput
                label="Purchase Rate"
                readOnly={!isAdd}
                variant={isAdd ? "default" : "filled"}
                prefix="₹"
                min={0}
                required
                {...form.getInputProps("purchase_rate")}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <NumberInput
                label="Quantity Available"
                readOnly={!isAdd}
                variant={isAdd ? "default" : "filled"}
                description={isAdd ? "Initial Stock" : undefined}
                min={0}
                required
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
            {isAdd ? "Create Batch" : "Save Changes"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default BatchModal;
