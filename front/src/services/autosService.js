import api from "./api";

export const getAutos = async () => (await api.get("/autos")).data;
export const createAuto = async (data) => (await api.post("/autos", data)).data;
export const updateAuto = async (id, data) =>
  (await api.put(`/autos/${id}`, data)).data;
export const deleteAuto = async (id) => (await api.delete(`/autos/${id}`)).data;
