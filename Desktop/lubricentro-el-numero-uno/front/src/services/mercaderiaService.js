import api from "./api";

export const getMercaderia = async () => {
  const response = await api.get("/mercaderia");
  return response.data;
};

export const createMercaderia = async (data) => {
  const response = await api.post("/mercaderia", data);
  return response.data;
};

export const updateMercaderia = async (id, data) => {
  const response = await api.put(`/mercaderia/${id}`, data);
  return response.data;
};

export const deleteMercaderia = async (id) => {
  const response = await api.delete(`/mercaderia/${id}`);
  return response.data;
};
