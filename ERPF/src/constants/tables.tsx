import { CellContext } from "@tanstack/react-table";
import { PREFIX } from "./strings";

export const TABLES = {
  USERS: `${PREFIX}-users-table`,
};

export const createColumn = <TData extends object>(
  id: string,
  header: string,
  customCell?: (props: CellContext<TData, unknown>) => unknown,
) => ({
  id,
  accessorKey: id,
  header,
  cell: (props: CellContext<TData, unknown>) =>
    customCell ? (
      customCell(props)
    ) : (
      <span title={props.getValue() as string}>
        {(props.getValue() as string) || "-"}
      </span>
    ),
});
