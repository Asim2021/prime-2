import { Title, TitleOrder } from "@mantine/core";

import styles from "./header.module.css";
import clsx from "clsx";

/* eslint-disable react-refresh/only-export-components */
const AsideButtons = ({ children }: ChildrenI) => {
  return (
    <div data-test-component="header-asides" className={styles.asideButtons}>
      {children}
    </div>
  );
};

const Head = ({ title, children, order = 3 }: ChildrenI) => {
  return (
    <>
      <Title order={order} textWrap="nowrap">
        {title}
      </Title>
      <AsideButtons>{children}</AsideButtons>
    </>
  );
};

const Header = ({ children, id, className }: ChildrenI) => {
  return (
    <header
      data-test-component={`${id ? id : "main"}-header`}
      className={clsx(styles.header, className)}
    >
      {children}
    </header>
  );
};

Header.displayName = "Header";

export default Object.assign(Header, {
  Head,
});

interface ChildrenI {
  children: React.ReactNode;
  className?: string;
  title?: string;
  id?: string;
  order?: TitleOrder;
}
