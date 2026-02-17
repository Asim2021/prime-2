import { useEffect } from "react";
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Select,
  Switch,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { fetchAllRoles } from "@services/roleService";
import { addUser, editUser } from "@services/userService";

interface UserModalProps {
  opened: boolean;
  close: () => void;
  action: "ADD" | "EDIT" | null;
  detail: any | null;
}

const UserModal = ({ opened, close, action, detail }: UserModalProps) => {
  const queryClient = useQueryClient();

  const { data: rolesData } = useQuery({
    queryKey: ["roles-select"],
    queryFn: () => fetchAllRoles({ page: 1, limit: 100 }),
    enabled: opened,
  });

  const roleOptions =
    rolesData?.data?.map((role) => ({
      value: role.id,
      label: role.name,
    })) || [];

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role_id: "",
      is_active: true,
    },
    validate: {
      username: (value) => (value.length < 3 ? "Username too short" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        action === "ADD" && value.length < 6 ? "Password too short" : null,
      role_id: (value) => (value ? null : "Role is required"),
    },
  });

  useEffect(() => {
    if (action === "EDIT" && detail) {
      form.setValues({
        username: detail.username,
        email: detail.email,
        role_id: detail.role_id,
        is_active: detail.is_active,
        password: "", // Don't show password
      });
    } else {
      form.reset();
    }
  }, [action, detail, opened]);

  const mutation = useMutation({
    mutationFn: (values: any) => {
      if (action === "EDIT" && detail) {
        // Only send changed fields or allowed fields
        const { password, ...rest } = values;
        const payload = password ? values : rest;
        return editUser(detail.id, payload);
      }
      return addUser(values);
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `User ${action === "EDIT" ? "updated" : "added"} successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      close();
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Operation failed",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${action === "EDIT" ? "Edit" : "Add"} User`}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Username"
            placeholder="Enter username"
            required
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder={
              action === "EDIT"
                ? "Leave blank to keep current"
                : "Enter password"
            }
            required={action === "ADD"}
            {...form.getInputProps("password")}
          />
          <Select
            label="Role"
            placeholder="Select user role"
            data={roleOptions}
            required
            {...form.getInputProps("role_id")}
          />
          {action === "EDIT" && (
            <Switch
              label="Is Active"
              {...form.getInputProps("is_active", { type: "checkbox" })}
            />
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Save User
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default UserModal;
