import { ErrorInfo } from "react";
import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { PiWarningBold } from "react-icons/pi";
import { BiRefresh } from "react-icons/bi";

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset?: () => void;
}

/**
 * Fallback UI displayed when ErrorBoundary catches an error
 * Provides user-friendly error message and recovery options
 */
const ErrorFallback = ({ error, errorInfo, onReset }: ErrorFallbackProps) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  // Check if in development mode in Vite
  const isDev = import.meta.env.DEV;

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Stack align="center" gap="lg">
          <PiWarningBold size={64} color="var(--mantine-color-red-6)" />

          <Title order={2} ta="center">
            Oops! Something went wrong
          </Title>

          <Text c="dimmed" ta="center" maw={400}>
            We're sorry, but an unexpected error occurred. Our team has been
            notified and is working to fix the issue.
          </Text>

          {isDev && error && (
            <Paper bg="red.0" p="md" radius="sm" w="100%">
              <Text c="red.9" size="sm" fw={600} mb="xs">
                Error Details (Development Only):
              </Text>
              <Text c="red.7" size="xs" style={{ fontFamily: "monospace" }}>
                {error.message}
              </Text>
              {errorInfo?.componentStack && (
                <Text
                  c="red.6"
                  size="xs"
                  mt="xs"
                  style={{
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  {errorInfo.componentStack}
                </Text>
              )}
            </Paper>
          )}

          <Stack gap="sm" w="100%">
            <Button
              leftSection={<BiRefresh size={18} />}
              onClick={onReset || handleReload}
              fullWidth
              size="md"
            >
              Try Again
            </Button>

            <Button variant="light" onClick={handleGoHome} fullWidth size="md">
              Go to Home
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ErrorFallback;
