import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import DraggableTableHeader from "./DraggableTableHeader";
import { TableHeaderI } from "@src/types/table";


const TableHead = <TData extends object>({
  table,
  columnOrder,
  columnIdsToSort,
  persistColumnSorting,
}: TableHeaderI<TData>) => {

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="group">
          <SortableContext
            items={columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {headerGroup.headers.map((header) => (
              <DraggableTableHeader
                table={table}
                key={header.id}
                header={header}
                columnIdsToSort={columnIdsToSort}
                persistColumnSorting={persistColumnSorting}
              />
            ))}
          </SortableContext>
        </tr>
      ))}
    </thead>
  );
};
export default TableHead;
