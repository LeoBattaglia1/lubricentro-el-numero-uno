import mysqldump from "mysqldump";
import path from "path";
import fs from "fs";

// Función para generar el archivo .sql
export const generarRespaldoSQL = async (rutaDestino) => {
  try {
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

    await mysqldump({
      connection: dbConfig,
      dumpToFile: rutaDestino,
    });

    return { success: true, path: rutaDestino };
  } catch (error) {
    console.error("Error al generar el respaldo:", error);
    return { success: false, error: error.message };
  }
};
