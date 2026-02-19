import { Tabs, Paper } from "@mantine/core";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import MedicineList from "./MedicineList";
import BatchList from "./BatchList";
import StockAdjustment from "./StockAdjustment";
import { MdMedication, MdLayers, MdHistory } from "react-icons/md";

const Inventory = () => {
  const location = useLocation();

  // Determine active tab based on URL or default to 'medicines'
  const getActiveTab = () => {
    if (location.pathname.includes("/batches")) return "batches";
    if (location.pathname.includes("/adjustments")) return "adjustments";
    return "medicines";
  };

  const [activeTab, setActiveTab] = useState<string | null>(getActiveTab());

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    // Optional: Update URL on tab change for deep linking
    // if (value === "medicines") navigate("/inventory");
    // if (value === "batches") navigate("/inventory/batches");
    // if (value === "adjustments") navigate("/inventory/adjustments");
  };

  return (
    <div className="w-full h-full p-2">
      <Paper p="md" radius="md" h="100%" className="flex flex-col">
        <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
          <Tabs.List mb="md">
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

          <Tabs.Panel value="medicines" h="calc(100% - 60px)">
            {/* We hide the title to avoid duplication with Tab label */}
            <MedicineList withHeader={false} />
          </Tabs.Panel>

          <Tabs.Panel value="batches" h="calc(100% - 60px)">
            <BatchList withHeader={false} />
          </Tabs.Panel>

          <Tabs.Panel value="adjustments" h="calc(100% - 60px)">
            <StockAdjustment withHeader={false} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Inventory;
