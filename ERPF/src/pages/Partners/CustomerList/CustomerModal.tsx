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
import useCustomerStore from "@stores/customerStore";
import { addCustomer, editCustomer } from "@services/partnerService";

const CustomerModal = () => {
  const { modalAction, setModalAction, detail, setDetail } = useCustomerStore();
  const queryClient = useQueryClient();

  const form = useForm<Partial<CustomerI>>({
    initialValues: {
      name: "",
      phone: "",
      gstin: "",
      credit_limit: 0,
      outstanding_balance: 0,
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
    mutationFn: (values: Partial<CustomerI>) => {
      if (modalAction === "EDIT" && detail) {
        return editCustomer(detail.id, values);
      }
      return addCustomer(values);
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `Customer ${modalAction === "EDIT" ? "updated" : "added"} successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
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

  const handleSubmit = (values: Partial<CustomerI>) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      opened={!!modalAction}
      onClose={handleClose}
      title={`${modalAction === "EDIT" ? "Edit" : "Add"} Customer`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Name"
              placeholder="Customer Name"
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
              label="GSTIN"
              placeholder="GST Number (Optional)"
              {...form.getInputProps("gstin")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Credit Limit"
              placeholder="0"
              min={0}
              {...form.getInputProps("credit_limit")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Outstanding Balance"
              placeholder="0"
              min={0}
              {...form.getInputProps("outstanding_balance")}
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

export default CustomerModal;
