import React, { useState } from 'react';

// ==========================================
// CATÁLOGOS SIMULADOS (SGTP)
// ==========================================
const catalogoFacultades = ["INGENIERÍA", "CIENCIAS EXACTAS", "MEDICINA", "DERECHO"];
const catalogoSedes = ["SAN AGUSTÍN", "ZARAGOCILLA", "SAN JUAN", "PIEDRA DE BOLÍVAR"];
const catalogoProgramas = ["INGENIERÍA DE SISTEMAS", "MEDICINA", "DERECHO", "ODONTOLOGÍA", "ADMINISTRACIÓN"];

const mockReportesActivos = [
  { 
    id: 'REP-001', periodo: '2026-I', estado: 'Inicial', 
    tutorias: [
      { id: 'TUT-8821', tutorNombre: 'CARLOS RUIZ', asignatura: '1010101 - CÁLCULO DIFERENCIAL', tutoradosList: [{ documento: '987654321', nombres: 'ANA', apellidos: 'GOMEZ' }] },
      { id: 'TUT-1024', tutorNombre: 'MARIA PEREZ', asignatura: '2123131 - FÍSICA', tutoradosList: [{ documento: '11223344', nombres: 'LUIS', apellidos: 'MARTINEZ' }] }
    ] 
  },
  { id: 'REP-002', periodo: '2025-II', estado: 'Final', tutorias: [] }
];

const datosInicialesBD = {
  "123456789": { 
    nombres: "JESUS DAVID", apellidos: "BARRIOS MARTINEZ", genero: "M", correo: "JBARRIOSM@UNICARTAGENA.EDU.CO",
    codigo: "2024001", telefono: "3001234567", programa: "INGENIERÍA DE SISTEMAS", sede: "PIEDRA DE BOLÍVAR", facultad: "INGENIERÍA", tipoDoc: "CC"
  }
};

const limpiarTexto = (texto) => texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\s]/g, "");

