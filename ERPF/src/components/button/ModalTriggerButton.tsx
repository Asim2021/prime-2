import React from "react";
import { ActionIcon, Button, UnstyledButton } from "@mantine/core";
import clsx from "clsx";

export type ActionButtonT = "button" | "icon" | "text" | "menu-item";

const ModalTriggerButton = ({
  type = "button",
  title,
  onClick = () => {},
  children,
  leftSection,
  rightSection,
  triggerModalFn,
  withShadow = false,
  loading = false,
  buttonStyle,
  buttonClassName,
}: ModalTriggerButtonI) => {
  const onClickHandler = () => {
    onClick();
    triggerModalFn();
  };

  switch (type) {
    case "icon":
      return (
        <ActionIcon
          aria-label={title}
          title={title}
          onClick={onClickHandler}
          radius={"100%"}
          variant="light"
          className={clsx(buttonClassName, withShadow && "shadow-erp-shadow")}
          loading={loading}
          style={buttonStyle}
        >
          {children}
        </ActionIcon>
      );
    case "text":
      return (
        <UnstyledButton
          aria-label={title}
          title={title}
          onClick={onClickHandler}
          style={buttonStyle}
          className={buttonClassName}
        >
          {children}
        </UnstyledButton>
      );

    default:
      return (
        <Button
          leftSection={leftSection}
          rightSection={rightSection}
          onClick={onClickHandler}
          title={title}
          aria-label={title}
          loading={loading}
          style={buttonStyle}
          className={clsx("min-w-min", buttonClassName)}
        >
          {children}
        </Button>
      );
  }
};
export default ModalTriggerButton;

interface ModalTriggerButtonI {
  triggerModalFn: () => void;
  title: string;
  type?: ActionButtonT;
  onClick?: () => void;
  children: React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  withShadow?: boolean;
  loading?: boolean;
  buttonStyle?: React.CSSProperties | undefined;
  buttonClassName?: string | undefined;
}
