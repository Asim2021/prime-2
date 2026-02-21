import { Tabs, Paper } from "@mantine/core";
import { useState } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoStorefront } from "react-icons/io5";
import VendorList from "./VendorList";
import CustomerList from "./CustomerList";

const Partners = () => {
  const [activeTab, setActiveTab] = useState<string | null>("vendors");

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full h-full">
      <Paper radius="md" h="100dvh" className="flex flex-col">
        <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="vendors" leftSection={<IoStorefront size={16} />}>
              Vendors
            </Tabs.Tab>
            <Tabs.Tab
              value="customers"
              leftSection={<BsFillPeopleFill size={16} />}
            >
              Customers
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="vendors" h="calc(100dvh - 48px)">
            <VendorList />
          </Tabs.Panel>

          <Tabs.Panel value="customers" h="calc(100dvh - 48px)">
            <CustomerList />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Partners;
