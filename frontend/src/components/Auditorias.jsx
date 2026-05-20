import React, { useState, useEffect } from 'react';

const Auditorias = () => {
  const [registrosAuditoria, setRegistrosAuditoria] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // CONEXIÓN AL BACKEND PARA CARGAR LOS REGISTROS DE AUDITORÍA

  const cargarAuditorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:8080/api/auditorias');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setRegistrosAuditoria(datos);
      }
    } catch (error) {
      console.error("Error conectando con el servidor de Auditoría:", error);
    }
  };

  useEffect(() => {
    const iniciarCarga = async () => { await cargarAuditorias(); };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    iniciarCarga();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatearFecha = (fechaISO) => {
    if(!fechaISO) return "";
    const date = new Date(fechaISO);
    return date.toLocaleString('es-CO', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true 
    }).replace(',', '');
  };

  const logsFiltrados = registrosAuditoria.filter(log => {
    const coincideTexto = 
      log.usuario?.toLowerCase().includes(filtroTexto.toLowerCase()) || 
      log.accion?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      log.detalle?.toLowerCase().includes(filtroTexto.toLowerCase());
    
    const coincideTipo = filtroTipo === 'Todos' ? true : log.estado === 'Alerta';
    return coincideTexto && coincideTipo;
  });

  const exportarCSV = () => {
    alert(" Exportando logs reales de la base de datos...");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      <div className="bg-[#1B2631] p-6 text-white border-b-4 border-[#EBB700] rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-wide">Registro de Auditoría y Trazabilidad</h2>
            <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Monitoreo de actividades del sistema en tiempo real</p>
          </div>
          <button onClick={exportarCSV} className="bg-gray-100/10 hover:bg-gray-100/20 text-white border border-gray-500 px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Exportar Log (.CSV)
          </button>
      </div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-100 pb-6 gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setFiltroTipo('Todos')}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${filtroTipo === 'Todos' ? 'bg-[#1B2631] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Todos los eventos
            </button>
            <button 
              onClick={() => setFiltroTipo('Alertas')}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${filtroTipo === 'Alertas' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Solo Alertas
            </button>
          </div>

          <div className="w-full md:w-96 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Buscar por usuario, detalle o acción..." 
              value={filtroTexto} 
              onChange={(e) => setFiltroTexto(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#EBB700] bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#1B2631] text-white text-[10px] uppercase font-black tracking-widest">
                    <tr>
                        <th className="p-4">Fecha y Hora</th>
                        <th className="p-4">Usuario</th>
                        <th className="p-4 w-1/2">Acción / Detalle</th>
                        <th className="p-4 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y">
                    {logsFiltrados.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-xs font-semibold text-gray-500 whitespace-nowrap">
                              {formatearFecha(log.fechaHora)}
                            </td>
                            <td className="p-4">
                              <p className="font-black text-[#1B2631]">{log.usuario}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{log.modulo}</p>
                            </td>
                            <td className="p-4 text-gray-700 font-medium">
                              <span className="font-bold text-[#1B2631] block text-xs mb-1">{log.accion}</span>
                              {log.detalle}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                log.estado === 'Éxito' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                {log.estado}
                              </span>
                            </td>
                        </tr>
                    ))}
                    {logsFiltrados.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-16 text-center text-gray-500 font-medium bg-gray-50">
                            No hay registros de actividad real en la base de datos.
                          </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Auditorias;