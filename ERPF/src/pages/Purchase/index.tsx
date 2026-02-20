import { Tabs, Paper } from "@mantine/core";
import { useState } from "react";
import { MdMedication, MdLayers } from "react-icons/md";
import PurchaseEntry from "./PurchaseEntry";
import PurchaseList from "./PurchaseList";

const Purchase = () => {
  const [activeTab, setActiveTab] = useState<string | null>("new_purchase");

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full h-full">
      <Paper radius="md" h="100dvh" className="flex flex-col">
        <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab
              value="new_purchase"
              leftSection={<MdMedication size={16} />}
            >
              New Purchase
            </Tabs.Tab>
            <Tabs.Tab
              value="purchase_history"
              leftSection={<MdLayers size={16} />}
            >
              Purchase History
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="new_purchase" h="calc(100dvh - 54px)">
            <PurchaseEntry />
          </Tabs.Panel>

          <Tabs.Panel value="purchase_history" h="calc(100dvh - 54px)">
            <PurchaseList handleTabChange={handleTabChange} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Purchase;
