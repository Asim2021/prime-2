import {
  Button,
  Card,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Select,
  ActionIcon,
  Tooltip,
  Badge,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@stores/cartStore";
import { createSale } from "@services/salesService";
import { addCustomer, fetchAllCustomers } from "@services/partnerService";
import { QUERY_KEY } from "@constants/queryKeys";
import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { useDebouncedValue } from "@mantine/hooks";

const CheckoutModal = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const {
    items,
    getTotals,
    paymentMode,
    setPaymentMode,
    customer,
    setCustomer,
    reset,
  } = useCartStore();
  const queryClient = useQueryClient();
  const totals = getTotals();

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);

  // Local state to hold the customer's balance/limit info to prevent UI flickers when search clears
  const [selectedCustomerMeta, setSelectedCustomerMeta] = useState<{
    credit_limit?: number;
    outstanding_balance?: number;
  } | null>(null);

  const { data: customersData } = usePaginationDataFetch({
    queryKey: [QUERY_KEY.CUSTOMERS],
    queryFn: fetchAllCustomers,
    search: debouncedSearch,
    page: 1,
    limit: 100,
    enabled: opened && !isNewCustomer,
  });

  const addCustomerMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: (data) => {
      setCustomer({ id: data.id, name: data.name, phone: data.phone });
      setIsNewCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMERS] });
      notifications.show({
        title: "Success",
        message: "Customer created successfully!",
        color: "green",
      });
    },
    onError: (err: any) => {
      notifications.show({
        title: "Error",
        message: err?.response?.data?.message || "Failed to create customer",
        color: "red",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Sale completed successfully!",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SALES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BATCHES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.DASHBOARD_STATS] });
      reset(); // Clear cart
      onClose();
      // Full page refresh as requested by user to clear all states (medicine selection, etc.)
      window.location.reload();
    },
    onError: (err: any) => {
      notifications.show({
        title: "Error",
        message: err?.response?.data?.message || "Sale failed",
        color: "red",
      });
    },
  });

  const handlePayment = () => {
    const payload = {
      customer_name: customer.name || "CASH CUSTOMER",
      customer_phone: customer.phone,
      customer_id: customer.id,
      payment_mode: paymentMode,
      is_credit: paymentMode === "credit",
      total_amount: totals.total,
      taxable_amount: totals.taxable,
      cgst_amount: totals.gst / 2, // Simplified tax split
      sgst_amount: totals.gst / 2,
      igst_amount: 0,
      items: (items as any[]).map((item) => ({
        batch_id: item.id,
        quantity: item.cartQty,
        selling_price: item.cartPrice,
        mrp_at_sale: item.mrp || 0,
      })),
    };
    mutation.mutate(payload as any);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Complete Sale"
      size="md"
      closeOnClickOutside={false}
    >
      <Stack gap="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Customer Details
            </Text>
            {!isNewCustomer ? (
              <Tooltip label="Create New Customer">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => setIsNewCustomer(true)}
                >
                  <MdAdd size={16} />
                </ActionIcon>
              </Tooltip>
            ) : (
              <Tooltip label="Cancel">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => setIsNewCustomer(false)}
                >
                  <MdClose size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>

          {isNewCustomer ? (
            <Card withBorder bg="var(--mantine-color-gray-0)" p="sm">
              <Stack gap="xs">
                <TextInput
                  placeholder="Customer Name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  data-autofocus
                />
                <TextInput
                  placeholder="Phone Number"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
                <Button
                  size="sm"
                  loading={addCustomerMutation.isPending}
                  onClick={() =>
                    addCustomerMutation.mutate({
                      name: newCustomerName,
                      phone: newCustomerPhone,
                      credit_limit: 0,
                    })
                  }
                  disabled={!newCustomerName.trim()}
                >
                  Save & Select
                </Button>
              </Stack>
            </Card>
          ) : (
            <Select
              placeholder="Search by Name or Phone..."
              data={
                customersData?.data?.map((c) => ({
                  value: c.id,
                  label: `${c.name} - ${c.phone || "No Phone"}`,
                })) || []
              }
              searchable
              nothingFoundMessage="No customers found"
              value={customer.id}
              filter={({ options, search }) => {
                const s = search.toLowerCase().trim();
                return (options as any[]).filter((opt) =>
                  opt.label.toLowerCase().includes(s),
                );
              }}
              searchValue={search}
              onSearchChange={setSearch}
              onChange={(val) => {
                const selected = customersData?.data?.find(
                  (c: any) => c.id === val,
                );
                if (selected) {
                  setCustomer({
                    id: selected.id,
                    name: selected.name,
                    phone: selected.phone || "",
                  });
                  setSelectedCustomerMeta({
                    credit_limit: selected.credit_limit,
                    outstanding_balance: selected.outstanding_balance,
                  });
                } else {
                  // setSearch(val)
                  setCustomer({ id: null, name: "CASH CUSTOMER", phone: "" });
                  setSelectedCustomerMeta(null);
                }
              }}
              clearable
            />
          )}

          {/* Quick display of selected customer if existing, but only if an ID is selected */}
          {!isNewCustomer &&
            customer.id &&
            (() => {
              return (
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">
                    Selected: {customer.name} ({customer.phone || "No Phone"})
                  </Text>
                  {selectedCustomerMeta && (
                    <Group gap="xs">
                      <Badge color="blue" variant="light" size="xs">
                        Limit: ₹{selectedCustomerMeta.credit_limit || 0}
                      </Badge>
                      <Badge
                        color={
                          (selectedCustomerMeta.outstanding_balance || 0) > 0
                            ? "orange"
                            : "gray"
                        }
                        variant="light"
                        size="xs"
                      >
                        Owed: ₹{selectedCustomerMeta.outstanding_balance || 0}
                      </Badge>
                    </Group>
                  )}
                </Stack>
              );
            })()}
        </Stack>

        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Payment Mode
          </Text>
          <SegmentedControl
            value={paymentMode}
            onChange={(val: any) => setPaymentMode(val)}
            data={[
              { label: "Cash", value: "cash" },
              { label: "UPI", value: "upi" },
              { label: "Credit", value: "credit" },
            ]}
          />
        </Stack>

        <Card
          bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))"
          withBorder
        >
          <Group justify="space-between">
            <Text size="lg">Total Payable</Text>
            <Text size="xl" fw={700} c="blue">
              ₹{totals.total.toFixed(2)}
            </Text>
          </Group>
          {paymentMode === "cash" && (
            <TextInput
              mt="sm"
              label="Cash Received"
              placeholder="Amount..."
              description="Change to return will be shown here"
            />
          )}
        </Card>

        <Button
          fullWidth
          size="lg"
          color="green"
          loading={mutation.isPending}
          onClick={handlePayment}
        >
          Confirm & Print
        </Button>
      </Stack>
    </Modal>
  );
};

export default CheckoutModal;
