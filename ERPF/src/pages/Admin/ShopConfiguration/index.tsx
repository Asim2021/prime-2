import { useEffect } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Divider,
  Grid,
  Group,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Paper,
  LoadingOverlay,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@constants/queryKeys";
import { notifications } from "@mantine/notifications";
import MainHeader from "@components/Header/MainHeader";
import { fetchShopSettings, updateShopSettings } from "@services/shopService";

const ShopConfiguration = () => {
  const queryClient = useQueryClient();

  // @ts-ignore
  const { data: shopSettings, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SHOP_SETTINGS],
    queryFn: fetchShopSettings,
  });

  const form = useForm<Partial<any>>({
    initialValues: {
      shop_name: "",
      gst_number: "",
      drug_license_no: "",
      address_line_1: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      invoice_prefix: "INV",
      paper_width_mm: 80,
      near_expiry_days: 90,
    },
    validate: {
      shop_name: (value: unknown) => (value ? null : "Shop Name is required"),
      gst_number: (value: unknown) => (value ? null : "GST Number is required"),
      drug_license_no: (value: unknown) =>
        value ? null : "Drug License is required",
      address_line_1: (value: unknown) =>
        value ? null : "Address is required",
      city: (value: unknown) => (value ? null : "City is required"),
      state: (value: unknown) => (value ? null : "State is required"),
      pincode: (value: unknown) =>
        /^\d{6}$/.test(String(value || "")) ? null : "Invalid Pincode",
      phone: (value: unknown) => (value ? null : "Phone is required"),
    },
  });

  useEffect(() => {
    if (shopSettings) {
      form.setValues(shopSettings);
    }
  }, [shopSettings]);

  const mutation = useMutation({
    mutationFn: updateShopSettings,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Shop settings updated successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SHOP_SETTINGS] });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to update settings",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: Partial<ShopSettingsI>) => {
    mutation.mutate(values);
  };

  return (
    <div className="w-full h-full pb-24 relative overflow-y-auto">
      <LoadingOverlay
        visible={isLoading || mutation.isPending}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <MainHeader title="Shop Configuration" />
      <Divider />

      <Paper
        p="md"
        mt="md"
        radius="md"
        withBorder
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Shop Name"
                placeholder="Enter shop name"
                required
                {...form.getInputProps("shop_name")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="GST Number"
                placeholder="GSTIN"
                required
                {...form.getInputProps("gst_number")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Drug License No"
                placeholder="DL Number"
                required
                {...form.getInputProps("drug_license_no")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Address Line 1"
                placeholder="Street Address"
                required
                {...form.getInputProps("address_line_1")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Address Line 2"
                placeholder="Area / Locality"
                {...form.getInputProps("address_line_2")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="City"
                placeholder="City"
                required
                {...form.getInputProps("city")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="State"
                placeholder="State"
                required
                {...form.getInputProps("state")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Pincode"
                placeholder="Pincode"
                required
                {...form.getInputProps("pincode")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Phone"
                placeholder="Contact Number"
                required
                {...form.getInputProps("phone")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Email"
                placeholder="Email Address"
                {...form.getInputProps("email")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Divider
                label="Invoice Settings"
                labelPosition="center"
                my="sm"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Invoice Prefix"
                placeholder="e.g INV"
                {...form.getInputProps("invoice_prefix")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Paper Width"
                data={["58", "80"]}
                value={String(form.values.paper_width_mm)}
                onChange={(val) =>
                  form.setFieldValue("paper_width_mm", Number(val) as 58 | 80)
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Near Expiry Alert (Days)"
                description="Show alert if batch expires within these days"
                {...form.getInputProps("near_expiry_days")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Textarea
                label="Invoice Footer Text"
                placeholder="Terms and conditions..."
                autosize
                minRows={2}
                {...form.getInputProps("invoice_footer_text")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Group justify="flex-end" mt="md">
                <Button type="submit" loading={mutation.isPending}>
                  Save Settings
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default ShopConfiguration;
