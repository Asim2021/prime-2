import { TableBodyI } from "@src/types/table";
import React from "react";
import DragAlongCell from "./DragAlongCell";
import { Row } from "@tanstack/react-table";

const TableBody = <TData extends object>({
  table,
  hasSubComponent,
  renderSubComponent,
  trClasses,
}: TableBodyI<TData>) => {
  return (
    <tbody>
      {table?.getRowModel()?.rows?.map((row) => (
        <React.Fragment key={row.id}>
          <tr key={row.id} className={trClasses}>
            {row.getVisibleCells().map((cell) => (
              <DragAlongCell
                key={cell.id}
                cell={cell}
              />
            ))}
          </tr>
          {hasSubComponent && row.getIsExpanded() && (
            <tr key={row.id} className={trClasses}>
              <td colSpan={row.getVisibleCells().length}>
                {hasSubComponent && renderSubComponent
                  ? renderSubComponent(row as Row<TData>)
                  : null}
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
};
export default TableBody;
