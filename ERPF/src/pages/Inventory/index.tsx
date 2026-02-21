import { Tabs, Paper } from "@mantine/core";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MedicineList from "./MedicineList";
import BatchList from "./BatchList";
import StockAdjustment from "./StockAdjustment";
import { MdMedication, MdLayers, MdHistory } from "react-icons/md";
import { ROUTES } from "@constants/endpoints";

const Inventory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname.includes(ROUTES.INVENTORY.BATCHES)) return "batches";
    if (location.pathname.includes(ROUTES.INVENTORY.STOCK_ADJ))
      return "adjustments";
    return "medicines";
  };

  const [activeTab, setActiveTab] = useState<string | null>(getActiveTab());

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);

    if (value === "medicines") navigate(ROUTES.INVENTORY.MEDICINES);
    if (value === "batches") navigate(ROUTES.INVENTORY.BATCHES);
    if (value === "adjustments") navigate(ROUTES.INVENTORY.STOCK_ADJ);
  };

  return (
    <div className="w-full h-full">
      <Paper radius="md" h="100dvh" className="flex flex-col">
        <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab
              value="medicines"
              leftSection={<MdMedication size={16} />}
            >
              Medicines
            </Tabs.Tab>
            <Tabs.Tab value="batches" leftSection={<MdLayers size={16} />}>
              Batches
            </Tabs.Tab>
            <Tabs.Tab value="adjustments" leftSection={<MdHistory size={16} />}>
              Stock Adjustments
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="medicines" h="calc(100dvh - 48px)">
            {/* We hide the title to avoid duplication with Tab label */}
            <MedicineList withHeader={false} />
          </Tabs.Panel>

          <Tabs.Panel value="batches" h="calc(100dvh - 48px)">
            <BatchList withHeader={false} />
          </Tabs.Panel>

          <Tabs.Panel value="adjustments" h="calc(100dvh - 48px)">
            <StockAdjustment withHeader={false} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Inventory;
