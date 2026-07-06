import React, { useState, useEffect, useRef } from 'react';

const GestionDatos = () => {
  const [pestaña, setPestaña] = useState('tutores'); 
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  
  const fileInputRef = useRef(null);

  // Filtros Generales
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrograma, setFiltroPrograma] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');

  // Ordenamiento y Paginación
  const [ordenCampo, setOrdenCampo] = useState('nombres');
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // CONEXIÓN AL BACKEND: OBTENER DATOS
  const cargarDatosMaestros = async () => {
    setCargando(true);
    try {
      const endpoint = pestaña === 'tutores' ? 'tutores' : 'tutorados';
      const respuesta = await fetch(`http://localhost:8080/api/datos/${endpoint}`);
      
      if (respuesta.ok) {
        const resultado = await respuesta.json();
        setDatos(resultado);
      } else {
        console.error("Error al obtener datos del servidor");
        setDatos([]);
      }
    } catch (error) {
      console.error("Fallo de conexión con el Backend:", error);
      setDatos([]);
    } finally {
      setCargando(false);
    }
  };

  // CONEXIÓN AL BACKEND: CARGA MASIVA EXCEL
  const handleSubirArchivo = async (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    if (!archivo.name.endsWith('.xlsx') && !archivo.name.endsWith('.xls')) {
      alert('Por favor, seleccione un archivo Excel válido (.xlsx o .xls)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSubiendoArchivo(true);
    const formData = new FormData();
    formData.append('file', archivo);

    try {
      const respuesta = await fetch('http://localhost:8080/api/dataloader/upload', {
        method: 'POST',
        body: formData,
      });

      if (respuesta.ok) {
        alert('Archivo histórico procesado y guardado en la base de datos con éxito.');
        cargarDatosMaestros(); 
      } else {
        alert('Hubo un error al procesar el archivo en el servidor. Revise el formato.');
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error de conexión al intentar comunicarse con el servidor.');
    } finally {
      setSubiendoArchivo(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  useEffect(() => {
    cargarDatosMaestros();
    setPaginaActual(1);
  }, [pestaña]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroPrograma, filtroPeriodo]);

  // 🛡️ EXTRACCIÓN SEGURA DE LISTAS ÚNICAS (Sin errores de "trim on undefined")
  const programasUnicos = [...new Set(datos.map(item => (item.programa || '').toUpperCase().trim()))]
    .filter(p => p && p !== 'N/A' && p !== 'GENERAL' && p !== '0' && !p.includes('IDENTIFICACI'))
    .sort((a, b) => a.localeCompare(b));

  // 🛡️ DESGLOSE DE PERIODOS CONSOLIDADOS (Ej: "2024-2, 2025-1" se dividen en dos opciones)
  const periodosUnicos = [...new Set(datos.flatMap(item => (item.periodo || '').split(',').map(p => p.trim().toUpperCase())))]
    .filter(p => p && p !== '0' && p !== '6' && !p.includes('IDENTIFICACI') && !p.includes('INDEFINIDO'))
    .sort((a, b) => b.localeCompare(a)); 

  // 🛡️ PROCESAMIENTO Y FILTRADO BLINDADO
  const procesarDatos = (lista) => {
    return lista
      .filter(item => {
        const coincideBusqueda = (item.nombres || '').toLowerCase().includes(busqueda.toLowerCase()) || 
                                 (item.apellidos || '').toLowerCase().includes(busqueda.toLowerCase()) || 
                                 (item.documento || '').includes(busqueda);
        
        const coincidePrograma = filtroPrograma === '' || (item.programa || '').toUpperCase().trim() === filtroPrograma;
        const coincidePeriodo = filtroPeriodo === '' || (item.periodo || '').toUpperCase().includes(filtroPeriodo);
        
        return coincideBusqueda && coincidePrograma && coincidePeriodo;
      })
      .sort((a, b) => {
        const valA = a[ordenCampo] || '';
        const valB = b[ordenCampo] || '';
        if (valA < valB) return ordenAsc ? -1 : 1;
        if (valA > valB) return ordenAsc ? 1 : -1;
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

  // 🛡️ DISEÑO DINÁMICO DEL BADGE DE RIESGO
  const renderRiesgoBadge = (riesgoStr) => {
    const r = (riesgoStr || '').toUpperCase();
    if (r.includes('ALTO') || r.includes('CONDICIONAL')) {
        return <span className="px-2 py-1 text-[10px] rounded font-bold bg-red-50 text-red-700 border border-red-200">{r}</span>;
    }
    if (r.includes('BAJO') || r.includes('RENDIMIENTO')) {
        return <span className="px-2 py-1 text-[10px] rounded font-bold bg-green-50 text-green-700 border border-green-200">{r}</span>;
    }
    // Casos neutros ("PRIMER SEMESTRE", "N/A", vacío)
    return <span className="px-2 py-1 text-[10px] rounded font-bold bg-gray-100 text-gray-600 border border-gray-200">{r || 'NO REGISTRADO'}</span>;
  };

  const datosFiltrados = procesarDatos(datos);
  const totalPaginas = Math.ceil(datosFiltrados.length / itemsPorPagina) || 1;
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = datosFiltrados.slice(indicePrimerItem, indiceUltimoItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      {/* HEADER CON BOTÓN DE CARGA */}
      <div className="bg-[#1a232f] p-6 text-white border-b-4 border-[#EBB700] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Gestión Central de Datos</h2>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Base de Datos Maestra: Tutores y Tutorados</p>
        </div>
        <div>
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} className="hidden" onChange={handleSubirArchivo} />
          <button onClick={() => fileInputRef.current.click()} disabled={subiendoArchivo} className={`bg-[#EBB700] text-[#1B2631] px-5 py-2.5 rounded-lg font-bold transition-all text-sm shadow-sm flex items-center ${subiendoArchivo ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-500'}`}>
            {subiendoArchivo ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1B2631] mr-2"></div> Procesando Excel...</>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Carga Masiva Histórica</>
            )}
          </button>
        </div>
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

        {/* TABLA DE DATOS Y PAGINACIÓN */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
          {cargando && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2631]"></div>
             </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold select-none">
              <tr>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('documento')}><div className="flex items-center">Documento {renderIconoOrden('documento')}</div></th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('nombres')}><div className="flex items-center">Nombres {renderIconoOrden('nombres')}</div></th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('apellidos')}><div className="flex items-center">Apellidos {renderIconoOrden('apellidos')}</div></th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('programa')}><div className="flex items-center">Programa {renderIconoOrden('programa')}</div></th>
                <th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('periodo')}><div className="flex items-center">Periodo {renderIconoOrden('periodo')}</div></th>
                
                {pestaña === 'tutores' ? (
                  <><th className="p-4">Asignaturas</th><th className="p-4">Estado</th></>
                ) : (
                  <><th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('riesgo')}><div className="flex items-center">Riesgo {renderIconoOrden('riesgo')}</div></th><th className="p-4 cursor-pointer hover:bg-gray-800 transition" onClick={() => handleOrden('promedio')}><div className="flex items-center">Promedio {renderIconoOrden('promedio')}</div></th></>
                )}
              </tr>
            </thead>
            <tbody className="text-sm divide-y bg-white">
              {itemsActuales.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No se encontraron registros en la base de datos.</td></tr>
              ) : (
                itemsActuales.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-700">{item.documento}</td>
                    <td className="p-4 font-medium text-gray-800 capitalize">{item.nombres?.toLowerCase()}</td>
                    <td className="p-4 font-medium text-gray-800 capitalize">{item.apellidos?.toLowerCase()}</td>
                    <td className="p-4 text-xs text-gray-600">{item.programa}</td>
                    <td className="p-4 font-medium text-gray-600">{item.periodo}</td>
                    
                    {pestaña === 'tutores' ? (
                      <>
                        <td className="p-4 text-xs font-semibold text-gray-700">{item.asignaturas}</td>
                        <td className="p-4"><span className={`px-2 py-1 text-[10px] rounded-full font-bold ${item.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.estado || 'ACTIVO'}</span></td>
                      </>
                    ) : (
                      <>
                        <td className="p-4">{renderRiesgoBadge(item.riesgo)}</td>
                        <td className="p-4 font-bold text-[#1B2631]">{item.promedio}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* CONTROLES DE PAGINACIÓN */}
          {datosFiltrados.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Mostrando {indicePrimerItem + 1} - {Math.min(indiceUltimoItem, datosFiltrados.length)} de {datosFiltrados.length} registros
              </span>
              <div className="flex space-x-2">
                <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} className="px-4 py-2 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  ANTERIOR
                </button>
                <span className="px-4 py-2 text-xs font-bold text-gray-700">Pág. {paginaActual} / {totalPaginas}</span>
                <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas} className="px-4 py-2 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  SIGUIENTE
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GestionDatos;