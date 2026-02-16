import { ErpError } from "@src/types/apiError";
import axios, { AxiosError } from "axios";

const handleAxiosError = (err : AxiosError) => {
  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError<ErpError>;

    if (axiosError.response) {
      const apiErrorObj = axiosError.response.data;
      console.error('API error:', apiErrorObj?.message);
    } else {
      console.error('Error:', axiosError.message);
    }
  } else {
    console.error('Unexpected error:', err);
  }
};

export default handleAxiosError
