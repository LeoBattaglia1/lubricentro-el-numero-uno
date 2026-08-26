import pool from "../config/db.js";
import { registrarServicioTransaccion } from "./historialServiciosController.js";
import { registrarMercaderiaTransaccion } from "./historialMercaderiaController.js";

export const registrarTrabajoCompleto = async (req, res) => {
  console.log("==========================================");
  console.log(
    "🟢 1. INICIANDO REGISTRO DE TRABAJO (PAGOS PENDIENTES / GENERAL)",
  );
  console.log("==========================================");
  console.log("📦 REQ.BODY COMPLETO:", JSON.stringify(req.body, null, 2));

  const {
    auto_id,
    cliente_id,
    kilometros_actuales,
    kilometros_proximo_cambio,
    servicios_ids,
    mercaderia,
    items_mercaderia,
    forma_pago,
    tipoPago,
    total_final,
    montoTotal,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. VALIDAR AUTO (Opcional si es particular o no se envía)
    let idAutoFinal = auto_id ? Number(auto_id) : null;
    let idClienteFinal = cliente_id ? Number(cliente_id) : null;

    if (idAutoFinal) {
      const [existingAuto] = await connection.query(
        `SELECT id FROM autos WHERE id = ?`,
        [idAutoFinal],
      );

      if (existingAuto.length === 0) {
        throw new Error(
          `El auto con ID ${idAutoFinal} no existe en la base de datos.`,
        );
      }
    }

    // 2. HISTORIAL DE SERVICIOS
    const listaServicios = Array.isArray(servicios_ids) ? servicios_ids : [];
    const kmsActuales =
      kilometros_actuales !== undefined && kilometros_actuales !== ""
        ? Number(kilometros_actuales)
        : null;
    const kmsProximo =
      kilometros_proximo_cambio !== undefined &&
      kilometros_proximo_cambio !== ""
        ? Number(kilometros_proximo_cambio)
        : null;

    // Se procesa si hay un auto o un cliente y una lista de servicios válida
    if (
      (idAutoFinal !== null || idClienteFinal !== null) &&
      listaServicios.length > 0
    ) {
      for (let i = 0; i < listaServicios.length; i++) {
        const servicioId = listaServicios[i];
        await registrarServicioTransaccion(
          connection,
          idAutoFinal,
          Number(servicioId),
          kmsActuales,
          kmsProximo,
          idClienteFinal, // <--- Se pasa el cliente_id
        );
      }
    }

    // 3. HISTORIAL DE MERCADERÍA
    const listaMercaderia = mercaderia || items_mercaderia || [];

    if (
      (idAutoFinal !== null || idClienteFinal !== null) &&
      listaMercaderia.length > 0
    ) {
      for (let i = 0; i < listaMercaderia.length; i++) {
        const item = listaMercaderia[i];
        const prodId = item.mercaderia_id || item.id;
        const cantidadItem = Number(item.cantidad) || 1;

        if (prodId) {
          await registrarMercaderiaTransaccion(
            connection,
            idAutoFinal,
            Number(prodId),
            cantidadItem,
            idClienteFinal, // <--- Se pasa el cliente_id
          );
        }
      }
    }

    // 4. PAGO
    const formaPagoFinal = forma_pago || tipoPago || "efectivo";
    const esPendiente = formaPagoFinal.toLowerCase() === "pendiente";

    const clienteIdPago = esPendiente ? idClienteFinal : null;
    const montoExtraPago = esPendiente ? Number(req.body.montoExtra) || 0 : 0;
    const montoTotalPago = esPendiente
      ? 0
      : montoTotal !== undefined && montoTotal !== ""
        ? Number(montoTotal)
        : Number(total_final) || 0;

    const [pagoResult] = await connection.query(
      `INSERT INTO pagos (cliente_id, montoExtra, montoTotal, tipo_pago, fecha) VALUES (?, ?, ?, ?, CURDATE())`,
      [clienteIdPago, montoExtraPago, montoTotalPago, formaPagoFinal],
    );

    // COMMIT
    await connection.commit();
    connection.release();

    return res.status(201).json({
      success: true,
      message: "Trabajo registrado con éxito",
    });
  } catch (error) {
    console.error("❌ Error en la transacción (Rollback ejecutado):", error);
    await connection.rollback();
    connection.release();
    return res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
  }
};
