import api from "./api";

export const registerUser = async (payload) => {
  const { data } = await api.post("/users/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/users/login", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.put("/users/change-password", payload);
  return data;
};
