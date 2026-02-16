import './index.css'
import '@mantine/core/styles.css'
import "@mantine/notifications/styles.css";
import '@mantine/dates/styles.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from "@mantine/notifications";

import App from './App.tsx'
import theme, { resolver } from './theme.tsx'
import { ErrorBoundary } from '@components/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60_000, // 5 minutes fresh

    },
  },
});
const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} cssVariablesResolver={resolver} >
        <Notifications autoClose={4000} position='top-right'/>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
