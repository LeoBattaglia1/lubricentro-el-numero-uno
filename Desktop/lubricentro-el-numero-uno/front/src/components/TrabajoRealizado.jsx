const TrabajoRealizado = ({ onVolver }) => {
  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={onVolver}
        style={{ marginBottom: "15px", cursor: "pointer" }}
      >
        ← Volver al Dashboard
      </button>
      <h2>📋 Trabajo Realizado</h2>
      <p>Módulo en construcción...</p>
    </div>
  );
};

export default TrabajoRealizado;
