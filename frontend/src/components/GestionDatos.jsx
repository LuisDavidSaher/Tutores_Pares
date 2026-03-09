import React, { useState } from 'react';

const GestionDatos = () => {
  const [vistaActual, setVistaActual] = useState('tutores');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('2026-I');
  const [busqueda, setBusqueda] = useState('');

  // Base de datos simulada de Tutores
  const tutores = [
    { id: '1020304050', nombre: 'Juan Carlos Pérez', codigo: '2023-1092', programa: 'Ing. Sistemas', promedio: '4.8', periodo: '2026-I', estado: 'Activo' },
    { id: '1050607080', nombre: 'María Alejandra García', codigo: '2023-1145', programa: 'Arquitectura', promedio: '4.5', periodo: '2026-I', estado: 'Activo' },
    { id: '1088776655', nombre: 'Luis Fernando Gómez', codigo: '2022-0891', programa: 'Medicina', promedio: '4.6', periodo: '2025-II', estado: 'Completado' },
    { id: '1045234890', nombre: 'Carlos Andrés Ruiz', codigo: '2021-0456', programa: 'Derecho', promedio: '4.2', periodo: '2025-I', estado: 'Completado' },
  ];

  // Base de datos simulada de Tutorados
  const tutorados = [
    { id: '1122334455', nombre: 'Ana María Rojas', codigo: '2025-0123', programa: 'Ing. Sistemas', riesgo: 'Bajo Rendimiento', periodo: '2026-I' },
    { id: '1199887766', nombre: 'Pedro Pascal', codigo: '2024-0567', programa: 'Derecho', riesgo: 'Riesgo de Deserción', periodo: '2025-II' },
  ];

  // Lógica de búsqueda y filtro
  const datosMostrados = (vistaActual === 'tutores' ? tutores : tutorados).filter(item => {
    const coincidePeriodo = periodoSeleccionado === 'Todos' || item.periodo === periodoSeleccionado;
    const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase()) || item.id.includes(busqueda);
    return coincidePeriodo && coincideBusqueda;
  });

  // Función que simula la carga del archivo Excel (Sin iconos, como solicitaste)
  const handleImportarExcel = () => {
    alert("Simulando conexión con el servidor...\n\n- Leyendo archivo: 'Historial_Tutores_2024-2025.csv'\n- 1,245 registros antiguos detectados y validados.\n\nEn la versión final, el Backend guardará todos estos datos antiguos en la nueva base de datos sin que tengas que transcribirlos a mano.");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
      
      {/* --- NUEVO: Encabezado Institucional del Módulo --- */}
      <div className="bg-[#1B2631] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Tutores y Tutorados</h2>
          <p className="text-sm text-gray-300 mt-1">Administración centralizada de la base de datos del ciclo activo e histórico.</p>
        </div>
      </div>
      
      {/* Pestañas de navegación interna */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button 
          onClick={() => setVistaActual('tutores')}
          className={`px-6 py-4 text-sm font-semibold transition-colors ${vistaActual === 'tutores' ? 'border-b-2 border-[#1B2631] text-[#1B2631] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Base de Datos: Tutores Pares
        </button>
        <button 
          onClick={() => setVistaActual('tutorados')}
          className={`px-6 py-4 text-sm font-semibold transition-colors ${vistaActual === 'tutorados' ? 'border-b-2 border-[#1B2631] text-[#1B2631] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Base de Datos: Tutorados
        </button>
      </div>

      {/* Barra de Acciones Principales (Migración de Datos) */}
      <div className="p-4 bg-white border-b border-gray-100 flex justify-end space-x-4 shadow-sm relative z-10">
        <button 
          onClick={handleImportarExcel}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>Importar Historial (Excel/CSV)</span>
        </button>
        <button className="flex items-center space-x-2 bg-[#1B2631] hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
          <span>+ Nuevo Registro Manual</span>
        </button>
      </div>

      {/* Controles de Búsqueda y Filtro Histórico */}
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-gray-100 bg-gray-50">
        <div className="relative w-full md:w-1/2">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o número de documento..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2631]"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Periodo:</label>
          <select 
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2631] bg-white text-sm font-medium"
          >
            <option value="2026-I">2026-I (Actual)</option>
            <option value="2025-II">2025-II (Histórico)</option>
            <option value="2025-I">2025-I (Histórico)</option>
            <option value="Todos">Ver Todos</option>
          </select>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 font-medium">Documento</th>
              <th className="p-4 font-medium">Nombre Completo</th>
              <th className="p-4 font-medium">Programa</th>
              {vistaActual === 'tutores' && <th className="p-4 font-medium">Promedio</th>}
              {vistaActual === 'tutorados' && <th className="p-4 font-medium">Riesgo</th>}
              <th className="p-4 font-medium">Ciclo</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
            {datosMostrados.length > 0 ? (
              datosMostrados.map((dato) => (
                <tr key={dato.id} className="hover:bg-gray-50 transition-colors bg-white">
                  <td className="p-4 font-medium">{dato.id}</td>
                  <td className="p-4 text-gray-900">{dato.nombre}</td>
                  <td className="p-4">{dato.programa}</td>
                  {vistaActual === 'tutores' && <td className="p-4 font-bold text-[#1B2631]">{dato.promedio}</td>}
                  {vistaActual === 'tutorados' && <td className="p-4 text-orange-600 text-xs font-semibold">{dato.riesgo}</td>}
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                      {dato.periodo}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      dato.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {dato.estado || 'En proceso'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500 bg-white">
                  No se encontraron registros para esta búsqueda o periodo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionDatos;