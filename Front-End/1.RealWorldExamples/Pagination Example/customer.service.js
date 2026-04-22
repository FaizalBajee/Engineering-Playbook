import axios from "axios";

export const getCustomers = async (page, limit) => {
  const response = await axios.get("/api/customers", {
    params: { page, limit }
  });

  return response.data;
};
