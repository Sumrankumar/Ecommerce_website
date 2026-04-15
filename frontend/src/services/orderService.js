import api from "./api";

export const createOrder = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my");
  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}`, { status });
  return data;
};

export const payOrder = async (id) => {
  const { data } = await api.post(`/orders/pay/${id}`);
  return data;
};