const Reportes = () => {
  const [vistaActual, setVistaActual] = useState('pantalla1');
  const [listaReportes, setListaReportes] = useState(mockReportesActivos);
  const [dbEstudiantes] = useState(datosInicialesBD);
  const [tutoriasBorrador, setTutoriasBorrador] = useState([]); 

  const [filtroReportes, setFiltroReportes] = useState('');
  const [filtroTutorias, setFiltroTutorias] = useState('');

  // --- Solución Linter: Cargar el catálogo de memoria de forma directa y síncrona ---
  const [catalogoAsignaturas] = useState(() => {
    const materiasGuardadas = JSON.parse(localStorage.getItem('sgtp_asignaturas')) || [];
    if (materiasGuardadas.length > 0) {
      return materiasGuardadas.map(m => `${m.codigo} - ${m.nombre}`);
    } else {
      return ["2123131 - FÍSICA", "1010101 - CÁLCULO DIFERENCIAL"];
    }
  });

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

  // ==========================================
  // FUNCIONES DE NAVEGACIÓN Y MVP
  // ==========================================
  const volverAListado = () => { setVistaActual('pantalla1'); setFiltroReportes(''); };
  const irAPantalla2 = () => { setVistaActual('pantalla2'); setFiltroTutorias(''); };
  const irAPantalla3 = () => setVistaActual('pantalla3');

  const iniciarFase2 = (reporte) => {
    if(!reporte.tutorias || reporte.tutorias.length === 0) {
        alert("Este reporte no tiene tutorías agrupadas para finalizar."); return;
    }
    setReporteACompletar(reporte);
    setVistaActual('pantalla4');
  };

  const simularDescargaPDF = (idReporte = "Borrador") => {
    alert(`📄 Generando documento PDF para el reporte [${idReporte}]...\n\n[MVP SIMULACIÓN: El archivo SGTP_Reporte_${idReporte}.pdf se ha descargado exitosamente en su equipo.]`);
  };

  // ==========================================
  // LÓGICA DE FORMULARIOS (FASE 1)
  // ==========================================
  const buscarTutor = () => {
    setTutorDatos({ nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: 'CC' });
    if (dbEstudiantes[tutorDoc]) {
      setTutorDatos(prev => ({ ...prev, ...dbEstudiantes[tutorDoc] })); 
      setTutorBloqueado(true);
    } else {
      setTutorBloqueado(false);
    }
  };

  const confirmarTutor = () => {
    if (!tutorDatos.nombres || !tutorDatos.apellidos || !tutorDatos.promedio || !tutorDatos.notaAsignatura || !tutorDatos.programa || !tutorDatos.facultad || !tutorDatos.codigo) {
      alert("Complete TODOS los campos obligatorios del Tutor."); return;
    }
    setTutorConfirmado(true);
  };

  const buscarTutoradoDraft = () => {
    const doc = tutoradoDraft.documento;
    setTutoradoDraft({ documento: doc, nombres: '', apellidos: '', genero: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: 'CC' });
    if (dbEstudiantes[doc]) {
      setTutoradoDraft(prev => ({ ...prev, ...dbEstudiantes[doc], bloqueado: true }));
    } else {
      setTutoradoDraft(prev => ({ ...prev, bloqueado: false }));
    }
  };

  const agregarTutorado = () => {
    if (!tutoradoDraft.documento || !tutoradoDraft.nombres || !tutoradoDraft.apellidos || !tutoradoDraft.genero || !tutoradoDraft.promedioInicio || !tutoradoDraft.programa || !tutoradoDraft.codigo) {
      alert("Complete los datos obligatorios del tutorado."); return;
    }
    setTutorados([...tutorados, tutoradoDraft]);
    setTutoradoDraft({ documento: '', nombres: '', apellidos: '', genero: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: 'CC' });
  };

  const agruparTutoria = (e) => {
    e.preventDefault();
    if (!tutorConfirmado || !formAsignatura) { alert("Faltan confirmar el tutor o seleccionar asignatura."); return; }
    setTutoriasBorrador([...tutoriasBorrador, {
      id: `TUT-${Math.floor(Math.random() * 9000)}`, asignatura: formAsignatura, tutorNombre: `${tutorDatos.nombres} ${tutorDatos.apellidos}`, numeroTutorados: tutorados.length, tutoradosList: tutorados
    }]);
    setTutorConfirmado(false); setTutorDoc(''); setTutorados([]);
    setTutorDatos({ nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '', codigo: '', sede: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: 'CC' });
    setVistaActual('pantalla2');
  };

  const guardarReporteInicial = () => {
    if (tutoriasBorrador.length === 0) return;
    setListaReportes([{ id: `REP-${Math.floor(Math.random() * 9000)}`, periodo: formPeriodo, estado: 'Inicial', tutorias: tutoriasBorrador }, ...listaReportes]);
    setTutoriasBorrador([]);
    volverAListado();
  };

  const procesarReporteFinal = (e) => {
    e.preventDefault();
    setListaReportes(listaReportes.map(r => r.id === reporteACompletar.id ? { ...r, estado: 'Final' } : r));
    alert("¡Reporte Finalizado exitosamente! El estado ha cambiado a Completado en el listado.");
    volverAListado();
  };

  const reportesFiltrados = listaReportes.filter(r => r.id.toLowerCase().includes(filtroReportes.toLowerCase()) || r.periodo.toLowerCase().includes(filtroReportes.toLowerCase()));
  const tutoriasFiltradas = tutoriasBorrador.filter(t => t.tutorNombre.toLowerCase().includes(filtroTutorias.toLowerCase()) || t.asignatura.toLowerCase().includes(filtroTutorias.toLowerCase()) || t.id.toLowerCase().includes(filtroTutorias.toLowerCase()));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      {/* HEADER GLOBAL */}
      <div className="bg-[#1a232f] p-6 text-white flex justify-between items-center rounded-t-xl">
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
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b">
                <tr><th className="p-4">Reporte No.</th><th className="p-4">Periodo Académico</th><th className="p-4">Estado</th><th className="p-4 text-center">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y">
                {reportesFiltrados.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-[#1B2631]">{rep.id}</td><td className="p-4 font-medium">{rep.periodo}</td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${rep.estado === 'Final' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{rep.estado}</span></td>
                    <td className="p-4 flex justify-center items-center gap-2">
                      {rep.estado === 'Inicial' ? (
                          <button onClick={() => iniciarFase2(rep)} className="px-4 py-1.5 rounded border text-xs font-bold bg-white text-red-600 border-red-200 hover:bg-red-50 transition-all shadow-sm">
                            Cerrar (Pasar a Final)
                          </button>
                      ) : (
                          <>
                            <span className="text-gray-500 font-semibold text-xs italic px-2">Completado</span>
                            <button onClick={() => simularDescargaPDF(rep.id)} className="px-3 py-1.5 rounded border text-xs font-bold bg-red-50 text-red-600 border-red-200 hover:bg-red-100 transition-all shadow-sm flex items-center" title="Descargar Constancia PDF">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              PDF
                            </button>
                          </>
                      )}
                    </td>
                  </tr>
                ))}
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
                <div className="text-4xl text-gray-300 mb-3 font-light">+</div><p className="text-[#1B2631] font-medium text-base">Aún no hay tutorías que coincidan.</p><p className="text-sm text-gray-400 mt-1">Presione "Crear nueva tutoría" para comenzar a poblar el reporte.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse border border-gray-200 rounded-xl mb-6 shadow-sm overflow-hidden divide-y divide-gray-100">
                <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                  <tr><th className="p-4">Tutoría No.</th><th className="p-4">Tutor Par</th><th className="p-4">Asignatura</th><th className="p-4 text-center">Tutorados</th></tr>
                </thead>
                <tbody className="text-sm divide-y">
                  {tutoriasFiltradas.map((tut) => (
                    <tr key={tut.id} className="hover:bg-gray-50"><td className="p-4 font-semibold text-[#1B2631]">{tut.id}</td><td className="p-4 font-medium text-gray-800">{tut.tutorNombre}</td><td className="p-4 text-gray-600">{tut.asignatura}</td><td className="p-4 text-center font-bold text-blue-600 bg-blue-50/50">{tut.numeroTutorados}</td></tr>
                  ))}
                </tbody>
              </table>
            )}

            {tutoriasBorrador.length > 0 && (
              <div className="flex justify-end gap-3 pt-6 border-t">
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

            {/* ASIGNATURA Y PERIODO */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Asignatura (Catálogo)</label>
                  <select value={formAsignatura} onChange={(e) => setFormAsignatura(e.target.value)} className="w-full px-4 py-2.5 border rounded font-medium outline-none bg-white text-sm" required disabled={tutorConfirmado}>
                    <option value="">Seleccionar...</option>{catalogoAsignaturas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Periodo Académico Actual</label>
                  <select value={formPeriodo} onChange={(e) => setFormPeriodo(e.target.value)} className="w-full px-4 py-2.5 border rounded font-medium outline-none bg-white text-sm" required disabled={tutorConfirmado}>
                    <option value="2026-I">2026-I</option><option value="2026-II">2026-II</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TUTOR */}
            <div className="bg-white p-7 rounded-xl border border-gray-200 border-t-4 border-t-[#EBB700] shadow-sm">
              <h4 className="font-bold text-[#1B2631] mb-5">Identificación del Tutor Par</h4>
              
              <div className="flex gap-2 mb-6 border-b border-gray-100 pb-6 items-end">
                <div className="flex-1">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Cédula del Estudiante (Buscador)</label>
                   <input type="number" value={tutorDoc} onChange={(e) => setTutorDoc(e.target.value)} placeholder="Ej: 123456789" className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-50 font-bold border-yellow-200" disabled={tutorConfirmado} required/>
                </div>
                <button type="button" onClick={buscarTutor} disabled={tutorConfirmado} className="bg-gray-200 border border-gray-300 px-6 py-2 rounded font-semibold text-sm hover:bg-gray-300 transition text-gray-700 h-[38px]">Buscar en Base de Datos</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Doc.</label><select value={tutorDatos.tipoDoc} onChange={(e) => setTutorDatos({...tutorDatos, tipoDoc: e.target.value})} className="w-full px-3 py-2 border rounded text-xs bg-gray-50 font-bold" disabled={tutorBloqueado || tutorConfirmado} required><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option><option value="PEP">PEP</option></select></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombres</label><input type="text" value={tutorDatos.nombres} onChange={(e) => setTutorDatos({...tutorDatos, nombres: limpiarTexto(e.target.value)})} placeholder="Ej: JUAN CARLOS" className="w-full px-3 py-2 border rounded text-xs" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Apellidos</label><input type="text" value={tutorDatos.apellidos} onChange={(e) => setTutorDatos({...tutorDatos, apellidos: limpiarTexto(e.target.value)})} placeholder="Ej: PEREZ" className="w-full px-3 py-2 border rounded text-xs" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código Est.</label><input type="text" value={tutorDatos.codigo} onChange={(e) => setTutorDatos({...tutorDatos, codigo: e.target.value})} placeholder="Ej: 2020001" className="w-full px-3 py-2 border rounded text-xs" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Género</label><select value={tutorDatos.genero} onChange={(e) => setTutorDatos({...tutorDatos, genero: e.target.value})} className="w-full px-3 py-2 border rounded text-xs bg-white" disabled={tutorBloqueado || tutorConfirmado} required><option value="">GÉNERO...</option><option value="M">M</option><option value="F">F</option></select></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Teléfono</label><input type="tel" value={tutorDatos.telefono} onChange={(e) => setTutorDatos({...tutorDatos, telefono: e.target.value})} placeholder="3000000000" className="w-full px-3 py-2 border rounded text-xs" disabled={tutorBloqueado || tutorConfirmado} required/></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad</label><select value={tutorDatos.facultad} onChange={(e) => setTutorDatos({...tutorDatos, facultad: e.target.value})} className="w-full px-3 py-2 border rounded text-xs bg-white" disabled={tutorBloqueado || tutorConfirmado} required><option value="">FACULTAD...</option>{catalogoFacultades.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Programa</label><select value={tutorDatos.programa} onChange={(e) => setTutorDatos({...tutorDatos, programa: e.target.value})} className="w-full px-3 py-2 border rounded text-xs bg-white" disabled={tutorBloqueado || tutorConfirmado} required><option value="">PROGRAMA...</option>{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sede</label><select value={tutorDatos.sede} onChange={(e) => setTutorDatos({...tutorDatos, sede: e.target.value})} className="w-full px-3 py-2 border rounded text-xs bg-white" disabled={tutorBloqueado || tutorConfirmado} required><option value="">SEDE...</option>{catalogoSedes.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div className="col-span-3 lg:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Correo Inst.</label><input type="email" value={tutorDatos.correo} onChange={(e) => setTutorDatos({...tutorDatos, correo: e.target.value})} placeholder="@unicartagena.edu.co" className="w-full px-3 py-2 border rounded text-xs" disabled={tutorBloqueado || tutorConfirmado} required/></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-yellow-50/50 p-4 rounded-lg border border-yellow-100">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Promedio Acumulado Actual</label>
                  <input type="number" step="0.1" value={tutorDatos.promedio} onChange={(e) => setTutorDatos({...tutorDatos, promedio: e.target.value})} placeholder="Ej: 4.3" className="w-full px-3 py-2 border rounded font-semibold text-sm bg-white" disabled={tutorConfirmado} required/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Nota en Asignatura ({formAsignatura || '...'})</label>
                  <input type="number" step="0.1" value={tutorDatos.notaAsignatura} onChange={(e) => setTutorDatos({...tutorDatos, notaAsignatura: e.target.value})} placeholder="Ej: 4.0" className="w-full px-3 py-2 border rounded font-semibold text-sm bg-white text-blue-700" disabled={tutorConfirmado || !formAsignatura} required/>
                </div>
              </div>

              {!tutorConfirmado ? (
                <button type="button" onClick={confirmarTutor} className="mt-5 bg-[#1B2631] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition">Confirmar y Agregar Tutor Par</button>
              ) : (
                <div className="mt-5 text-green-700 font-semibold text-xs bg-green-50 p-3 rounded border border-green-200 flex justify-between items-center"><span>✅ Tutor Confirmado.</span> <button type="button" onClick={() => setTutorConfirmado(false)} className="underline">Editar</button></div>
              )}
            </div>

            {/* TUTORADOS */}
            {tutorConfirmado && (
              <div className="bg-white p-7 rounded-xl border border-gray-200 border-t-4 border-t-blue-500 shadow-sm">
                <div className="flex justify-between items-center mb-5"><h4 className="font-bold text-[#1B2631]">Tutorados Asignados</h4><span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">{tutorados.length}</span></div>
                
                {tutorados.map((t, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-2 text-xs flex justify-between items-center group">
                    <span><span className="font-bold text-gray-800">{t.nombres} {t.apellidos}</span> (Cód: {t.codigo}) - Prom. Inicial: {t.promedioInicio} - Riesgo: {t.riesgo}</span>
                    <button type="button" onClick={() => { const nl = [...tutorados]; nl.splice(idx,1); setTutorados(nl); }} className="text-red-500 font-bold px-2 hover:bg-red-100 rounded">X</button>
                  </div>
                ))}

                <div className="bg-blue-50/50 p-5 rounded-xl mt-6 border border-blue-100 space-y-4">
                  <h5 className="text-xs font-bold text-blue-800 uppercase mb-2">Agregar nuevo tutorado</h5>
                  <div className="flex gap-2 items-end">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Doc</label><select value={tutoradoDraft.tipoDoc} onChange={(e) => setTutoradoDraft({...tutoradoDraft, tipoDoc: e.target.value})} className="w-16 px-2 py-2.5 border rounded text-xs bg-white font-bold"><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option></select></div>
                    <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Buscador de Cédula</label><input type="number" value={tutoradoDraft.documento} onChange={(e) => setTutoradoDraft({...tutoradoDraft, documento: e.target.value})} placeholder="Cédula Tutorado" className="w-full px-3 py-2 border rounded text-sm outline-none" /></div>
                    <button type="button" onClick={buscarTutoradoDraft} className="bg-white border border-gray-300 px-5 rounded font-semibold hover:bg-gray-50 text-xs text-gray-700 h-[38px]">Buscar</button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombres</label><input type="text" value={tutoradoDraft.nombres} onChange={(e) => setTutoradoDraft({...tutoradoDraft, nombres: limpiarTexto(e.target.value)})} className="w-full px-3 py-2 border rounded text-xs" disabled={tutoradoDraft.bloqueado}/></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Apellidos</label><input type="text" value={tutoradoDraft.apellidos} onChange={(e) => setTutoradoDraft({...tutoradoDraft, apellidos: limpiarTexto(e.target.value)})} className="w-full px-3 py-2 border rounded text-xs" disabled={tutoradoDraft.bloqueado}/></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Género</label><select value={tutoradoDraft.genero} onChange={(e) => setTutoradoDraft({...tutoradoDraft, genero: e.target.value})} className="w-full border px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">...</option><option value="M">M</option><option value="F">F</option></select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código</label><input type="text" value={tutoradoDraft.codigo} onChange={(e) => setTutoradoDraft({...tutoradoDraft, codigo: e.target.value})} className="w-full border px-3 py-2 border rounded text-xs" disabled={tutoradoDraft.bloqueado}/></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad</label><select value={tutoradoDraft.facultad} onChange={(e) => setTutoradoDraft({...tutoradoDraft, facultad: e.target.value})} className="w-full border px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">FACULTAD...</option>{catalogoFacultades.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Programa</label><select value={tutoradoDraft.programa} onChange={(e) => setTutoradoDraft({...tutoradoDraft, programa: e.target.value})} className="w-full border px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">PROGRAMA...</option>{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    
                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Riesgo Inicial</label><select value={tutoradoDraft.riesgo} onChange={(e) => setTutoradoDraft({...tutoradoDraft, riesgo: e.target.value})} className="w-full border px-3 py-2 rounded text-xs bg-white border-yellow-300 font-semibold"><option value="">SELECCIONE...</option><option value="BAJO">BAJO RENDIMIENTO</option><option value="ALTO">ALTO RIESGO DESERCIÓN</option></select></div>
                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Promedio Inicial</label><input type="number" step="0.1" value={tutoradoDraft.promedioInicio} onChange={(e) => setTutoradoDraft({...tutoradoDraft, promedioInicio: e.target.value})} className="w-full border px-3 py-2 rounded text-xs border-yellow-300 font-semibold" /></div>
                  </div>
                  <button type="button" onClick={agregarTutorado} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold w-full hover:bg-blue-700 transition">Añadir Tutorado a la Lista ↑</button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t"><button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-800 transition">Agrupar Tutoría Completa</button></div>
          </form>
        )}

        {/* ==========================================
            PANTALLA 4: FASE 2 (REPORTE FINAL)
        ========================================== */}
        {vistaActual === 'pantalla4' && reporteACompletar && (
          <form onSubmit={procesarReporteFinal} className="animate-fade-in max-w-5xl mx-auto pb-10">
            <div className="mb-8 border-b border-gray-100 pb-5 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-[#1B2631]">Gestión de Reporte Final (Cierre)</h3>
                <p className="text-gray-500 mt-1 text-sm">Diligencie las métricas para el reporte: <span className="font-bold text-[#EBB700] bg-yellow-50 px-2 rounded">{reporteACompletar.id}</span> | Periodo: {reporteACompletar.periodo}</p>
              </div>
            </div>

            {reporteACompletar.tutorias.map((tutoria) => (
               <div key={tutoria.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-[#1B2631] mb-8 relative">
                  <span className="absolute -top-3 left-4 bg-[#EBB700] text-[#1B2631] px-3 py-1 rounded text-xs font-bold shadow-sm">TUTORÍA: {tutoria.id}</span>
                  
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5 pt-2">
                     <div>
                        <h4 className="text-lg font-bold text-[#1B2631]">Tutor Par: {tutoria.tutorNombre}</h4>
                        <p className="text-xs text-gray-500 font-semibold tracking-wide">Asignatura: {tutoria.asignatura}</p>
                     </div>
                     <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 text-center">
                        <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">¿CUMPLIÓ LA LABOR?</label>
                        <select className="font-bold outline-none bg-transparent text-[#1B2631] text-sm border-b border-[#EBB700]" required>
                           <option value="">Dictamen...</option><option value="SI">SÍ CUMPLIÓ</option><option value="NO">NO CUMPLIÓ</option>
                        </select>
                     </div>
                  </div>

                  <h5 className="font-bold text-blue-800 text-xs mb-4 uppercase tracking-wider flex items-center">Evaluación Final de Tutorados ({tutoria.tutoradosList.length})</h5>
                  <div className="space-y-4">
                     {tutoria.tutoradosList.map((tutorado, idxTutorado) => (
                        <div key={idxTutorado} className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                           <p className="font-bold text-gray-800 mb-3 text-sm border-b border-gray-200 pb-2">{tutorado.nombres} {tutorado.apellidos} <span className="text-gray-500 font-normal text-xs ml-1">(ID: {tutorado.documento})</span></p>
                           
                           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-3">
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Fecha Inicio</label><input type="date" className="w-full px-2 py-1.5 border rounded text-xs outline-none bg-white" required /></div>
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Fecha Fin</label><input type="date" className="w-full px-2 py-1.5 border rounded text-xs outline-none bg-white" required /></div>
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Tot. Sesiones</label><input type="number" min="0" placeholder="Ej: 12" className="w-full px-2 py-1.5 border rounded text-xs outline-none bg-white" required /></div>
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Nota Final</label><input type="number" step="0.1" placeholder="Ej: 4.5" className="w-full px-2 py-1.5 border rounded text-xs outline-none font-bold bg-white text-blue-700" required /></div>
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase">¿Cargado SIRE?</label><select className="w-full px-2 py-1.5 border rounded text-xs outline-none bg-white" required><option value="">...</option><option value="SI">SÍ</option><option value="NO">NO</option></select></div>
                              <div className="col-span-2 lg:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase">Observaciones</label><input type="text" placeholder="Novedades..." className="w-full px-2 py-1.5 border rounded text-xs outline-none bg-white" /></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}

            <div className="flex gap-4 justify-end border-t border-gray-100 pt-6 mt-8">
               <button type="button" onClick={volverAListado} className="px-6 py-2.5 bg-gray-100 font-semibold text-sm rounded-lg hover:bg-gray-200 transition text-gray-700">Cancelar Cierre</button>
               {/* BOTÓN PDF FASE 2 */}
               <button type="button" onClick={() => simularDescargaPDF(reporteACompletar.id)} className="px-6 py-2.5 bg-red-50 text-red-700 font-semibold text-sm border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Exportar a PDF
               </button>
               <button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 font-semibold text-sm rounded-lg hover:bg-gray-800 shadow-sm flex items-center transition">
                  Completar y Guardar Reporte Final
               </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Reportes;