import api from "./api";

export const getTurnos = async () => (await api.get("/turnos")).data;
export const createTurno = async (data) =>
  (await api.post("/turnos", data)).data;
export const deleteTurno = async (id) =>
  (await api.delete(`/turnos/${id}`)).data;
