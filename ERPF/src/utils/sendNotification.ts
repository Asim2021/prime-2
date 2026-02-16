import { notifications } from '@mantine/notifications'
import { ErpError } from '@src/types/apiError';
import { AxiosError } from 'axios'

export const apiErrNotification = (err: AxiosError) => {
  const axiosError = err as AxiosError<ErpError>;
  const apiErrormsg = axiosError.response?.data?.message;
  return notifications.show({
    title: "Error",
    message: apiErrormsg || err?.message,
    color: "red",
  });
};

export const successNotification = (msg:string) => {
  return notifications.show({
    title: "Success",
    message: msg,
    color: 'green',
  });
};

export const failureNotification = (msg:string) => {
  return notifications.show({
    title: "Failure",
    message: msg || 'no message',
    color: 'red',
  });
};
