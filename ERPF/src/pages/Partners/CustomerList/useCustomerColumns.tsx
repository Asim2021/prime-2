import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ActionIcon, Group, Text, Badge } from "@mantine/core";
import { MdEdit, MdDelete } from "react-icons/md";
import useCustomerStore from "@stores/customerStore";
import { modals } from "@mantine/modals";

const useCustomerColumns = (deleteHandler: (id: string) => void) => {
  const { setModalAction, setDetail } = useCustomerStore();

  const columns = useMemo<ColumnDef<CustomerI>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.name}
          </Text>
        ),
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <Text size="sm">{row.original.phone}</Text>,
      },
      {
        id: "gstin",
        accessorKey: "gstin",
        header: "GSTIN",
        cell: ({ row }) => <Text size="sm">{row.original.gstin || "-"}</Text>,
      },
      {
        id: "credit_limit",
        accessorKey: "credit_limit",
        header: "Credit Limit",
        cell: ({ row }) => <Text size="sm">₹{row.original.credit_limit}</Text>,
      },
      {
        id: "outstanding_balance",
        accessorKey: "outstanding_balance",
        header: "Balance",
        cell: ({ row }) => (
          <Badge
            color={row.original.outstanding_balance > 0 ? "red" : "green"}
            variant="light"
          >
            ₹{row.original.outstanding_balance}
          </Badge>
        ),
      },
      {
        id: "action",
        size: 120,
        cell: ({ row }) => (
          <Group gap="xs">
            <ActionIcon
              variant="light"
              radius={"100%"}
              color="blue"
              onClick={() => {
                setDetail(row.original);
                setModalAction("EDIT");
              }}
            >
              <MdEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              radius={"100%"}
              color="red"
              onClick={() => {
                modals.openConfirmModal({
                  title: "Delete Customer",
                  children: (
                    <Text size="sm">
                      Are you sure you want to delete customer{" "}
                      <strong>{row.original.name}</strong>?
                    </Text>
                  ),
                  labels: { confirm: "Delete", cancel: "Cancel" },
                  confirmProps: { color: "red" },
                  onConfirm: () => deleteHandler(row.original.id),
                });
              }}
            >
              <MdDelete size={16} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    [],
  );

  return columns;
};

export default useCustomerColumns;
