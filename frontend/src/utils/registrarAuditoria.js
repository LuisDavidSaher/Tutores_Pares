export const registrarAccion = async (usuario, modulo, accion, detalle, estado = "Éxito") => {
  try {
    await fetch('http://localhost:8080/api/auditorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, modulo, accion, detalle, estado })
    });
  } catch (error) {
    console.error("Error al registrar auditoría:", error);
  }
};