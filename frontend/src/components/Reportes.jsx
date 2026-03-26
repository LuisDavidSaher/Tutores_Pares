import React, { useState } from 'react';

// ==========================================
// FUNCIONES SEGURAS DE CARGA
// ==========================================
const safeLoadCatalog = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.length > 0) return parsed.map(item => item.nombre);
    }
    return [];
  } catch (error) {
    console.error("Aviso: Memoria local inaccesible", error);
    return [];
  }
};

const safeLoadAsignaturas = () => {
  try {
    const data = localStorage.getItem('sgtp_asignaturas');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.length > 0) return parsed.map(item => `${item.codigo} - ${item.nombre}`);
    }
    return [];
  } catch (error) {
    console.error("Aviso: Memoria local inaccesible", error);
    return [];
  }
};

const mockReportesActivos = [
  { id: 'REP-001', periodo: '2026-I', estado: 'Inicial', tutorias: [] },
  { id: 'REP-002', periodo: '2025-II', estado: 'Final', tutorias: [] }
];

const datosInicialesBD = {
  "123456789": { 
    nombres: "JESUS DAVID", apellidos: "BARRIOS MARTINEZ", genero: "M", correo: "JBARRIOSM@UNICARTAGENA.EDU.CO",
    codigo: "2024001", telefono: "3001234567", programa: "INGENIERÍA DE SISTEMAS", sede: "SAN AGUSTÍN", facultad: "INGENIERÍA", tipoDoc: "CC"
  }
};

const limpiarTexto = (texto) => texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\s]/g, "");

const prevenirComa = (eventoTeclado) => {
  if (eventoTeclado.key === ',') eventoTeclado.preventDefault();
};

