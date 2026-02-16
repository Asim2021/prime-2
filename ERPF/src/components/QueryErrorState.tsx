import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import { MdErrorOutline } from "react-icons/md";

interface QueryErrorStateProps {
  title?: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
}

const QueryErrorState = ({
  title = "Failed to load data",
  message = "Something went wrong while fetching data.",
  error,
  onRetry,
}: QueryErrorStateProps) => {
  const errMessage = error instanceof Error ? error.message : undefined;

  return (
    <Alert color="red" title={title} icon={<MdErrorOutline />}>
      <Stack gap="xs">
        <Text size="sm">{message}</Text>
        {errMessage && (
          <Text size="xs" c="dimmed">
            {errMessage}
          </Text>
        )}
        {onRetry && (
          <Group>
            <Button size="xs" variant="light" onClick={onRetry}>
              Retry
            </Button>
          </Group>
        )}
      </Stack>
    </Alert>
  );
};

export default QueryErrorState;
