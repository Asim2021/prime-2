import { ActionIcon, Badge, Group, Text, Tooltip } from "@mantine/core";
import { useMemo, useState } from "react";
import { MdVisibility } from "react-icons/md";
import MainTable from "@components/Table";
import { fetchAllSales } from "@services/salesService";
import { SaleI } from "@types/sales";
// import InvoiceViewer from "./InvoiceViewer"; // To be implemented

const SalesHistory = () => {
  const [viewId, setViewId] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: "bill_no",
        header: "Bill No",
        cell: (info: any) => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: "bill_date",
        header: "Date",
        cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: "customer_name",
        header: "Customer",
      },
      {
        accessorKey: "grand_total", // Backend returns 'grand_total' or 'total_amount'?
        // sale.service.js: total_amount: data.total_amount ... wait, let's check backend response.
        // It returns 'total_amount' and 'taxable_amount'.
        // Let's use total_amount as the final payable.
        header: "Amount",
        cell: (info: any) => (
          <Text fw={600}>₹{info.row.original.total_amount}</Text>
        ),
      },
      {
        accessorKey: "payment_mode",
        header: "Mode",
        cell: (info: any) => (
          <Badge
            color={
              info.getValue() === "cash"
                ? "green"
                : info.getValue() === "credit"
                  ? "orange"
                  : "blue"
            }
          >
            {info.getValue().toUpperCase()}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: (info: any) => (
          <Group gap="xs">
            <Tooltip label="View Invoice">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => setViewId(info.row.original.id)}
              >
                <MdVisibility size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <MainTable
        queryKey={["sales-history"]}
        queryFn={fetchAllSales}
        columns={columns}
        searchPlaceholder="Search Invoice, Customer..."
        title="Sales History"
      />
      {/* {viewId && (
        <InvoiceViewer
          opened={!!viewId}
          onClose={() => setViewId(null)}
          saleId={viewId}
        />
      )} */}
    </>
  );
};

export default SalesHistory;