const Reportes = () => {
  const [vistaActual, setVistaActual] = useState('pantalla1');
  const [listaReportes, setListaReportes] = useState(mockReportesActivos);
  const [dbEstudiantes] = useState(datosInicialesBD);
  const [tutoriasBorrador, setTutoriasBorrador] = useState([]); 

  const [filtroReportes, setFiltroReportes] = useState('');
  const [filtroTutorias, setFiltroTutorias] = useState('');

  // --- CATÁLOGOS ---
  const [catalogoFacultades, setCatalogoFacultades] = useState([]);
  const [catalogoSedes, setCatalogoSedes] = useState([]);
  const [catalogoProgramas, setCatalogoProgramas] = useState([]);
  const [catalogoAsignaturas, setCatalogoAsignaturas] = useState([]);

  // --- ESTADOS: FASE 1 (CREACIÓN) ---
  const [formAsignatura, setFormAsignatura] = useState('');
  const [formPeriodo, setFormPeriodo] = useState('2026-I'); 
  
  const [tutorDoc, setTutorDoc] = useState('');
  const [tutorBloqueado, setTutorBloqueado] = useState(false);
  const [tutorConfirmado, setTutorConfirmado] = useState(false);
  
  const [tutorDatos, setTutorDatos] = useState({
    nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '', 
    codigo: '', sede: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: 'CC'
  });

  const [tutorados, setTutorados] = useState([]);
  const [tutoradoDraft, setTutoradoDraft] = useState({
    documento: '', nombres: '', apellidos: '', genero: '', facultad: '', programa: '', 
    codigo: '', sede: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: 'CC'
  });

  // --- ESTADOS: FASE 2 (REPORTE FINAL) ---
  const [reporteACompletar, setReporteACompletar] = useState(null);
  const [filtroTutorFase2, setFiltroTutorFase2] = useState('');
  const [tutoriasExpandidasFase2, setTutoriasExpandidasFase2] = useState([]);

  // --- ESTADOS: EDICIÓN INLINE (PANTALLA 2) ---
  const [tutoriaExpandida, setTutoriaExpandida] = useState(null);
  const [tutoradoEnEdicion, setTutoradoEnEdicion] = useState(null); 
  const [datosEdicion, setDatosEdicion] = useState({});

  // ==========================================
  // FUNCIONES DE NAVEGACIÓN Y CARGA
  // ==========================================
  const cargarCatalogosDinamicamente = () => {
    setCatalogoFacultades(safeLoadCatalog('sgtp_facultades'));
    setCatalogoSedes(safeLoadCatalog('sgtp_sedes'));
    setCatalogoProgramas(safeLoadCatalog('sgtp_programas'));
    setCatalogoAsignaturas(safeLoadAsignaturas());
  };

  const volverAListado = () => { setVistaActual('pantalla1'); setFiltroReportes(''); };
  
  const irAPantalla2 = () => { 
    cargarCatalogosDinamicamente();
    setVistaActual('pantalla2'); setFiltroTutorias(''); 
  };
  
  const irAPantalla3 = () => { 
    cargarCatalogosDinamicamente();
    setVistaActual('pantalla3'); 
  };

  const iniciarFase2 = (reporte) => {
    if(!reporte.tutorias || reporte.tutorias.length === 0) {
        alert("Este reporte no tiene tutorías agrupadas para finalizar."); return;
    }
    setReporteACompletar(reporte);
    setFiltroTutorFase2(''); 
    setTutoriasExpandidasFase2([]); 
    setVistaActual('pantalla4');
  };

  const simularDescargaPDF = (idReporte = "Borrador") => {
    alert(`📄 Generando PDF para el reporte [${idReporte}]...\n\n[El archivo SGTP_Reporte_${idReporte}.pdf se ha descargado.]`);
  };

  const toggleExpandirTutoriaFase2 = (id) => {
    if (tutoriasExpandidasFase2.includes(id)) {
      setTutoriasExpandidasFase2(tutoriasExpandidasFase2.filter(tId => tId !== id));
    } else {
      setTutoriasExpandidasFase2([...tutoriasExpandidasFase2, id]);
    }
  };

  const toggleExpandirTutoria = (id) => {
    if (tutoriaExpandida === id) { setTutoriaExpandida(null); setTutoradoEnEdicion(null); } 
    else { setTutoriaExpandida(id); setTutoradoEnEdicion(null); }
  };

  const iniciarEdicionTutorado = (tutoriaId, index, tutoradoActual) => {
    setTutoradoEnEdicion({ tutoriaId, index });
    setDatosEdicion({ ...tutoradoActual });
  };

  const guardarEdicionTutorado = () => {
    if(!datosEdicion.documento || !datosEdicion.nombres || !datosEdicion.apellidos) {
      alert("Faltan datos obligatorios del tutorado."); return;
    }
    const nuevasTutorias = tutoriasBorrador.map(tut => {
      if (tut.id === tutoradoEnEdicion.tutoriaId) {
        const nuevaLista = [...tut.tutoradosList];
        nuevaLista[tutoradoEnEdicion.index] = { ...datosEdicion };
        return { ...tut, tutoradosList: nuevaLista };
      }
      return tut;
    });
    setTutoriasBorrador(nuevasTutorias);
    setTutoradoEnEdicion(null);
  };

  const eliminarTutoradoInline = (tutoriaId, index) => {
    if(!window.confirm("¿Seguro que desea quitar a este tutorado?")) return;
    const nuevasTutorias = tutoriasBorrador.map(tut => {
      if (tut.id === tutoriaId) {
        const nuevaLista = [...tut.tutoradosList];
        nuevaLista.splice(index, 1);
        return { ...tut, tutoradosList: nuevaLista, numeroTutorados: nuevaLista.length };
      }
      return tut;
    });
    setTutoriasBorrador(nuevasTutorias);
  };

  // ==========================================
  // LÓGICA DE FORMULARIOS (FASE 1) - CORREGIDA
  // ==========================================
  const buscarTutor = () => {
    const backupTipo = tutorDatos.tipoDoc;
    setTutorDatos({ nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: backupTipo });
    
    if (dbEstudiantes[tutorDoc]) {
      const datosEncontrados = dbEstudiantes[tutorDoc];
      
      // Verificamos si los datos del mock existen en los catálogos actuales
      const facultadValida = catalogoFacultades.includes(datosEncontrados.facultad) ? datosEncontrados.facultad : '';
      const programaValido = catalogoProgramas.includes(datosEncontrados.programa) ? datosEncontrados.programa : '';
      const sedeValida = catalogoSedes.includes(datosEncontrados.sede) ? datosEncontrados.sede : '';

      setTutorDatos(prev => ({ 
        ...prev, 
        ...datosEncontrados,
        facultad: facultadValida,
        programa: programaValido,
        sede: sedeValida
      })); 
      
      // Si falta algún dato en el catálogo, NO bloqueamos para permitir que el usuario lo seleccione manualmente
      if(!facultadValida || !programaValido || !sedeValida) {
        setTutorBloqueado(false);
      } else {
        setTutorBloqueado(true);
      }
    } else {
      setTutorBloqueado(false);
      alert("Tutor Par no encontrado en la base de datos.");
    }
  };

  const confirmarTutor = () => {
    if (!tutorDatos.nombres || !tutorDatos.apellidos || !tutorDatos.promedio || !tutorDatos.notaAsignatura || !tutorDatos.programa || !tutorDatos.facultad || !tutorDatos.codigo) {
      alert("Complete TODOS los campos obligatorios del Tutor."); return;
    }
    
    // VALIDACIÓN ESTRICTA DEL CORREO INSTITUCIONAL
    const dominioPermitido = "@unicartagena.edu.co";
    if (!tutorDatos.correo || !tutorDatos.correo.toLowerCase().endsWith(dominioPermitido)) {
      alert(`Por favor ingrese un correo institucional válido que termine en ${dominioPermitido}`);
      return;
    }

    setTutorConfirmado(true);
  };

  const buscarTutoradoDraft = () => {
    const doc = tutoradoDraft.documento;
    const backupTipo = tutoradoDraft.tipoDoc;
    setTutoradoDraft({ documento: doc, nombres: '', apellidos: '', genero: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: backupTipo });
    
    if (dbEstudiantes[doc]) {
      const datosEncontrados = dbEstudiantes[doc];
      
      // Misma validación para el tutorado
      const facultadValida = catalogoFacultades.includes(datosEncontrados.facultad) ? datosEncontrados.facultad : '';
      const programaValido = catalogoProgramas.includes(datosEncontrados.programa) ? datosEncontrados.programa : '';
      const sedeValida = catalogoSedes.includes(datosEncontrados.sede) ? datosEncontrados.sede : '';

      setTutoradoDraft(prev => ({ 
        ...prev, 
        ...datosEncontrados,
        facultad: facultadValida,
        programa: programaValido,
        sede: sedeValida,
        bloqueado: (facultadValida && programaValido && sedeValida) ? true : false
      }));
    } else {
      setTutoradoDraft(prev => ({ ...prev, bloqueado: false }));
      alert("Tutorado no encontrado en la base de datos.");
    }
  };

  const agregarTutorado = () => {
    if (!tutoradoDraft.documento || !tutoradoDraft.nombres || !tutoradoDraft.apellidos || !tutoradoDraft.genero || !tutoradoDraft.promedioInicio || !tutoradoDraft.programa || !tutoradoDraft.codigo || !tutoradoDraft.sede) {
      alert("Complete los datos obligatorios del tutorado (incluyendo Sede)."); return;
    }
    const nuevoTutorado = { ...tutoradoDraft, idInterno: new Date().getTime() };
    setTutorados([...tutorados, nuevoTutorado]);
    setTutoradoDraft({ documento: '', nombres: '', apellidos: '', genero: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: 'CC' });
  };

  const agruparTutoria = (e) => {
    e.preventDefault();
    if (!tutorConfirmado || !formAsignatura) { alert("Faltan confirmar el tutor o seleccionar asignatura."); return; }

    const indexExistente = tutoriasBorrador.findIndex(tut => tut.tutorDoc === tutorDoc && tut.asignatura === formAsignatura);

    if (indexExistente !== -1) {
      const nuevasTutorias = [...tutoriasBorrador];
      const tutoriaExistente = nuevasTutorias[indexExistente];
      const listaCombinada = [...tutoriaExistente.tutoradosList, ...tutorados];
      nuevasTutorias[indexExistente] = { ...tutoriaExistente, tutoradosList: listaCombinada, numeroTutorados: listaCombinada.length };
      setTutoriasBorrador(nuevasTutorias);
      alert("Tutor y Asignatura ya registrados. Se han añadido los tutorados a la tutoría existente.");
    } else {
      setTutoriasBorrador([...tutoriasBorrador, {
        id: `TUT-${Math.floor(Math.random() * 9000)}`, tutorDoc: tutorDoc, asignatura: formAsignatura, tutorNombre: `${tutorDatos.nombres} ${tutorDatos.apellidos}`, numeroTutorados: tutorados.length, tutoradosList: tutorados
      }]);
    }
    
    setTutorConfirmado(false); setTutorDoc(''); setTutorados([]);
    setTutorDatos({ nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: 'CC' });
    setVistaActual('pantalla2');
  };

  const guardarReporteInicial = () => {
    if (tutoriasBorrador.length === 0) return;

    const reportesActualizados = [...listaReportes];
    const indiceExistente = reportesActualizados.findIndex(r => r.periodo === formPeriodo && r.estado === 'Inicial');

    if (indiceExistente !== -1) {
      const reporteExistente = reportesActualizados[indiceExistente];
      reportesActualizados[indiceExistente] = { ...reporteExistente, tutorias: [...reporteExistente.tutorias, ...tutoriasBorrador] };
      alert(`Tutorías añadidas al reporte abierto del periodo ${formPeriodo}.`);
    } else {
      reportesActualizados.unshift({ id: `REP-${Math.floor(Math.random() * 9000)}`, periodo: formPeriodo, estado: 'Inicial', tutorias: tutoriasBorrador });
      alert(`Nuevo reporte inicial generado para el periodo ${formPeriodo}.`);
    }

    setListaReportes(reportesActualizados);
    setTutoriasBorrador([]);
    volverAListado();
  };

  const procesarReporteFinal = (e) => {
    e.preventDefault();
    setListaReportes(listaReportes.map(r => r.id === reporteACompletar.id ? { ...r, estado: 'Final' } : r));
    alert("¡Reporte Finalizado exitosamente!");
    volverAListado();
  };

  const reportesFiltrados = listaReportes.filter(r => r.id.toLowerCase().includes(filtroReportes.toLowerCase()) || r.periodo.toLowerCase().includes(filtroReportes.toLowerCase()));
  const tutoriasFiltradas = tutoriasBorrador.filter(t => t.tutorNombre.toLowerCase().includes(filtroTutorias.toLowerCase()) || t.asignatura.toLowerCase().includes(filtroTutorias.toLowerCase()) || t.id.toLowerCase().includes(filtroTutorias.toLowerCase()));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      {/* HEADER GLOBAL ESTANDARIZADO */}
      <div className="bg-[#1a232f] p-6 text-white flex justify-between items-center rounded-t-xl border-b-4 border-[#EBB700]">
        <div>
          <h2 className="text-xl font-bold tracking-wide">Gestión de Reportes (SGTP)</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Univ. de Cartagena - Bienestar Universitario</p>
        </div>
        {vistaActual !== 'pantalla1' && (
          <button onClick={volverAListado} className="flex items-center text-sm font-semibold text-[#EBB700] hover:text-yellow-400 transition-colors border border-[#EBB700] px-4 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver Atrás
          </button>
        )}
      </div>

      <div className="p-8">
        
        {/* ==========================================
            PANTALLA 1: LISTADO DE REPORTES
        ========================================== */}
        {vistaActual === 'pantalla1' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6 gap-4">
              <div className="flex-1 w-full flex flex-col md:flex-row gap-4 items-center">
                <h3 className="text-xl font-bold text-[#1B2631] whitespace-nowrap">Listado de reportes</h3>
                <input type="text" placeholder="Buscar por ID o Periodo..." value={filtroReportes} onChange={(e) => setFiltroReportes(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-md outline-none focus:ring-1 focus:ring-[#EBB700]" />
              </div>
              <button onClick={irAPantalla2} className="bg-[#EBB700] text-[#1B2631] px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition-all text-sm shadow-sm flex items-center whitespace-nowrap">
                <span className="text-lg mr-2 leading-none">+</span> Crear Nuevo Reporte
              </button>
            </div>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4">Reporte No.</th><th className="p-4">Periodo Académico</th><th className="p-4 text-center">Tutorías Agrupadas</th><th className="p-4 text-center">Estado</th><th className="p-4 text-center">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y">
                {reportesFiltrados.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-[#1B2631]">{rep.id}</td>
                    <td className="p-4 font-medium text-gray-600">{rep.periodo}</td>
                    <td className="p-4 text-center font-bold text-blue-600">{rep.tutorias ? rep.tutorias.length : 0}</td>
                    <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${rep.estado === 'Final' ? 'bg-gray-200 text-gray-700 border border-gray-300' : 'bg-green-50 text-green-700 border border-green-200'}`}>{rep.estado}</span></td>
                    <td className="p-4 flex justify-center items-center gap-2">
                      {rep.estado === 'Inicial' ? (
                          <button onClick={() => iniciarFase2(rep)} className="px-4 py-1.5 rounded border text-xs font-bold bg-white text-[#1B2631] border-gray-300 hover:bg-gray-100 transition-all shadow-sm">
                            Cerrar (Pasar a Final)
                          </button>
                      ) : (
                          <>
                            <span className="text-gray-500 font-semibold text-xs italic px-2">Completado</span>
                            <button onClick={() => simularDescargaPDF(rep.id)} className="px-3 py-1.5 rounded border text-xs font-bold bg-red-50 text-red-600 border-red-200 hover:bg-red-100 transition-all shadow-sm flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> PDF
                            </button>
                          </>
                      )}
                    </td>
                  </tr>
                ))}
                {reportesFiltrados.length === 0 && <tr><td colSpan="5" className="text-center p-8 text-gray-500">No se encontraron reportes.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ==========================================
            PANTALLA 2: LISTADO DE TUTORÍAS
        ========================================= */}
        {vistaActual === 'pantalla2' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6 gap-4">
              <div className="flex-1 w-full flex flex-col md:flex-row gap-4 items-center">
                <h3 className="text-xl font-bold text-[#1B2631] whitespace-nowrap">Listado de tutorías</h3>
                <input type="text" placeholder="Buscar por ID, Tutor o Asignatura..." value={filtroTutorias} onChange={(e) => setFiltroTutorias(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-md outline-none focus:ring-1 focus:ring-[#EBB700]" />
              </div>
              <button onClick={irAPantalla3} className="bg-[#EBB700] text-[#1B2631] px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition-all text-sm shadow-sm flex items-center whitespace-nowrap">
                <span className="text-lg mr-2 leading-none">+</span> Crear nueva tutoría
              </button>
            </div>

            {tutoriasFiltradas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 mx-auto max-w-2xl">
                <div className="text-4xl text-gray-300 mb-3 font-light">+</div><p className="text-[#1B2631] font-medium text-base">Aún no hay tutorías agrupadas.</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                    <tr><th className="p-4">Tutoría No.</th><th className="p-4">Tutor Par</th><th className="p-4">Asignatura</th><th className="p-4 text-center">Tutorados</th><th className="p-4 text-center">Detalles</th></tr>
                  </thead>
                  <tbody className="text-sm divide-y bg-white">
                    {tutoriasFiltradas.map((tut) => (
                      <React.Fragment key={tut.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-semibold text-[#1B2631]">{tut.id}</td>
                          <td className="p-4 font-medium text-gray-800">{tut.tutorNombre}</td>
                          <td className="p-4 text-gray-600">{tut.asignatura}</td>
                          <td className="p-4 text-center font-black text-[#1B2631] text-lg">{tut.numeroTutorados}</td>
                          <td className="p-4 text-center">
                            <button onClick={() => toggleExpandirTutoria(tut.id)} className="text-[#EBB700] hover:text-yellow-600 font-bold text-sm underline">
                              {tutoriaExpandida === tut.id ? 'Ocultar' : 'Ver Detalles'}
                            </button>
                          </td>
                        </tr>
                        
                        {/* DESPLEGABLE DE EDICIÓN */}
                        {tutoriaExpandida === tut.id && (
                          <tr className="bg-gray-50 border-b-4 border-gray-300">
                            <td colSpan="5" className="p-6">
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Tutorados asignados a esta tutoría:
                              </h5>
                              
                              {tut.tutoradosList.length === 0 && <p className="text-sm text-gray-400 italic">No hay tutorados.</p>}
                              
                              <div className="grid grid-cols-1 gap-4">
                                {tut.tutoradosList.map((tutorado, index) => (
                                  <div key={tutorado.idInterno} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                                    
                                    {tutoradoEnEdicion?.tutoriaId === tut.id && tutoradoEnEdicion?.index === index ? (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Doc.</label><select value={datosEdicion.tipoDoc} onChange={(e) => setDatosEdicion({...datosEdicion, tipoDoc: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded"><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option></select></div>
                                          <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Número Documento</label><input type="text" value={datosEdicion.documento} onChange={(e) => setDatosEdicion({...datosEdicion, documento: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded"/></div>
                                          <div className="col-span-3"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombres</label><input type="text" value={datosEdicion.nombres} onChange={(e) => setDatosEdicion({...datosEdicion, nombres: limpiarTexto(e.target.value)})} className="w-full border px-2 py-1.5 text-xs rounded"/></div>
                                          <div className="col-span-3"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Apellidos</label><input type="text" value={datosEdicion.apellidos} onChange={(e) => setDatosEdicion({...datosEdicion, apellidos: limpiarTexto(e.target.value)})} className="w-full border px-2 py-1.5 text-xs rounded"/></div>
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Género</label><select value={datosEdicion.genero} onChange={(e) => setDatosEdicion({...datosEdicion, genero: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded"><option value="M">M</option><option value="F">F</option></select></div>
                                          <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Código Estudiantil</label><input type="text" value={datosEdicion.codigo} onChange={(e) => setDatosEdicion({...datosEdicion, codigo: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded"/></div>
                                          <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sede</label><select value={datosEdicion.sede} onChange={(e) => setDatosEdicion({...datosEdicion, sede: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded"><option value="">SEDE...</option>{catalogoSedes.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                          <div className="col-span-3"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Programa</label><select value={datosEdicion.programa} onChange={(e) => setDatosEdicion({...datosEdicion, programa: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded">{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                          <div className="col-span-3 lg:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Riesgo Inicial</label><select value={datosEdicion.riesgo} onChange={(e) => setDatosEdicion({...datosEdicion, riesgo: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded font-bold text-yellow-700"><option value="BAJO">BAJO RENDIMIENTO</option><option value="ALTO">ALTO RIESGO</option></select></div>
                                          <div className="col-span-3 lg:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Prom. Inicio</label><input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={datosEdicion.promedioInicio} onChange={(e) => setDatosEdicion({...datosEdicion, promedioInicio: e.target.value})} className="w-full border px-2 py-1.5 text-xs rounded font-bold"/></div>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                          <button onClick={() => setTutoradoEnEdicion(null)} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancelar</button>
                                          <button onClick={guardarEdicionTutorado} className="text-sm font-bold bg-[#1B2631] text-white px-6 py-2 rounded-lg shadow">Guardar Cambios</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <p className="font-bold text-[#1B2631] text-sm">{tutorado.nombres} {tutorado.apellidos}</p>
                                            <p className="text-xs text-gray-500 mt-1 uppercase">Doc: {tutorado.tipoDoc} {tutorado.documento}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Género: {tutorado.genero}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs font-bold text-gray-700">Prog: <span className="font-normal">{tutorado.programa}</span></p>
                                            <p className="text-xs font-bold text-gray-700 mt-1">Cód: <span className="font-normal">{tutorado.codigo}</span></p>
                                            <p className="text-xs font-bold text-gray-700 mt-1">Sede: <span className="font-normal">{tutorado.sede}</span></p>
                                          </div>
                                          <div>
                                            <p className="text-xs font-bold text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded">Riesgo Inicial: <span className="text-yellow-600">{tutorado.riesgo}</span></p>
                                            <p className="text-xs font-bold text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded mt-2">Promedio Inicial: <span className="text-[#1B2631]">{tutorado.promedioInicio}</span></p>
                                          </div>
                                        </div>
                                        <div className="flex flex-col gap-2 ml-4 border-l pl-4 border-gray-100">
                                          <button onClick={() => iniciarEdicionTutorado(tut.id, index, tutorado)} className="text-xs font-bold text-[#1B2631] hover:text-[#EBB700] underline">Editar</button>
                                          <button onClick={() => eliminarTutoradoInline(tut.id, index)} className="text-xs font-bold text-red-500 hover:text-red-700 underline">Quitar</button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tutoriasBorrador.length > 0 && (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => simularDescargaPDF("Borrador_Fase1")} className="px-6 py-3 bg-red-50 text-red-700 border border-red-200 font-bold rounded-lg hover:bg-red-100 transition shadow-sm flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Exportar a PDF
                </button>
                <button onClick={guardarReporteInicial} className="bg-[#1B2631] text-white px-8 py-3 rounded-lg font-bold shadow-sm flex items-center text-sm hover:bg-gray-800 transition">
                  Guardar y Generar Reporte Inicial
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            PANTALLA 3: FORMULARIO FASE 1
        ========================================== */}
        {vistaActual === 'pantalla3' && (
          <form onSubmit={agruparTutoria} className="animate-fade-in max-w-6xl mx-auto space-y-6">
            <div className="text-center mb-6"><h3 className="text-2xl font-bold text-[#1B2631]">Estructurar Nueva Tutoría (Fase 1)</h3></div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Asignatura (Catálogo)</label>
                  <select value={formAsignatura} onChange={(e) => setFormAsignatura(e.target.value)} className="w-full px-4 py-2.5 border rounded font-medium outline-none bg-white text-sm focus:border-[#1B2631]" required disabled={tutorConfirmado}>
                    <option value="">Seleccionar...</option>{catalogoAsignaturas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Periodo Académico Actual</label>
                  <select value={formPeriodo} onChange={(e) => setFormPeriodo(e.target.value)} className="w-full px-4 py-2.5 border rounded font-medium outline-none bg-white text-sm focus:border-[#1B2631]" required disabled={tutorConfirmado}>
                    <option value="2026-I">2026-I</option><option value="2026-II">2026-II</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-xl border border-gray-200 border-t-4 border-t-[#EBB700] shadow-sm">
              <h4 className="font-bold text-[#1B2631] mb-5">Identificación del Tutor Par</h4>
              
              <div className="flex gap-2 mb-6 border-b border-gray-100 pb-6 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Doc.</label>
                  <select value={tutorDatos.tipoDoc} onChange={(e) => setTutorDatos({...tutorDatos, tipoDoc: e.target.value})} className="w-16 px-2 py-2.5 border border-gray-300 rounded-lg text-xs bg-gray-50 font-bold focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option><option value="PEP">PEP</option></select>
                </div>
                <div className="flex-1">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Cédula del Estudiante (Buscador)</label>
                   <input type="number" value={tutorDoc} onChange={(e) => setTutorDoc(e.target.value)} placeholder="Ej: 123456789" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-gray-50 font-bold focus:border-[#EBB700]" disabled={tutorConfirmado} required/>
                </div>
                <button type="button" onClick={buscarTutor} disabled={tutorConfirmado} className="bg-gray-200 border border-gray-300 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-300 transition text-gray-800 h-[38px]">Buscar en BD</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombres</label><input type="text" value={tutorDatos.nombres} onChange={(e) => setTutorDatos({...tutorDatos, nombres: limpiarTexto(e.target.value)})} placeholder="Ej: JUAN CARLOS" className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Apellidos</label><input type="text" value={tutorDatos.apellidos} onChange={(e) => setTutorDatos({...tutorDatos, apellidos: limpiarTexto(e.target.value)})} placeholder="Ej: PEREZ" className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código Est.</label><input type="text" value={tutorDatos.codigo} onChange={(e) => setTutorDatos({...tutorDatos, codigo: e.target.value})} placeholder="Ej: 2020001" className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Género</label><select value={tutorDatos.genero} onChange={(e) => setTutorDatos({...tutorDatos, genero: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required><option value="">GÉNERO...</option><option value="M">M</option><option value="F">F</option></select></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Teléfono</label><input type="tel" value={tutorDatos.telefono} onChange={(e) => setTutorDatos({...tutorDatos, telefono: e.target.value})} placeholder="3000000000" className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad</label>
                  {catalogoFacultades.length === 0 ? <span className="text-xs text-red-500 font-bold block mt-2">Cree una Facultad en el módulo Gestión Académica</span> : 
                  <select value={tutorDatos.facultad} onChange={(e) => setTutorDatos({...tutorDatos, facultad: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required><option value="">FACULTAD...</option>{catalogoFacultades.map(f => <option key={f} value={f}>{f}</option>)}</select>}
                </div>
                
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Programa</label>
                  {catalogoProgramas.length === 0 ? <span className="text-xs text-red-500 font-bold block mt-2">Cree un Programa en Gestión Académica</span> : 
                  <select value={tutorDatos.programa} onChange={(e) => setTutorDatos({...tutorDatos, programa: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required><option value="">PROGRAMA...</option>{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select>}
                </div>
                
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sede</label>
                  {catalogoSedes.length === 0 ? <span className="text-xs text-red-500 font-bold block mt-2">Cree una Sede en Gestión Académica</span> : 
                  <select value={tutorDatos.sede} onChange={(e) => setTutorDatos({...tutorDatos, sede: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required><option value="">SEDE...</option>{catalogoSedes.map(s => <option key={s} value={s}>{s}</option>)}</select>}
                </div>
                
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Correo Institucional</label><input type="email" value={tutorDatos.correo} onChange={(e) => setTutorDatos({...tutorDatos, correo: e.target.value})} placeholder="@unicartagena.edu.co" className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#1B2631]" disabled={tutorBloqueado || tutorConfirmado} required/></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Promedio Acumulado Actual (Requisito)</label>
                  <input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={tutorDatos.promedio} onChange={(e) => setTutorDatos({...tutorDatos, promedio: e.target.value})} placeholder="Ej: 4.3" className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-sm bg-white focus:border-[#1B2631]" disabled={tutorConfirmado} required/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Nota Histórica en Asignatura ({formAsignatura || '...'})</label>
                  <input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={tutorDatos.notaAsignatura} onChange={(e) => setTutorDatos({...tutorDatos, notaAsignatura: e.target.value})} placeholder="Ej: 4.0" className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-sm bg-white text-[#1B2631] focus:border-[#1B2631]" disabled={tutorConfirmado || !formAsignatura} required/>
                </div>
              </div>

              {!tutorConfirmado ? (
                <button type="button" onClick={confirmarTutor} className="mt-5 bg-[#1B2631] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition shadow">Confirmar y Agregar Tutor Par</button>
              ) : (
                <div className="mt-5 text-[#1B2631] font-semibold text-xs bg-gray-100 p-3 rounded border border-gray-300 flex justify-between items-center"><span>✅ Tutor Confirmado.</span> <button type="button" onClick={() => setTutorConfirmado(false)} className="underline font-bold">Editar Tutor</button></div>
              )}
            </div>

            {/* TUTORADOS */}
            {tutorConfirmado && (
              <div className="bg-white p-7 rounded-xl border border-gray-200 border-t-4 border-t-gray-400 shadow-sm">
                <div className="flex justify-between items-center mb-5"><h4 className="font-bold text-[#1B2631]">Tutorados Asignados a la Tutoría</h4><span className="bg-gray-200 text-gray-800 font-bold px-3 py-1 rounded-full text-xs">{tutorados.length}</span></div>
                
                {tutorados.map((t, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-2 text-xs flex justify-between items-center">
                    <span><span className="font-bold text-[#1B2631]">{t.nombres} {t.apellidos}</span> (Cód: {t.codigo}) - Prom. Inicial: {t.promedioInicio} - Riesgo: {t.riesgo}</span>
                    <button type="button" onClick={() => { const nl = [...tutorados]; nl.splice(idx,1); setTutorados(nl); }} className="text-gray-500 hover:text-red-500 font-bold px-2 rounded transition">X</button>
                  </div>
                ))}

                <div className="bg-gray-50 p-5 rounded-xl mt-6 border border-gray-200 space-y-4">
                  <h5 className="text-xs font-bold text-gray-800 uppercase mb-2">Agregar nuevo tutorado</h5>
                  <div className="flex gap-2 items-end">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Doc</label><select value={tutoradoDraft.tipoDoc} onChange={(e) => setTutoradoDraft({...tutoradoDraft, tipoDoc: e.target.value})} className="w-16 px-2 py-2.5 border border-gray-300 rounded text-xs bg-white font-bold"><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option></select></div>
                    <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Buscador de Cédula</label><input type="number" value={tutoradoDraft.documento} onChange={(e) => setTutoradoDraft({...tutoradoDraft, documento: e.target.value})} placeholder="Cédula Tutorado" className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#1B2631]" /></div>
                    <button type="button" onClick={buscarTutoradoDraft} className="bg-gray-200 border border-gray-300 px-5 rounded font-semibold hover:bg-gray-300 text-xs text-gray-800 h-[38px] transition">Buscar</button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombres</label><input type="text" value={tutoradoDraft.nombres} onChange={(e) => setTutoradoDraft({...tutoradoDraft, nombres: limpiarTexto(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#1B2631]" disabled={tutoradoDraft.bloqueado}/></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Apellidos</label><input type="text" value={tutoradoDraft.apellidos} onChange={(e) => setTutoradoDraft({...tutoradoDraft, apellidos: limpiarTexto(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#1B2631]" disabled={tutoradoDraft.bloqueado}/></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Género</label><select value={tutoradoDraft.genero} onChange={(e) => setTutoradoDraft({...tutoradoDraft, genero: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">...</option><option value="M">M</option><option value="F">F</option></select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código</label><input type="text" value={tutoradoDraft.codigo} onChange={(e) => setTutoradoDraft({...tutoradoDraft, codigo: e.target.value})} className="w-full border border-gray-300 px-3 py-2 border rounded text-xs" disabled={tutoradoDraft.bloqueado}/></div>
                    
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad</label><select value={tutoradoDraft.facultad} onChange={(e) => setTutoradoDraft({...tutoradoDraft, facultad: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">FACULTAD...</option>{catalogoFacultades.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Programa</label><select value={tutoradoDraft.programa} onChange={(e) => setTutoradoDraft({...tutoradoDraft, programa: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">PROGRAMA...</option>{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sede</label><select value={tutoradoDraft.sede} onChange={(e) => setTutoradoDraft({...tutoradoDraft, sede: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">SEDE...</option>{catalogoSedes.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    
                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Riesgo Inicial</label><select value={tutoradoDraft.riesgo} onChange={(e) => setTutoradoDraft({...tutoradoDraft, riesgo: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white focus:border-[#1B2631] font-bold text-yellow-700"><option value="">SELECCIONE...</option><option value="BAJO">BAJO RENDIMIENTO</option><option value="ALTO">ALTO RIESGO</option></select></div>
                    <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Prom. Inicial</label><input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={tutoradoDraft.promedioInicio} onChange={(e) => setTutoradoDraft({...tutoradoDraft, promedioInicio: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-xs font-bold focus:border-[#1B2631]" /></div>
                  </div>
                  <button type="button" onClick={agregarTutorado} className="bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold w-full hover:bg-gray-300 transition">Añadir Tutorado a la Lista ↑</button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200"><button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800 transition">Agrupar Tutoría Completa</button></div>
          </form>
        )}

        {/* === PANTALLA 4: FASE 2 (REPORTE FINAL COMPACTO) === */}
        {vistaActual === 'pantalla4' && reporteACompletar && (
          <div className="animate-fade-in max-w-5xl mx-auto pb-10">
            <div className="mb-8 border-b border-gray-200 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1B2631]">Gestión de Reporte Final (Cierre)</h3>
                <p className="text-gray-500 mt-1 text-sm">Diligencie las métricas para el reporte: <span className="font-bold text-[#EBB700] bg-yellow-50 px-2 rounded">{reporteACompletar.id}</span> | Periodo: {reporteACompletar.periodo}</p>
              </div>
              <div className="w-full md:w-72">
                 <input type="text" placeholder="Buscar por Tutor Par..." value={filtroTutorFase2} onChange={(e) => setFiltroTutorFase2(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1B2631] bg-white transition-colors" />
              </div>
            </div>

            <form onSubmit={procesarReporteFinal}>
              
              {reporteACompletar.tutorias
                 .filter(t => t.tutorNombre.toLowerCase().includes(filtroTutorFase2.toLowerCase()))
                 .map((tutoria) => (
                 <div key={tutoria.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-[#1B2631] mb-3">
                    
                    {/* ACORDEÓN COMPACTO Y DELGADO */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                       <div className="flex-1 cursor-pointer w-full" onClick={() => toggleExpandirTutoriaFase2(tutoria.id)}>
                          <div className="flex items-center gap-2">
                             <span className="bg-[#EBB700] text-[#1B2631] px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap">{tutoria.id}</span>
                             <h4 className="text-sm font-bold text-[#1B2631] hover:text-[#EBB700] transition-colors truncate">{tutoria.tutorNombre}</h4>
                             <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">({tutoriasExpandidasFase2.includes(tutoria.id) ? 'Ocultar' : 'Ver'})</span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-semibold tracking-wide mt-1 truncate">Asignatura: {tutoria.asignatura} | Tutorados: {tutoria.tutoradosList.length}</p>
                       </div>
                       
                       {/* BOTÓN HORIZONTAL Y COMPACTO PARA NO ESTIRAR LA CAJA */}
                       <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-[#EBB700] w-full md:w-auto justify-between">
                          <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider m-0">Dictamen:</label>
                          <select className="font-bold outline-none bg-transparent text-[#1B2631] text-xs border-b border-[#EBB700] m-0" required>
                             <option value="">Seleccione...</option><option value="SI">CUMPLIÓ</option><option value="NO">NO CUMPLIÓ</option>
                          </select>
                       </div>
                    </div>

                    {tutoriasExpandidasFase2.includes(tutoria.id) && (
                       <div className="mt-4 border-t border-gray-100 pt-4 animate-fade-in">
                          <h5 className="font-bold text-[#1B2631] text-xs mb-4 uppercase tracking-wider flex items-center border-b border-gray-100 pb-2">Evaluación Final de Tutorados</h5>
                          <div className="space-y-6">
                             {tutoria.tutoradosList.map((tutorado, idxTutorado) => (
                                <div key={idxTutorado} className="bg-gray-50 p-5 rounded-lg border border-gray-200 border-t-2 border-t-[#1B2631]">
                                   <p className="font-bold text-gray-800 mb-4 text-sm">{tutorado.nombres} {tutorado.apellidos} <span className="text-gray-500 font-normal text-xs ml-1">(ID: {tutorado.documento})</span></p>
                                   
                                   <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-4">
                                      <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Inicio</label><input type="date" className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required /></div>
                                      <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Fin</label><input type="date" className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required /></div>
                                      <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tot. Sesiones</label><input type="number" min="0" placeholder="Ej: 12" className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required /></div>
                                      <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nota Final</label><input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} placeholder="Ej: 4.5" className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none font-bold bg-white focus:border-[#1B2631]" required /></div>
                                      <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">¿Cargado SIRE?</label><select className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required><option value="">...</option><option value="SI">SÍ</option><option value="NO">NO</option></select></div>
                                   </div>

                                   <div className="mt-4">
                                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Observaciones / Novedades del proceso</label>
                                      <textarea rows="2" placeholder="Detalle aquí cualquier novedad extensa sobre el proceso del tutorado..." className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white focus:border-[#1B2631] resize-y"></textarea>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              ))}

              <div className="flex gap-4 justify-end border-t border-gray-200 pt-6 mt-8">
                 <button type="button" onClick={volverAListado} className="px-6 py-2.5 bg-gray-100 font-bold text-sm rounded-lg hover:bg-gray-200 transition text-gray-700 border border-gray-300">Cancelar Cierre</button>
                 <button type="button" onClick={() => simularDescargaPDF(reporteACompletar.id)} className="px-6 py-2.5 bg-red-50 text-red-700 font-bold text-sm border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Exportar PDF
                 </button>
                 <button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 font-bold text-sm rounded-lg hover:bg-gray-800 shadow-sm flex items-center transition">
                    Completar y Guardar Reporte Final
                 </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reportes;