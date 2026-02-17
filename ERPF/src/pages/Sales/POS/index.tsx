import { Grid, Paper } from "@mantine/core";
import { useState } from "react";
import ProductSearch from "./ProductSearch";
import POSCart from "./Cart";
import CheckoutModal from "./CheckoutModal";
import { useHotkeys } from "@mantine/hooks";

const POS = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Keyboard shortcuts
  useHotkeys([["F2", () => setCheckoutOpen(true)]]);

  return (
    <div className="h-full w-full p-4">
      <Grid h="100%" gutter="lg">
        {/* Left Side: Search & Product Selection */}
        <Grid.Col span={8} h="100%">
          <Paper withBorder p="md" h="100%" shadow="sm" radius="md">
            <ProductSearch />
          </Paper>
        </Grid.Col>

        {/* Right Side: Cart & Summary */}
        <Grid.Col span={4} h="100%">
          <POSCart onCheckout={() => setCheckoutOpen(true)} />
        </Grid.Col>
      </Grid>

      <CheckoutModal
        opened={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
};

export default POS;
