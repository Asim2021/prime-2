import { ActionIcon, Avatar, Badge, Flex, Text, Title } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { deleteUser } from "@services/userService";
import {
  apiErrNotification,
  successNotification,
} from "@utils/sendNotification";
import { modals } from "@mantine/modals";
import { QUERY_KEY } from "@constants/queryKeys";
import { capitalize } from "lodash-es";
import { USER_COLUMNS } from "../../constant";

const useUserColumn = (onEdit: (user: UserI) => void) => {
  const queryClient = useQueryClient();

  const useDeleteUser = useMutation<string, AxiosError, string>({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_USERS] });
      successNotification(`User deleted`);
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const deleteHandler = (user: UserI) => {
    const openModal = () =>
      modals.openConfirmModal({
        modalId: "confirmation_modal",
        title: (
          <Title size="18" fw={500}>
            Delete Account
          </Title>
        ),
        children: (
          <Text size="sm">
            Are you sure you want to delete{" "}
            <Text span c="red.7" fw={600}>
              {user.username}
            </Text>
            's Account ?
          </Text>
        ),
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onConfirm: () => useDeleteUser.mutate(user.id as string),
      });

    openModal();
  };

  const columns = useMemo<ColumnDef<UserI>[]>(
    () => [
      {
        id: USER_COLUMNS.USERNAME,
        accessorKey: USER_COLUMNS.USERNAME,
        header: "Name",
        minSize: 250,
        cell: (props) => {
          const { username, email } = props.row.original;

          return (
            <div className="min-w-max flex gap-2 items-center">
              <Avatar
                src={null}
                alt={"Profile Icon"}
                radius={40}
                size={40}
                className="err_avatar"
              />
              <span className="flex flex-col items-start">
                <Text fz="sm" miw={"max-content"}>
                  {capitalize(username)}
                </Text>
                <Text fz="xs" c="dimmed" miw={"max-content"}>{`${email}`}</Text>
              </span>
            </div>
          );
        },
      },
      {
        id: USER_COLUMNS.ROLE_NAME,
        accessorKey: USER_COLUMNS.ROLE_NAME,
        header: "Role",
        cell: (props) => (
          <div className="min-w-max">{props.getValue() as React.ReactNode}</div>
        ),
      },
      {
        id: USER_COLUMNS.ACTIVE,
        accessorKey: USER_COLUMNS.ACTIVE,
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="filled"
            color={!row.original.is_active ? "gray.5" : "green"}
          >
            {!row.original.is_active ? "InActive" : "Active"}
          </Badge>
        ),
      },
      {
        id: USER_COLUMNS.ACTION,
        size: 120,
        cell: ({ row }) => (
          <Flex gap={8} justify={"center"}>
            <ActionIcon
              aria-label="Edit User"
              title="Edit"
              onClick={() => onEdit(row.original)}
              radius={"100%"}
              variant="light"
              className="shadow-erp-shadow"
            >
              <MdModeEdit size={18} />
            </ActionIcon>
            <ActionIcon
              aria-label="Delete User"
              title="Delete"
              radius={"100%"}
              variant="light"
              color="red"
              onClick={() => deleteHandler(row.original)}
              className="shadow-erp-shadow"
            >
              <FaTrash size={18} />
            </ActionIcon>
          </Flex>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onEdit],
  );

  return { columns };
};

export default useUserColumn;
