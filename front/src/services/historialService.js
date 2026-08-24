import api from "./api";

export const getHistorialByAuto = async (autoId) =>
  (await api.get(`/historial/auto/${autoId}`)).data;
export const registrarServicio = async (data) =>
  (await api.post("/historial", data)).data;
