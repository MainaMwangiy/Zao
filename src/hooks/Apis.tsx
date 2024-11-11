// hooks/useApi.ts
import axios from "axios";
import { useSnackbar } from "notistack";

type RequestMethod = "GET" | "POST" | "DELETE";

interface ApiOptions {
  method: RequestMethod;
  url: string;
  data?: any;
}

export const useApi = () => {
  const { enqueueSnackbar } = useSnackbar();

  const apiRequest = async ({ method, url, data }: ApiOptions) => {
    try {
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", { variant: "error" });
      throw error;
    }
  };

  return { apiRequest };
};
