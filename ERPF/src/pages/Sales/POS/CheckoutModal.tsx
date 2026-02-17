import {
  Button,
  Card,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import useCartStore from "@stores/cartStore";
import { createSale } from "@services/salesService";

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
  const totals = getTotals();

  const mutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Sale completed successfully!",
        color: "green",
      });
      reset(); // Clear cart
      onClose();
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
      items: items.map((item) => ({
        batch_id: item.id,
        quantity: item.cartQty,
        selling_price: item.cartPrice,
        mrp_at_sale: item.mrp,
      })),
    };
    mutation.mutate(payload as any);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Complete Sale" size="md">
      <Stack gap="md">
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Customer Details
          </Text>
          <TextInput
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <TextInput
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />
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

        <Card bg="gray.1" withBorder>
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
