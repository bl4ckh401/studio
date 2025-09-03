import axios from "axios";
import { API_BASE_URL } from "./endpoints";

const restClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Get request to the API
  get: async <T>(
    endpoint: string,
    params = {},
    options: any = {}
  ): Promise<T> => {
    const response = await restClient.get(endpoint, {
      params,
      headers: {
        Authorization: `Bearer ${options.token}`,
      },
    });
    return response.data;
  },
  // Post request to the API
  post: async <T>(endpoint: string, data: any, options = {}): Promise<T> => {
    const response = await restClient.post(endpoint, data, options);
    return response.data;
  },

  // Patch request to the API
  patch: async <T>(endpoint: string, data: any, options = {}): Promise<T> => {
    const response = await restClient.patch(endpoint, data, options);
    return response.data;
  },

  // Put request to the API
  put: async <T>(endpoint: string, data: any, options = {}): Promise<T> => {
    const response = await restClient.put(endpoint, data, options);
    return response.data;
  },

  // Delete request to the API
  delete: async <T>(endpoint: string, options = {}): Promise<T> => {
    const response = await restClient.delete(endpoint, options);
    return response.data;
  },
};
