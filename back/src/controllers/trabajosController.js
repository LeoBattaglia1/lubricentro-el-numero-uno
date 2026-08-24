import pool from "../config/db.js";
import { registrarServicioTransaccion } from "./historialServiciosController.js";
import { registrarMercaderiaTransaccion } from "./historialMercaderiaController.js";

export const registrarTrabajoCompleto = async (req, res) => {
  console.log("==========================================");
  console.log("🟢 1. INICIANDO REGISTRO DE TRABAJO (DEBUG EXTREMO)");
  console.log("==========================================");
  console.log("📦 REQ.BODY COMPLETO:", JSON.stringify(req.body, null, 2));
  console.log(
    "🚗 auto_id recibido:",
    req.body.auto_id,
    "Tipo:",
    typeof req.body.auto_id,
  );
  console.log(
    "🛠️ servicios_ids recibido:",
    req.body.servicios_ids,
    "Tipo:",
    typeof req.body.servicios_ids,
    "Es Array?",
    Array.isArray(req.body.servicios_ids),
  );
  console.log("📦 mercaderia recibida:", req.body.mercaderia);
  console.log("==========================================");

  const {
    auto_id,
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
  console.log("🔌 Conexión a la base de datos obtenida con éxito.");

  try {
    await connection.beginTransaction();
    console.log("🔄 Transacción iniciada (BEGIN TRANSACTION).");

    // 1. VALIDAR AUTO
    console.log("--- PASO 1: Validando vehículo ---");
    let idAutoFinal = auto_id || null;
    if (!idAutoFinal) {
      console.log("❌ ERROR: auto_id está vacío o null.");
      throw new Error("El ID del vehículo es obligatorio.");
    }

    const [existingAuto] = await connection.query(
      `SELECT id FROM autos WHERE id = ?`,
      [idAutoFinal],
    );
    console.log("🔍 Resultado búsqueda de auto en DB:", existingAuto);

    if (existingAuto.length === 0) {
      console.log(
        `❌ ERROR: El auto con ID ${idAutoFinal} no existe en la base de datos.`,
      );
      throw new Error(
        `El auto con ID ${idAutoFinal} no existe en la base de datos.`,
      );
    }
    console.log("✅ Auto validado correctamente con ID:", idAutoFinal);

    // 2. HISTORIAL DE SERVICIOS
    console.log("--- PASO 2: Procesando Servicios ---");
    const listaServicios = Array.isArray(servicios_ids) ? servicios_ids : [];
    console.log("📋 Lista de servicios procesable:", listaServicios);

    const kmsActuales =
      kilometros_actuales !== undefined && kilometros_actuales !== ""
        ? Number(kilometros_actuales)
        : null;
    const kmsProximo =
      kilometros_proximo_cambio !== undefined &&
      kilometros_proximo_cambio !== ""
        ? Number(kilometros_proximo_cambio)
        : null;
    console.log(
      `📏 Kilómetros -> Actuales: ${kmsActuales}, Próximo: ${kmsProximo}`,
    );

    if (listaServicios.length > 0) {
      console.log(
        `⚙️ Se van a registrar ${listaServicios.length} servicios...`,
      );
      for (let i = 0; i < listaServicios.length; i++) {
        const servicioId = listaServicios[i];
        console.log(
          `➡️ [Servicio #${i + 1}] ID evaluado:`,
          servicioId,
          "Tipo:",
          typeof servicioId,
        );

        const insertId = await registrarServicioTransaccion(
          connection,
          idAutoFinal,
          Number(servicioId),
          kmsActuales,
          kmsProximo,
        );
        console.log(
          `✔️ [Servicio #${i + 1}] Insertado con éxito en historial_servicios, ID generado:`,
          insertId,
        );
      }
    } else {
      console.log(
        "⚠️ ATENCIÓN: La lista de servicios llegó vacía o no es un array.",
      );
    }

    // 3. HISTORIAL DE MERCADERÍA
    console.log("--- PASO 3: Procesando Mercadería ---");
    const listaMercaderia = mercaderia || items_mercaderia || [];
    console.log("📦 Lista de mercadería a procesar:", listaMercaderia);

    if (listaMercaderia.length > 0) {
      for (let i = 0; i < listaMercaderia.length; i++) {
        const item = listaMercaderia[i];
        console.log(`➡️ [Mercadería #${i + 1}] Item recibido:`, item);
        const prodId = item.mercaderia_id || item.id;
        const cantidadItem = Number(item.cantidad) || 1;
        console.log(
          `➡️ [Mercadería #${i + 1}] ID producto: ${prodId}, Cantidad: ${cantidadItem}`,
        );

        if (prodId) {
          const mercId = await registrarMercaderiaTransaccion(
            connection,
            idAutoFinal,
            Number(prodId),
            cantidadItem,
          );
          console.log(
            `✔️ [Mercadería #${i + 1}] Registrada con éxito, ID:`,
            mercId,
          );
        } else {
          console.log(
            `⚠️ [Mercadería #${i + 1}] Item ignorado por falta de ID de producto.`,
          );
        }
      }
    } else {
      console.log("⚠️ No hay mercadería para registrar.");
    }

    // 4. PAGO
    console.log("--- PASO 4: Registrando Pago ---");
    const formaPagoFinal = forma_pago || tipoPago || "efectivo";

    // Verificamos si es un pago pendiente
    const esPendiente = formaPagoFinal.toLowerCase() === "pendiente";

    // Si es pendiente, el cliente_id viene del body (o null si no hay), y montoExtra es el extra calculado. Si no es pendiente, cliente_id y montoExtra van en null/0.
    const clienteIdPago = esPendiente ? req.body.cliente_id || null : null;
    const montoExtraPago = esPendiente ? Number(req.body.montoExtra) || 0 : 0;

    // Si es pendiente, montoTotal va en 0 obligatoriamente. Si no, toma el monto correspondiente.
    const montoTotalPago = esPendiente
      ? 0
      : montoTotal !== undefined && montoTotal !== ""
        ? Number(montoTotal)
        : Number(total_final) || 0;

    console.log(
      `💰 Forma de pago: ${formaPagoFinal}, Cliente ID: ${clienteIdPago}, Monto Extra: ${montoExtraPago}, Monto Total: ${montoTotalPago}`,
    );

    const [pagoResult] = await connection.query(
      `INSERT INTO pagos (cliente_id, montoExtra, montoTotal, tipo_pago, fecha) VALUES (?, ?, ?, ?, CURDATE())`,
      [clienteIdPago, montoExtraPago, montoTotalPago, formaPagoFinal],
    );
    console.log(
      "✔️ Pago registrado con éxito. ID de pago:",
      pagoResult.insertId,
    );

    // COMMIT
    console.log("--- PASO 5: Confirmando Transacción (COMMIT) ---");
    await connection.commit();
    connection.release();
    console.log("🎉 --- TRANSACCIÓN COMPLETADA Y CONFIRMADA CON ÉXITO --- 🎉");

    return res.status(201).json({
      success: true,
      message: "Trabajo registrado con éxito",
    });
  } catch (error) {
    console.error(
      "❌ --- ERROR EN LA TRANSACCIÓN (EJECUTANDO ROLLBACK) --- ❌",
    );
    console.error("Detalle técnico del error:", error);
    await connection.rollback();
    connection.release();
    console.log("🔄 Conexión liberada tras rollback exitoso.");
    return res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
  }
};
