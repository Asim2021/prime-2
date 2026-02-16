import useAuthStore from "@stores/authStore";
import { useEffect } from "react";
import { logoutUser } from "@services/authService";
import { apiErrNotification } from "@utils/sendNotification";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutHandler = async () => {
      await logoutUser()
        .then(() => {
          clearAuth();
          localStorage.clear();
          navigate("/login");
        })
        .catch((err: AxiosError) => {
          apiErrNotification(err);
        });
    };
    logoutHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
export default Logout;
