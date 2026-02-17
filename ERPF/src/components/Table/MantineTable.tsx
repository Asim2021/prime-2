import React from "react";
import { get, isEmpty } from "lodash-es";
import {
  ActionIcon,
  Divider,
  Table,
  TableProps,
  Text,
  TextInput,
  Pagination,
} from "@mantine/core";
import NoDataFound from "@components/NoDataFound";
import clsx from "clsx";
import { FiSearch } from "react-icons/fi";
import { MdClose, MdModeEdit } from "react-icons/md";
import CenterLoader from "@components/CenterLoader/Index";
import { FaTrash } from "react-icons/fa6";

const MantineTable = <T extends object>({
  TData,
  isLoading,
  headers,
  caption = "",
  className,
  tableClasses,
  headerButtons = <></>,
  height,
  serachplaceholder,
  search,
  setSearch,
  showSearch = false,
  stripedColor = "light-dark(var(--mantine-primary-color-0), var(--mantine-color-dark-6))",
  isActionColumn = false,
  editHandler,
  deleteHandler,
  total,
  page,
  limit,
  onPageChange,
  ...props
}: MaintineTableI<T>) => {
  return (
    <div
      className={clsx("flex flex-col !relative", className)}
      style={{ height: height }}
    >
      {!!caption && (
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between p-1 px-2">
          <Text size="md" c={"bright"}>
            {caption}
          </Text>
          <span className="flex items-center gap-2">
            {showSearch && setSearch && (
              <TextInput
                leftSection={<FiSearch size={"20"} />}
                placeholder={serachplaceholder || "Search item..."}
                key={"ig-search"}
                onChange={(e) => setSearch(e.currentTarget.value)}
                value={search}
                rightSection={
                  <MdClose
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    style={{ display: search ? undefined : "none" }}
                    className="cursor-pointer"
                    size={20}
                  />
                }
                className="!w-48"
              />
            )}

            {headerButtons}
          </span>
        </div>
      )}
      {!!caption && <Divider className="mx-2" />}
      <Table.ScrollContainer
        minWidth={"100%"}
        type="scrollarea"
        className={tableClasses}
      >
        <Table stickyHeader stripedColor={stripedColor} {...props}>
          {/* Table Header */}
          <Table.Thead>
            <Table.Tr className="!bg-primary-500">
              {headers?.map((header) => (
                <Table.Th key={String(header.key)}>
                  <Text size="sm" className="text-nowrap">
                    {header.label}
                  </Text>
                </Table.Th>
              ))}
              {isActionColumn && (
                <Table.Th key="actions">
                  <Text size="sm">Actions</Text>
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          {/* Table Body */}
          <Table.Tbody>
            {!isLoading &&
              !isEmpty(TData) &&
              TData?.map((dataItem, rowIndex) => (
                <Table.Tr key={rowIndex}>
                  {headers?.map((header) => (
                    <Table.Td key={String(header.key)}>
                      <Text size="xs">
                        {header.render
                          ? header.render(dataItem)
                          : (get(dataItem, header.key, "") as React.ReactNode)}
                      </Text>
                    </Table.Td>
                  ))}
                  {isActionColumn && (
                    <Table.Td
                      key={"actions"}
                      className="flex items-center gap-2"
                    >
                      {!!editHandler && (
                        <ActionIcon
                          size={24}
                          aria-label="Edit"
                          title="Edit"
                          radius={"100%"}
                          variant="light"
                          onClick={() => editHandler(dataItem)}
                        >
                          <MdModeEdit size={16} />
                        </ActionIcon>
                      )}
                      {!!deleteHandler && (
                        <ActionIcon
                          size={24}
                          aria-label="Delete"
                          title="Delete"
                          radius={"100%"}
                          variant="light"
                          color="red"
                          onClick={() => deleteHandler(dataItem)}
                        >
                          <FaTrash size={14} />
                        </ActionIcon>
                      )}
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {TData?.length === 0 && !isLoading && (
        <NoDataFound
          className="!pt-0 absolute top-1/3 left-1/2 !w-0"
          size={80}
        />
      )}
      {isLoading && <CenterLoader />}
      {!!total && !!page && !!limit && !!onPageChange && (
        <div className="flex justify-end p-2 border-t border-gray-200 bg-white">
          <Pagination
            total={Math.ceil(total / limit)}
            value={page}
            onChange={onPageChange}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};
export default MantineTable;

interface MaintineTableI<T extends object> extends TableProps {
  TData: T[] | undefined;
  isLoading?: boolean;
  headers: {
    key: string;
    label: string;
    render?: (record: T) => React.ReactNode;
  }[];
  caption?: string;
  tableClasses?: string | undefined;
  className?: string | undefined;
  headerButtons?: React.ReactNode;
  height?: number;
  serachplaceholder?: string;
  search?: string;
  setSearch?: (arg: string) => void;
  showSearch?: boolean;
  isActionColumn?: boolean;
  editHandler?: (arg: T) => void;
  deleteHandler?: (arg: T) => void;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (arg: number) => void;
}
