import clsx from "clsx";
import React from "react";
import { MdSearch } from "react-icons/md";

interface NoDataFoundI {
  description?: string;
  children?: React.ReactElement;
  className?: string;
  size?: number;
}

const NoDataFound = ({
  description = "No Data Found",
  children = <></>,
  className = "",
  size = 48,
}: NoDataFoundI) => {
  const rem = (size: number) => `${size/16}rem`;
  return (
    <span className={clsx(className, "flex justify-center w-full pt-10")}>
      <span className="flex flex-col items-center justify-center gap-2 text-center !text-greyDark w-52">
        <span className="flex items-center justify-center w-24 h-24 rounded-full bg-darkLight">
          <MdSearch className="text-gray-500" size={rem(size)} />
        </span>
        <span className="text-lg font-base text-bright text-nowrap">
          {description}
        </span>
        {children}
      </span>
    </span>
  );
};

export default NoDataFound;
