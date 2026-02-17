import { useEffect } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import useVendorStore from "@stores/vendorStore";
import { addVendor, editVendor } from "@services/partnerService";

const VendorModal = () => {
  const { modalAction, setModalAction, detail, setDetail } = useVendorStore();
  const queryClient = useQueryClient();

  const form = useForm<Partial<VendorI>>({
    initialValues: {
      name: "",
      phone: "",
      contact_person: "",
      gst_number: "",
      address: "",
      credit_days: 0,
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      phone: (value) => (value ? null : "Phone is required"),
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
    mutationFn: (values: Partial<VendorI>) => {
      if (modalAction === "EDIT" && detail) {
        return editVendor(detail.id, values);
      }
      return addVendor(values);
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `Vendor ${modalAction === "EDIT" ? "updated" : "added"} successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
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

  const handleSubmit = (values: Partial<VendorI>) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      opened={!!modalAction}
      onClose={handleClose}
      title={`${modalAction === "EDIT" ? "Edit" : "Add"} Vendor`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Name"
              placeholder="Vendor Name"
              required
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Phone"
              placeholder="Phone Number"
              required
              {...form.getInputProps("phone")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Contact Person"
              placeholder="Contact Person"
              {...form.getInputProps("contact_person")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="GST Number"
              placeholder="GSTIN"
              {...form.getInputProps("gst_number")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Credit Days"
              placeholder="0"
              min={0}
              {...form.getInputProps("credit_days")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Address"
              placeholder="Full Address"
              {...form.getInputProps("address")}
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

export default VendorModal;
