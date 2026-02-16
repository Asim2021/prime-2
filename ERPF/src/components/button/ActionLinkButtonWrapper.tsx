import { UnstyledButton } from "@mantine/core";
import React, { ReactNode } from "react";
interface ActionButton {
  title?: string;
  actionLinkChildren: ReactNode;
  clickHandler?: () => void;
}

interface ActionLinkButtonWrapperProps {
  actionLinkButtons: ActionButton[];
  children: ReactNode;
}

/**
 * A React component that renders a wrapper with action link buttons and children components.
 *
 * @param {ActionLinkButtonWrapperProps} props - Props include:
 * - `actionLinkButtons` (optional): Array of objects with `title` (string) and `clickHandler` (() => void).
 * - `children`: The React child elements to be rendered.
 *
 * @returns A wrapper component with action link buttons at the top-right corner.
 */
const ActionLinkButtonWrapper: React.FC<ActionLinkButtonWrapperProps> = ({
  actionLinkButtons = [],
  children,
}) => {
  if (!Array.isArray(actionLinkButtons)) {
    console.error(
      'The actionLinkButtons prop must be an array of objects with "title" (string) and "clickHandler" (() => void).'
    );
    return null; // Prevent rendering if props are invalid
  }

  return (
    <div className="relative">
      {actionLinkButtons.length > 0 && (
        <div className="flex absolute top-0 right-0 z-20">
          {actionLinkButtons.map((actionButton) => (
            <div key={actionButton.title}>
              <UnstyledButton onClick={actionButton.clickHandler}>
                {actionButton?.actionLinkChildren || actionButton?.title}
              </UnstyledButton>
            </div>
          ))}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default ActionLinkButtonWrapper;
