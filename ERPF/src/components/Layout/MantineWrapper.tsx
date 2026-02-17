import useAuthStore from '@stores/authStore'
import { Outlet } from 'react-router-dom'

const MantineWrapper = () => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return;
  }

  return <Outlet />;
};

export default MantineWrapper;
