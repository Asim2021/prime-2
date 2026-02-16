import PageLoader from "@components/PageLoader";
import { ErrorBoundary } from "@components/ErrorBoundary";
import useAuthStore from "@stores/authStore";
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthRouter, MainRouter } from "./routers";
import { getAccessToken } from "./services";
import { QUERY_KEY } from "./constants/queryKeys";

const App = () => {
  const { isLoggedIn, setAuth, clearAuth, loading } = useAuthStore();

  const fetchRefreshToken = useQuery({
    queryKey: [QUERY_KEY.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    retry: false,
  });

  useEffect(() => {
    if (fetchRefreshToken.data && !fetchRefreshToken.isError) {
      setAuth(fetchRefreshToken.data);
    } else if (fetchRefreshToken.isError) {
      clearAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRefreshToken.data, fetchRefreshToken.isError]);

  if (fetchRefreshToken.isLoading || loading) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <RouterProvider router={isLoggedIn ? MainRouter : AuthRouter} />
    </ErrorBoundary>
  );
};

export default App;
