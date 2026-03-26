import React, { useState } from 'react';

// --- MOCK DATA PARA LA BASE DE DATOS MAESTRA ---
const mockTutores = [
  { id: 1, documento: '123456789', nombres: 'JESUS DAVID', apellidos: 'BARRIOS MARTINEZ', programa: 'INGENIERÍA DE SISTEMAS', periodo: '2026-I', asignaturas: 'FÍSICA, CÁLCULO', estado: 'ACTIVO' },
  { id: 2, documento: '987654321', nombres: 'CARLOS ANDRES', apellidos: 'RUIZ', programa: 'MEDICINA', periodo: '2025-II', asignaturas: 'MORFOLOGÍA', estado: 'INACTIVO' },
  { id: 3, documento: '112233445', nombres: 'MARIA PAULA', apellidos: 'PEREZ', programa: 'DERECHO', periodo: '2026-I', asignaturas: 'DERECHO CIVIL', estado: 'ACTIVO' },
];

const mockTutorados = [
  { id: 1, documento: '445566778', nombres: 'LUIS FERNANDO', apellidos: 'GOMEZ', programa: 'INGENIERÍA DE SISTEMAS', periodo: '2026-I', riesgo: 'ALTO', promedio: '2.5' },
  { id: 2, documento: '556677889', nombres: 'ANA SOFIA', apellidos: 'MARTINEZ', programa: 'MEDICINA', periodo: '2025-II', riesgo: 'BAJO', promedio: '3.8' },
  { id: 3, documento: '998877665', nombres: 'PEDRO', apellidos: 'PASCAL', programa: 'INGENIERÍA DE SISTEMAS', periodo: '2026-I', riesgo: 'ALTO', promedio: '2.8' },
];

const GestionDatos = () => {
  const [pestaña, setPestaña] = useState('tutores'); 
  
  // Filtros Generales
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrograma, setFiltroPrograma] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');

  // Ordenamiento
  const [ordenCampo, setOrdenCampo] = useState('nombres');
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Extraer listas únicas
  const programasUnicos = [...new Set([...mockTutores, ...mockTutorados].map(item => item.programa))];
  const periodosUnicos = [...new Set([...mockTutores, ...mockTutorados].map(item => item.periodo))];

  // Lógica de Filtro y Ordenamiento
  const procesarDatos = (datos) => {
    return datos
      .filter(item => 
        (item.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
         item.apellidos.toLowerCase().includes(busqueda.toLowerCase()) || 
         item.documento.includes(busqueda)) &&
        (filtroPrograma === '' || item.programa === filtroPrograma) &&
        (filtroPeriodo === '' || item.periodo === filtroPeriodo)
      )
      .sort((a, b) => {
        if (a[ordenCampo] < b[ordenCampo]) return ordenAsc ? -1 : 1;
        if (a[ordenCampo] > b[ordenCampo]) return ordenAsc ? 1 : -1;
        return 0;
      });
  };

  const handleOrden = (campo) => {
    if (ordenCampo === campo) setOrdenAsc(!ordenAsc);
    else { setOrdenCampo(campo); setOrdenAsc(true); }
  };

  const renderIconoOrden = (campo) => {
    if (ordenCampo !== campo) return <span className="text-gray-400 ml-2 text-xs">↕</span>;
    return <span className="text-[#EBB700] ml-2 font-black text-xs">{ordenAsc ? '↑' : '↓'}</span>;
  };

  const datosFiltrados = procesarDatos(pestaña === 'tutores' ? mockTutores : mockTutorados);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-[#1a232f] p-6 text-white border-b-4 border-[#EBB700]">
        <h2 className="text-2xl font-bold tracking-wide">Gestión Central de Datos</h2>
        <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Base de Datos Maestra: Tutores y Tutorados</p>
      </div>

      {/* PESTAÑAS */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button onClick={() => setPestaña('tutores')} className={`w-1/2 py-4 text-sm font-bold uppercase tracking-wider transition-all ${pestaña === 'tutores' ? 'border-b-4 border-[#1B2631] text-[#1B2631] bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
          Base de Datos: Tutores Pares
        </button>
        <button onClick={() => setPestaña('tutorados')} className={`w-1/2 py-4 text-sm font-bold uppercase tracking-wider transition-all ${pestaña === 'tutorados' ? 'border-b-4 border-[#1B2631] text-[#1B2631] bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
          Base de Datos: Tutorados
        </button>
      </div>

      <div className="p-8">
        
        {/* FILTROS AVANZADOS */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Buscar (Doc, Nombres, Apellidos)</label>
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Escriba para buscar..." className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#1B2631]" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Filtrar por Programa</label>
            <select value={filtroPrograma} onChange={(e) => setFiltroPrograma(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none bg-white">
              <option value="">TODOS LOS PROGRAMAS</option>
              {programasUnicos.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Filtrar por Periodo</label>
            <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none bg-white">
              <option value="">TODOS LOS PERIODOS</option>
              {periodosUnicos.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* TABLA DE DATOS MAESTRA */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold select-none">
              <tr>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('documento')}>
                  <div className="flex items-center">Documento {renderIconoOrden('documento')}</div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('nombres')}>
                  <div className="flex items-center">Nombres {renderIconoOrden('nombres')}</div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('apellidos')}>
                  <div className="flex items-center">Apellidos {renderIconoOrden('apellidos')}</div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('programa')}>
                  <div className="flex items-center">Programa {renderIconoOrden('programa')}</div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('periodo')}>
                  <div className="flex items-center">Periodo {renderIconoOrden('periodo')}</div>
                </th>
                
                {/* Columnas Dinámicas */}
                {pestaña === 'tutores' ? (
                  <>
                    <th className="p-4">Asignaturas Dadas</th>
                    <th className="p-4">Estado</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('riesgo')}>
                      <div className="flex items-center">Riesgo {renderIconoOrden('riesgo')}</div>
                    </th>
                    <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('promedio')}>
                      <div className="flex items-center">Promedio {renderIconoOrden('promedio')}</div>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="text-sm divide-y bg-white">
              {datosFiltrados.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No se encontraron registros con los filtros actuales.</td></tr>
              ) : (
                datosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-700">{item.documento}</td>
                    <td className="p-4 font-bold text-[#1B2631]">{item.nombres}</td>
                    <td className="p-4 font-bold text-[#1B2631]">{item.apellidos}</td>
                    <td className="p-4 text-xs text-gray-600">{item.programa}</td>
                    <td className="p-4 font-medium text-gray-600">{item.periodo}</td>
                    
                    {pestaña === 'tutores' ? (
                      <>
                        <td className="p-4 text-xs font-semibold text-gray-700">{item.asignaturas}</td>
                        <td className="p-4"><span className={`px-2 py-1 text-[10px] rounded-full font-bold ${item.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.estado}</span></td>
                      </>
                    ) : (
                      <>
                        <td className="p-4"><span className={`px-2 py-1 text-[10px] rounded font-bold ${item.riesgo === 'ALTO' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{item.riesgo}</span></td>
                        <td className="p-4 font-bold text-[#1B2631]">{item.promedio}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default GestionDatos;