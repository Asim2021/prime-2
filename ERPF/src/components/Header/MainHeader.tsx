import React, { Dispatch, SetStateAction } from "react";
import { TextInput, TitleOrder } from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import Header from "./HeaderTemplate";

const MainHeader = ({
  setSearch = () => null,
  search = "",
  title = "Header",
  titleOrder,
  placeholder = "Search...",
  modalButton = <></>,
  withSearch = false,
  className = "",
  id = "section-header",
  extraSearchComponent = <></>,
}: MainHeaderI) => {
  return (
    <Header className={className} id={id}>
      <Header.Head title={title} order={titleOrder} className="">
        {withSearch && (
          <>
            {extraSearchComponent}
            <TextInput
              leftSection={<FiSearch size={"20"} />}
              placeholder={placeholder}
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
              className="min-w-42 max-w-56 lg:min-w-56"
            />
          </>
        )}
        {modalButton}
      </Header.Head>
    </Header>
  );
};
export default MainHeader;

interface MainHeaderI {
  search?: string;
  setSearch?: Dispatch<SetStateAction<string>>;
  modalButton?: React.ReactNode;
  extraSearchComponent?: React.JSX.Element;
  title: string;
  titleOrder?: TitleOrder;
  placeholder?: string;
  withSearch?: boolean;
  className?: string;
  id?: undefined | string;
}
