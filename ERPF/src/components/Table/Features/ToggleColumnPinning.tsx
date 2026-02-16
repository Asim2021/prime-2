import clsx from "clsx";
import { BsFillPinAngleFill } from "react-icons/bs";
import {
  IoChevronForwardCircleSharp,
  IoChevronBackCircleSharp,
  IoCloseCircleSharp,
} from "react-icons/io5";

import { LOCAL_STORAGE_KEYS } from "@constants/strings";
import { ActionIcon, Divider, Flex, Group, Menu, SimpleGrid, Text } from "@mantine/core";
import { ColumnPinningPosition, Table } from "@tanstack/react-table";

import classes from "../table.module.css";
import { without } from "lodash-es";
import { failureNotification } from "@utils/sendNotification";
import { CustomTableOptions } from "@src/types/table";

const ToggleColumnPinning = <TData extends object>({
  table,
  className = "",
  persistColumnPinning = false,
}: ToggleColumnPinningI<TData>) => {
  const tableId = (table.options as CustomTableOptions<TData>)
    ?.tableId as string;
  const FOOTER_OPTIONS = [{ title: "Reset", onClick: ResetHandler }];
  const handleTogglePinning = (
    columnId: string,
    direction: ColumnPinningPosition
  ) => {
    const column = table.getColumn(columnId);
    if (!column?.getIsVisible()) {
      failureNotification(`Can't pin as "${column?.columnDef.header}" column is hidden`);
      return;
    }
    column?.pin(direction);
    if (persistColumnPinning) {
      let currentState = table.getState().columnPinning;
      if (direction === "left") {
        currentState = {
          ...currentState,
          right: without(currentState["right"] as string[], columnId),
        };
      }
      if (direction === "right") {
        currentState = {
          ...currentState,
          left: without(currentState["left"] as string[], columnId),
        };
      }
      if (direction === false) {
        currentState = {
          left: without(currentState["left"] as string[], columnId),
          right: without(currentState["right"] as string[], columnId),
        };
        localStorage.setItem(
          `${tableId}-${LOCAL_STORAGE_KEYS.COLUMN_PINNING}`,
          JSON.stringify(currentState)
        );
        return;
      }

      localStorage.setItem(
        `${tableId}-${LOCAL_STORAGE_KEYS.COLUMN_PINNING}`,
        JSON.stringify({
          ...currentState,
          [direction]: [
            ...(table.getState().columnPinning[
              direction as "left" | "right"
            ] as string[]),
            columnId,
          ],
        })
      );
    }
  };

  function ResetHandler(table: Table<TData>) {
    table.resetColumnPinning();
    persistColumnPinning &&
      localStorage.setItem(
        `${tableId}-${LOCAL_STORAGE_KEYS.COLUMN_PINNING}`,
        JSON.stringify({
          ...table.initialState.columnPinning,
        })
      );
  }

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
          aria-label={"Pin Columns"}
          title={"Pin Columns"}
          variant="filled"
          size={"lg"}
          className={clsx(classes.togglePinningBtn, className)}
        >
          <BsFillPinAngleFill size={22} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Pin / Unpin Columns</Menu.Label>
        <SimpleGrid
          cols={cols}
          spacing="xs"
          verticalSpacing="xs"
          className="px-2 py-1"
        >
          {table.getAllColumns().map((column,i) => {
            if (["action", "actions"].includes(column.id)) {
              return null;
            }
            return (
              <Group key={column.id} justify="space-between" align="center">
                <Text className="!text-[13px]">
                  {(column.columnDef.header as string) + ":"}
                </Text>
                <Group justify="space-between">
                  <span className="flex justify-center items-center gap-1">
                    {column.getIsPinned() !== "left" && (
                      <ActionIcon
                        aria-label="Pin Column Left"
                        title="Pin left"
                        radius={"100%"}
                        variant="light"
                        onClick={() => {
                          handleTogglePinning(column.id, "left");
                        }}
                        size={"sm"}
                      >
                        <IoChevronBackCircleSharp size={18} />
                      </ActionIcon>
                    )}
                    {column.getIsPinned() && (
                      <ActionIcon
                        aria-label="Unpin Column"
                        title="Unpin"
                        radius={"100%"}
                        variant="light"
                        onClick={() => {
                          handleTogglePinning(column.id, false);
                        }}
                        size={"sm"}
                      >
                        <IoCloseCircleSharp size={18} />
                      </ActionIcon>
                    )}
                    {column.getIsPinned() !== "right" && (
                      <ActionIcon
                        aria-label="Column Pin Right"
                        title="Pin right"
                        radius={"100%"}
                        variant="light"
                        onClick={() => {
                          handleTogglePinning(column.id, "right");
                        }}
                        size={"sm"}
                      >
                        <IoChevronForwardCircleSharp size={18} />
                      </ActionIcon>
                    )}
                  </span>
                  {(i + 1) % cols !== 0 && <Divider orientation="vertical" />}
                </Group>
              </Group>
            );
          })}
        </SimpleGrid>
        <Divider className="my-1 mx-2" />
        <Flex justify={"end"} align={"center"} px={8}>
          {FOOTER_OPTIONS.map((option, index) => (
            <span
              key={index}
              className="text-sm cursor-pointer hover:text-primary-500"
              onClick={() => option.onClick(table as Table<TData>)}
            >
              {option.title}
            </span>
          ))}
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
};
export default ToggleColumnPinning;

interface ToggleColumnPinningI<TData extends object> {
  table: Table<TData>;
  className?: string;
  persistColumnPinning?: boolean;
}
