import React from "react";
import { Table, flexRender, Row } from "@tanstack/react-table";
import { Card, Stack, Text, Flex, Box } from "@mantine/core";
import classes from "./mobileCardList.module.css";

interface MobileCardListProps<TData extends object> {
  table: Table<TData>;
  onCardClick?: (row: Row<TData>) => void;
}

const MobileCardList = <TData extends object>({
  table,
  onCardClick,
}: MobileCardListProps<TData>) => {
  const rows = table.getRowModel().rows;

  return (
    <Stack gap="sm" className={classes.cardListContainer}>
      {rows.map((row) => (
        <Card
          key={row.id}
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          className={`${classes.card} ${onCardClick ? classes.clickable : ""}`}
          onClick={() => onCardClick?.(row)}
        >
          <Stack gap="sm">
            {row.getVisibleCells().map((cell) => {
              const header = cell.column.columnDef.header;
              const isAction = cell.column.id === "action";

              // Try to find a sensible label for the field
              let label = typeof header === "string" ? header : "";
              if (!label) {
                // If there's no string header, we fallback to id, but capitalize it nicely
                label =
                  cell.column.id !== "action"
                    ? cell.column.id.charAt(0).toUpperCase() +
                      cell.column.id.slice(1).replace(/_/g, " ")
                    : "";
              }

              return (
                <Flex
                  key={cell.id}
                  justify={isAction ? "flex-end" : "space-between"}
                  align="flex-start"
                  wrap="nowrap"
                  className={isAction ? classes.actionCell : classes.normalCell}
                >
                  {!isAction && (
                    <Text
                      fw={500}
                      size="sm"
                      c="dimmed"
                      style={{ flexShrink: 0, marginRight: 8 }}
                      className={classes.label}
                    >
                      {label}
                    </Text>
                  )}
                  <Box
                    className={isAction ? classes.actionBox : classes.valueBox}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                </Flex>
              );
            })}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

// Use generic memoization
export default React.memo(MobileCardList) as typeof MobileCardList;
