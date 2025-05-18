import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

// Define the type for request options, including the method and optional body and headers
type RequestOptions = Omit<AxiosRequestConfig, "data"> & {
  body?: FormData | unknown;
  headers?: {
    [n: string]: string | number;
  };
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
};

// Set default Axios configuration
axios.defaults.withCredentials = true;

// Function to make API requests using Axios
async function axioBaseApi(url: string, options: RequestOptions) {
  let headers: { [n: string]: any } = {
    "Content-Type": "application/json",
    // 'Access-Control-Allow-Credentials': true,
    // "Origin": "http://localhost:3001",
  };

  // Retrieve JWT token from sessionStorage (or localStorage if you prefer)
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Merge default headers with any provided headers
  if (options.headers) {
    headers = { ...headers, ...options.headers };
  }

  try {
    const response = await axios.request({
      url: `/api${url}`,
      method: options.method,
      headers: headers,
      data: options.body,
      withCredentials: true,
      params: options.params,
    });
    return { ...response.data, responseStatus: response.status };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      // console.error('An Axios error occurred:', axiosError);
      // Handle Axios error
      // throw axiosError; // Re-throw the error if necessary
      if (axiosError.response?.status === 401) {
        window.location.href = "/login";
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }
      return {
        responseStatus: axiosError.response?.status,
        data: axiosError.response?.data,
      };
    } else {
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred"); // Throw a generic error for unexpected cases
    }
  }
}

// Export the axioBaseApi function for use in queries
export default axioBaseApi;

// Create a QueryClient instance with default options for queries
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Define a query function that uses axioBaseApi to make requests
      queryFn: async ({ queryKey }) => {
        // Assuming queryKey is an array where the first element is the URL and the second is options
        const [url, options] = queryKey;
        return await axioBaseApi(url as string, options as RequestOptions);
      },

      // Configure staleTime to control caching behavior
      staleTime: Infinity,
    },
  },
});
