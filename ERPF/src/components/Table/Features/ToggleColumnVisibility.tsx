import clsx from "clsx";
import { isEmpty } from "lodash-es";
import { HiViewColumns } from "react-icons/hi2";

import { LOCAL_STORAGE_KEYS } from "@constants/strings";
import {
  ActionIcon,
  Divider,
  Flex,
  Group,
  Menu,
  SimpleGrid,
  Switch,
} from "@mantine/core";
import { CustomTableOptions } from "@src/types/table";
import { Table } from "@tanstack/react-table";

import classes from "../table.module.css";

const showAllHandler = <TData extends object>(table: Table<TData>) => {
  table.toggleAllColumnsVisible(true);
};

const ResetHandler = <TData extends object>(table: Table<TData>) => {
  table.resetColumnVisibility();
  localStorage.setItem(
    `${(table.options as CustomTableOptions<TData>)?.tableId as string}-${
      LOCAL_STORAGE_KEYS.COLUMN_VISIBILITY
    }`,
    JSON.stringify({
      ...table.initialState.columnVisibility,
    })
  );
};

const FOOTER_OPTIONS = [
  { title: "Show All", onClick: showAllHandler },
  { title: "Reset", onClick: ResetHandler },
];

const ToggleColumnVisibility = <TData extends object>({
  table,
  className = "",
  persistColumnVisibility = false,
}: ToggleColumnVisibilityI<TData>) => {
  const handleToggleVisibility = (checked: boolean, columnId: string) => {
    const column = table.getColumn(columnId);
    column?.toggleVisibility(checked);
    // Saving in Session Storage
    if (persistColumnVisibility) {
      const tableId = (table.options as CustomTableOptions<TData>)
        ?.tableId as string;
      localStorage.setItem(
        `${tableId}-${LOCAL_STORAGE_KEYS.COLUMN_VISIBILITY}`,
        JSON.stringify({
          ...table.getState().columnVisibility,
          [columnId]: checked,
        })
      );
    }
  };
  const cols = Math.ceil(table.getAllColumns().length / 10);

  return (
    <Menu
      shadow="md"
      offset={10}
      width={"max-content"}
      zIndex={1000}
      withArrow
      withinPortal={false}
    >
      <Menu.Target>
        <ActionIcon
          aria-label={"Toggle Columns"}
          title={"Toggle Columns"}
          variant="filled"
          size={"lg"}
          className={clsx(classes.toggleColumnBtn, className)}
        >
          <HiViewColumns size={25} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Show / Hide Columns</Menu.Label>
        <SimpleGrid
          cols={cols}
          spacing="xs"
          verticalSpacing="xs"
          className="px-2 py-1"
        >
          {table.getAllColumns().map((column, i) => {
            if (["action", "actions"].includes(column.id)) {
              return null;
            }
            return (
              <Group justify="space-between" key={column.id}>
                <Switch
                  key={column.id}
                  size="xs"
                  title={column.getCanHide() ? "Hide" : "Show"}
                  checked={column.getIsVisible()}
                  disabled={!column.getCanHide()}
                  onChange={(e) =>
                    handleToggleVisibility(e.target.checked, column.id)
                  }
                  label={column.columnDef.header as string}
                  className="!cursor-pointer"
                />
                {(i + 1) % cols !== 0 && <Divider orientation="vertical" />}
              </Group>
            );
          })}
        </SimpleGrid>
        <Divider className="my-1 mx-2" />
        <Flex justify={"space-between"} align={"center"} px={8}>
          {FOOTER_OPTIONS.map((option, index) =>
            option.title === "Reset" &&
            isEmpty(table.initialState.columnVisibility) ? null : (
              <span
                key={index}
                className="text-sm cursor-pointer hover:text-primary-500"
                onClick={() => option.onClick(table as Table<TData>)}
              >
                {option.title}
              </span>
            )
          )}
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
};
export default ToggleColumnVisibility;

interface ToggleColumnVisibilityI<TData extends object> {
  table: Table<TData>;
  className?: string;
  persistColumnVisibility?: boolean;
}
