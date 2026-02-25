import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ActionIcon, Group, Text } from "@mantine/core";
import { MdEdit, MdDelete } from "react-icons/md";
import useVendorStore from "@stores/vendorStore";
import { modals } from "@mantine/modals";

const useVendorColumns = (deleteHandler: (id: string) => void) => {
  const { setModalAction, setDetail } = useVendorStore();

  const columns = useMemo<ColumnDef<VendorI>[]>(
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
        id: "contact_person",
        accessorKey: "contact_person",
        header: "Contact Person",
        cell: ({ row }) => (
          <Text size="sm">{row.original.contact_person || "-"}</Text>
        ),
      },
      {
        id: "gst_number",
        accessorKey: "gst_number",
        header: "GSTIN",
        cell: ({ row }) => (
          <Text size="sm">{row.original.gst_number || "-"}</Text>
        ),
      },
      {
        id: "action",
        size: 120,
        cell: ({ row }) => (
          <Group gap="xs" justify="center">
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
                  title: "Delete Vendor",
                  children: (
                    <Text size="sm">
                      Are you sure you want to delete vendor{" "}
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

export default useVendorColumns;
