import React, { useState } from 'react';

const Auditorias = () => {
  // Estado para filtrar los registros por tipo
  const [filtro, setFiltro] = useState('Todos');

  // Datos simulados del registro de actividades (Logs)
  const logsAuditoria = [
    { id: 1, fecha: '2026-03-05 08:30 AM', usuario: 'Dr. Carlos Mendoza', rol: 'Jefe Depto.', accion: 'Registró Reporte Inicial - Tutor Par (Carlos Ruiz)', estado: 'Éxito' },
    { id: 2, fecha: '2026-03-05 09:15 AM', usuario: 'Dra. Ana Gómez', rol: 'Bienestar', accion: 'Descargó consolidado de estadísticas', estado: 'Éxito' },
    { id: 3, fecha: '2026-03-05 10:05 AM', usuario: 'Sistema', rol: 'Automático', accion: 'Copia de seguridad de la base de datos', estado: 'Éxito' },
    { id: 4, fecha: '2026-03-04 04:20 PM', usuario: 'Tutor Anónimo', rol: 'Público', accion: 'Intento de descarga de certificado (ID no encontrado)', estado: 'Alerta' },
    { id: 5, fecha: '2026-03-04 02:10 PM', usuario: 'Admin Académico', rol: 'Administrador', accion: 'Actualizó permisos de usuario Dra. Ana Gómez', estado: 'Éxito' },
  ];

  // Lógica sencilla para filtrar la tabla
  const logsFiltrados = filtro === 'Todos' 
    ? logsAuditoria 
    : logsAuditoria.filter(log => log.estado === filtro);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
      
      {/* Encabezado */}
      <div className="bg-[#1B2631] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Registro de Auditoría y Trazabilidad</h2>
          <p className="text-sm text-gray-300 mt-1">Monitoreo de actividades del sistema en tiempo real</p>
        </div>
        <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Exportar Log (.CSV)</span>
        </button>
      </div>

      {/* Controles de Filtro y Búsqueda */}
      <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex space-x-2">
          <button onClick={() => setFiltro('Todos')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filtro === 'Todos' ? 'bg-[#1B2631] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
            Todos los eventos
          </button>
          <button onClick={() => setFiltro('Alerta')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filtro === 'Alerta' ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
            Solo Alertas
          </button>
        </div>
        
        <input 
          type="text" 
          placeholder="Buscar por usuario o acción..." 
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-[#1B2631] text-sm"
        />
      </div>

      {/* Tabla de Auditoría */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium border-b">Fecha y Hora</th>
              <th className="p-4 font-medium border-b">Usuario / Rol</th>
              <th className="p-4 font-medium border-b">Acción Realizada</th>
              <th className="p-4 font-medium border-b text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
            {logsFiltrados.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-xs text-gray-500 whitespace-nowrap">{log.fecha}</td>
                <td className="p-4">
                  <p className="font-semibold text-gray-900">{log.usuario}</p>
                  <p className="text-xs text-gray-500">{log.rol}</p>
                </td>
                <td className="p-4 text-gray-600">{log.accion}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    log.estado === 'Éxito' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {log.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Auditorias;