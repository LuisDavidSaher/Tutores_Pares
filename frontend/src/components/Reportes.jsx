import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';

const enviarAuditoria = async (usuario, modulo, accion, detalle, estado = "Éxito") => {
  try {
    await apiFetch('/api/auditorias', {
      method: 'POST',
      body: JSON.stringify({ usuario, modulo, accion, detalle, estado })
    });
  } catch (e) {
    console.error("Error en registro de auditoría:", e);
  }
};

const limpiarTexto = (texto) => texto ? texto.toString().toUpperCase().trim() : "";

const prevenirComa = (eventoTeclado) => {
  if (eventoTeclado.key === ',') eventoTeclado.preventDefault();
};

const obtenerPeriodoAcademicoActual = () => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = fecha.getMonth();
  return `${año}-${mes < 6 ? 'I' : 'II'}`;
};

const Reportes = ({ usuarioActual = { rol: 'Jefe de Departamento', programa: 'INGENIERÍA DE SISTEMAS' } }) => {
  const [vistaActual, setVistaActual] = useState('pantalla1');
  const [listaReportes, setListaReportes] = useState([]);
  const [tutoriasBorrador, setTutoriasBorrador] = useState([]);

  const [filtroReportes, setFiltroReportes] = useState('');
  const [filtroTutorias, setFiltroTutorias] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const emailReal = usuarioActual.email || (usuarioActual.rol === 'Administrador' ? 'admin.prueba@unicartagena.edu.co' : 'jefe.sistemas@unicartagena.edu.co');
  const programaReal = usuarioActual.programa ? usuarioActual.programa.toUpperCase() : 'SISTEMAS';

  const correoUsuario = usuarioActual.rol === 'Administrador'
    ? `Administrador Global (${emailReal})`
    : `Jefe de ${programaReal} (${emailReal})`;

  const [catalogoFacultades, setCatalogoFacultades] = useState([]);
  const [catalogoCampus, setCatalogoCampus] = useState([]);
  const [catalogoProgramas, setCatalogoProgramas] = useState([]);
  const [catalogoAsignaturas, setCatalogoAsignaturas] = useState([]);

  const [formAsignatura, setFormAsignatura] = useState('');
  const [formPeriodo, setFormPeriodo] = useState(obtenerPeriodoAcademicoActual());

  const [tutorDoc, setTutorDoc] = useState('');
  const [tutorBloqueado, setTutorBloqueado] = useState(false);
  const [tutorConfirmado, setTutorConfirmado] = useState(false);

  const [tutorDatos, setTutorDatos] = useState({
    nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '',
    codigo: '', campus: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: 'CC'
  });

  const [tutorados, setTutorados] = useState([]);
  const [tutoradoDraft, setTutoradoDraft] = useState({
    documento: '', nombres: '', apellidos: '', genero: '', facultad: '', programa: '',
    codigo: '', campus: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: 'CC'
  });

  const [reporteACompletar, setReporteACompletar] = useState(null);
  const [filtroTutorFase2, setFiltroTutorFase2] = useState('');
  const [tutoriasExpandidasFase2, setTutoriasExpandidasFase2] = useState([]);

  // Estados modales
  const [modalTutoriaAbierto, setModalTutoriaAbierto] = useState(false);
  const [tutoriaSeleccionadaParaModal, setTutoriaSeleccionadaParaModal] = useState(null);
  const [modalHistoricoAbierto, setModalHistoricoAbierto] = useState(false);
  const [reporteHistoricoSeleccionado, setReporteHistoricoSeleccionado] = useState(null);

  const [tutoradoEnEdicion, setTutoradoEnEdicion] = useState(null);
  const [datosEdicion, setDatosEdicion] = useState({});

  const cargarDatosDesdeAPI = async () => {
    try {
      const [resCampus, resFacultades, resProgramas, resAsignaturas, resReportes] = await Promise.all([
        apiFetch('/api/campus'),
        apiFetch('/api/facultades'),
        apiFetch('/api/programas'),
        apiFetch('/api/asignaturas'),
        apiFetch('/api/reportes')
      ]);

      if (resCampus.ok) {
        const data = await resCampus.json();
        setCatalogoCampus(data.map(c => c.nombre));
      }
      if (resFacultades.ok) {
        const data = await resFacultades.json();
        setCatalogoFacultades(data.map(f => f.nombre));
      }
      if (resProgramas.ok) {
        const data = await resProgramas.json();
        setCatalogoProgramas(data.map(p => p.nombre));
      }
      if (resAsignaturas.ok) {
        const data = await resAsignaturas.json();
        setCatalogoAsignaturas(data.map(a => `${a.codigo} - ${a.nombre}`));
      }
      if (resReportes.ok) {
        const data = await resReportes.json();
        setListaReportes(data.reverse());
      }
    } catch (error) {
      console.error("Error en la obtención de catálogos:", error);
    }
  };

  useEffect(() => {
    cargarDatosDesdeAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroReportes]);

  // Controladores de navegación de vistas
  const volverAListado = () => { setVistaActual('pantalla1'); setFiltroReportes(''); cargarDatosDesdeAPI(); };
  const irAPantalla2 = () => { cargarDatosDesdeAPI(); setVistaActual('pantalla2'); setFiltroTutorias(''); };
  const irAPantalla3 = () => { cargarDatosDesdeAPI(); setVistaActual('pantalla3'); };

  const iniciarFase2 = (reporte) => {
    if (!reporte.tutorias || reporte.tutorias.length === 0) { 
      alert("Operación denegada: El reporte no contiene tutorías estructuradas."); 
      return; 
    }
    setReporteACompletar(reporte); 
    setFiltroTutorFase2(''); 
    setTutoriasExpandidasFase2([]); 
    setVistaActual('pantalla4');
  };

  const toggleExpandirTutoriaFase2 = (id) => {
    if (tutoriasExpandidasFase2.includes(id)) { 
      setTutoriasExpandidasFase2(tutoriasExpandidasFase2.filter(tId => tId !== id)); 
    } else { 
      setTutoriasExpandidasFase2([...tutoriasExpandidasFase2, id]); 
    }
  };

  // Controladores de modales
  const abrirModalTutoria = (tutoria) => {
    setTutoriaSeleccionadaParaModal(tutoria);
    setTutoradoEnEdicion(null);
    setModalTutoriaAbierto(true);
  };

  const cerrarModalTutoria = () => {
    setModalTutoriaAbierto(false);
    setTutoriaSeleccionadaParaModal(null);
    setTutoradoEnEdicion(null);
  };

  const abrirModalHistorico = (reporte) => {
    setReporteHistoricoSeleccionado(reporte);
    setModalHistoricoAbierto(true);
  };

  const cerrarModalHistorico = () => {
    setModalHistoricoAbierto(false);
    setReporteHistoricoSeleccionado(null);
  };

  // CRUD Tutorados en Modal
  const iniciarEdicionTutorado = (index, tutoradoActual) => {
    setTutoradoEnEdicion(index);
    setDatosEdicion({ ...tutoradoActual });
  };

  const guardarEdicionTutorado = () => {
    if (!datosEdicion.documento || !datosEdicion.nombres || !datosEdicion.apellidos) { 
      alert("Validación fallida: Datos obligatorios del tutorado ausentes."); 
      return; 
    }
    
    const nuevasTutorias = tutoriasBorrador.map(tut => {
      if (tut.id === tutoriaSeleccionadaParaModal.id) {
        const nuevaLista = [...tut.tutoradosList];
        nuevaLista[tutoradoEnEdicion] = { ...datosEdicion };
        const tutoriaActualizada = { ...tut, tutoradosList: nuevaLista };
        setTutoriaSeleccionadaParaModal(tutoriaActualizada);
        return tutoriaActualizada;
      }
      return tut;
    });
    
    setTutoriasBorrador(nuevasTutorias);
    setTutoradoEnEdicion(null);
  };

  const eliminarTutoradoInline = (index) => {
    if (!window.confirm("Confirme la desvinculación del tutorado de la tutoría en curso.")) return;
    
    const nuevasTutorias = tutoriasBorrador.map(tut => {
      if (tut.id === tutoriaSeleccionadaParaModal.id) {
        const nuevaLista = [...tut.tutoradosList];
        nuevaLista.splice(index, 1);
        const tutoriaActualizada = { ...tut, tutoradosList: nuevaLista, numeroTutorados: nuevaLista.length };
        setTutoriaSeleccionadaParaModal(tutoriaActualizada);
        return tutoriaActualizada;
      }
      return tut;
    });
    
    setTutoriasBorrador(nuevasTutorias);
  };

  const eliminarTutoriaBorrador = (tutoriaId) => {
    if (window.confirm("Confirme la eliminación definitiva de esta tutoría. Se descartarán las asignaciones de tutorados asociadas.")) {
      setTutoriasBorrador(tutoriasBorrador.filter(t => t.id !== tutoriaId));
      if (tutoriaSeleccionadaParaModal && tutoriaSeleccionadaParaModal.id === tutoriaId) {
        cerrarModalTutoria();
      }
    }
  };

  // Consultas e Inserciones a la API
  const buscarTutor = async () => {
    if (!tutorDoc) { alert("Parámetro requerido: Documento de identificación."); return; }

    const backupTipo = tutorDatos.tipoDoc;
    setTutorDatos({ nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '', codigo: '', campus: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: backupTipo });

    try {
      const respuesta = await apiFetch(`/api/estudiantes/${tutorDoc}`);

      if (respuesta.ok) {
        const datosEncontrados = await respuesta.json();
        const facultadValida = catalogoFacultades.includes(datosEncontrados.facultad) ? datosEncontrados.facultad : '';
        const programaValido = catalogoProgramas.includes(datosEncontrados.programa) ? datosEncontrados.programa : programaReal;
        const campusValido = catalogoCampus.includes(datosEncontrados.campus) ? datosEncontrados.campus : '';

        setTutorDatos(prev => ({
          ...prev,
          ...datosEncontrados,
          facultad: facultadValida,
          programa: programaValido,
          campus: campusValido
        }));

        if (!facultadValida || !programaValido || !campusValido) setTutorBloqueado(false);
        else setTutorBloqueado(true);
      } else {
        setTutorBloqueado(false);
        setTutorDatos(prev => ({ ...prev, programa: programaReal }));
        alert("Registro no encontrado en la base de datos central. Proceda con el registro manual.");
      }
    } catch (error) {
      console.error("Error en petición a la API:", error);
      setTutorBloqueado(false);
    }
  };

  const confirmarTutor = async () => {
    if (!tutorDatos.nombres || !tutorDatos.apellidos || !tutorDatos.promedio || !tutorDatos.notaAsignatura || !tutorDatos.programa || !tutorDatos.facultad || !tutorDatos.codigo) {
      alert("Validación fallida: Complete los campos obligatorios del registro."); return;
    }
    const dominioPermitido = "@unicartagena.edu.co";
    if (!tutorDatos.correo || !tutorDatos.correo.toLowerCase().endsWith(dominioPermitido)) {
      alert(`Validación de dominio fallida. Se requiere terminación en ${dominioPermitido}`); return;
    }

    if (!tutorBloqueado) {
      const nuevoEstudiante = {
        documento: tutorDoc, tipoDoc: tutorDatos.tipoDoc, nombres: tutorDatos.nombres, apellidos: tutorDatos.apellidos,
        genero: tutorDatos.genero, codigo: tutorDatos.codigo, campus: tutorDatos.campus, facultad: tutorDatos.facultad,
        programa: tutorDatos.programa, correo: tutorDatos.correo
      };
      try {
        await apiFetch('/api/estudiantes', { method: 'POST', body: JSON.stringify(nuevoEstudiante) });
        enviarAuditoria(correoUsuario, "ESTUDIANTES", "CREACIÓN", `Registro de Tutor en BD: ${tutorDatos.nombres} ${tutorDatos.apellidos}`);
      } catch (error) {
        console.error("Error en registro de entidad en BD:", error);
        enviarAuditoria(correoUsuario, "ESTUDIANTES", "ERROR", `Fallo al registrar Tutor en BD`, "Alerta");
      }
    }

    setTutorConfirmado(true);
  };

  const buscarTutoradoDraft = async () => {
    const doc = tutoradoDraft.documento;
    if (!doc) { alert("Parámetro requerido: Documento de identificación."); return; }

    const backupTipo = tutoradoDraft.tipoDoc;
    setTutoradoDraft({ documento: doc, nombres: '', apellidos: '', genero: '', facultad: '', programa: '', codigo: '', campus: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: backupTipo });

    try {
      const respuesta = await apiFetch(`/api/estudiantes/${doc}`);

      if (respuesta.ok) {
        const datosEncontrados = await respuesta.json();
        const facultadValida = catalogoFacultades.includes(datosEncontrados.facultad) ? datosEncontrados.facultad : '';
        const programaValido = catalogoProgramas.includes(datosEncontrados.programa) ? datosEncontrados.programa : programaReal;
        const campusValido = catalogoCampus.includes(datosEncontrados.campus) ? datosEncontrados.campus : '';

        setTutoradoDraft(prev => ({
          ...prev,
          ...datosEncontrados,
          facultad: facultadValida,
          programa: programaValido,
          campus: campusValido,
          bloqueado: (facultadValida && programaValido && campusValido) ? true : false
        }));
      } else {
        setTutoradoDraft(prev => ({ ...prev, bloqueado: false, programa: programaReal }));
        alert("Registro no encontrado en la base de datos central. Proceda con el registro manual.");
      }
    } catch (error) {
      console.error("Error en petición a la API:", error);
      setTutoradoDraft(prev => ({ ...prev, bloqueado: false }));
    }
  };

  const agregarTutorado = async () => {
    if (!tutoradoDraft.documento || !tutoradoDraft.nombres || !tutoradoDraft.apellidos || !tutoradoDraft.genero || !tutoradoDraft.promedioInicio || !tutoradoDraft.programa || !tutoradoDraft.codigo || !tutoradoDraft.campus) {
      alert("Validación fallida: Complete los campos obligatorios del registro."); return;
    }

    if (!tutoradoDraft.bloqueado) {
      const nuevoEstudiante = {
        documento: tutoradoDraft.documento, tipoDoc: tutoradoDraft.tipoDoc, nombres: tutoradoDraft.nombres, apellidos: tutoradoDraft.apellidos,
        genero: tutoradoDraft.genero, codigo: tutoradoDraft.codigo, campus: tutoradoDraft.campus, facultad: tutoradoDraft.facultad,
        programa: tutoradoDraft.programa, correo: tutoradoDraft.correo || ''
      };
      try {
        await apiFetch('/api/estudiantes', { method: 'POST', body: JSON.stringify(nuevoEstudiante) });
        enviarAuditoria(correoUsuario, "ESTUDIANTES", "CREACIÓN", `Registro de Tutorado en BD: ${tutoradoDraft.nombres} ${tutoradoDraft.apellidos}`);
      } catch (error) {
        console.error("Error en registro de entidad en BD:", error);
      }
    }

    const nuevoTutorado = { ...tutoradoDraft, idInterno: new Date().getTime() };
    setTutorados([...tutorados, nuevoTutorado]);
    setTutoradoDraft({ documento: '', nombres: '', apellidos: '', genero: '', facultad: '', programa: '', codigo: '', campus: '', correo: '', riesgo: '', promedioInicio: '', bloqueado: false, tipoDoc: 'CC' });
  };

  const agruparTutoria = (e) => {
    e.preventDefault();
    if (!tutorConfirmado || !formAsignatura) {
      alert("Operación denegada: Estructuración incompleta. Faltan datos del tutor o asignatura.");
      return;
    }

    if (tutorados.length === 0) {
      alert("Operación denegada: La tutoría debe contener al menos un tutorado asignado.");
      return;
    }

    if (!catalogoAsignaturas.includes(formAsignatura)) {
      alert("Validación de integridad fallida: La asignatura seleccionada no existe en el catálogo.");
      return;
    }

    const indexExistente = tutoriasBorrador.findIndex(tut => tut.tutorDoc === tutorDoc && tut.asignatura === formAsignatura);

    if (indexExistente !== -1) {
      const nuevasTutorias = [...tutoriasBorrador];
      const tutoriaExistente = nuevasTutorias[indexExistente];
      const listaCombinada = [...tutoriaExistente.tutoradosList, ...tutorados];
      nuevasTutorias[indexExistente] = { ...tutoriaExistente, tutoradosList: listaCombinada, numeroTutorados: listaCombinada.length };
      setTutoriasBorrador(nuevasTutorias);
    } else {
      setTutoriasBorrador([...tutoriasBorrador, {
        id: `Borrador-${tutoriasBorrador.length + 1}`, tutorDoc: tutorDoc, asignatura: formAsignatura, tutorNombre: `${tutorDatos.nombres} ${tutorDatos.apellidos}`, numeroTutorados: tutorados.length, tutoradosList: tutorados
      }]);
    }

    enviarAuditoria(correoUsuario, "REPORTES", "CREACIÓN", `Estructuración de tutoría de ${formAsignatura} con ${tutorados.length} tutorado(s)`);
    setTutorConfirmado(false); setTutorDoc(''); setTutorados([]);
    setTutorDatos({ nombres: '', apellidos: '', genero: '', telefono: '', facultad: '', programa: '', codigo: '', campus: '', correo: '', promedio: '', notaAsignatura: '', tipoDoc: 'CC' });
    setVistaActual('pantalla2');
  };

  const guardarReporteInicial = async () => {
    if (tutoriasBorrador.length === 0) return;

    const programaVinculado = usuarioActual.rol === 'Jefe de Departamento' ? programaReal : 'MULTI-PROGRAMA (ADMIN)';

    const nuevoReporte = {
      id: `REP-TEMP`,
      periodo: formPeriodo,
      programaReporte: programaVinculado,
      estado: 'Inicial',
      tutorias: tutoriasBorrador
    };

    try {
      const respuesta = await apiFetch('/api/reportes', {
        method: 'POST',
        body: JSON.stringify(nuevoReporte)
      });

      if (respuesta.ok) {
        enviarAuditoria(correoUsuario, "REPORTES", "CREACIÓN", `Persistencia de Reporte Inicial en Base de Datos`);
        setTutoriasBorrador([]);
        volverAListado();
      } else {
        alert("Fallo de transacción en la persistencia del reporte.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al servidor de base de datos.");
    }
  };

  const handleDictamenChange = (tutoriaId, valor) => {
    setReporteACompletar(prev => {
      if (!prev) return prev;
      const nuevasTutorias = prev.tutorias.map(tut =>
        tut.id === tutoriaId ? { ...tut, dictamen: valor } : tut
      );
      return { ...prev, tutorias: nuevasTutorias };
    });
  };

  const handleEvaluacionChange = (tutoriaId, tutoradoIdx, campo, valor) => {
    setReporteACompletar(prev => {
      if (!prev) return prev;
      const nuevasTutorias = prev.tutorias.map(tut => {
        if (tut.id === tutoriaId) {
          const nuevosTutorados = [...tut.tutoradosList];
          nuevosTutorados[tutoradoIdx] = {
            ...nuevosTutorados[tutoradoIdx],
            [campo]: valor
          };
          return { ...tut, tutoradosList: nuevosTutorados };
        }
        return tut;
      });
      return { ...prev, tutorias: nuevasTutorias };
    });
  };

  const procesarReporteFinal = async (e) => {
    e.preventDefault();

    let hayErrores = false;
    reporteACompletar.tutorias.forEach(tut => {
      if (!tut.dictamen) hayErrores = true;
      tut.tutoradosList.forEach(td => {
        if (!td.fechaInicio || !td.fechaFin || !td.totalSesiones || !td.notaFinal || !td.promAcumFinal || !td.cargadoSire) {
          hayErrores = true;
        }
      });
    });

    if (hayErrores) {
      alert("Operación denegada: Se requieren métricas completas para el cierre del reporte.");
      return;
    }

    try {
      const reporteActualizado = { ...reporteACompletar, estado: 'Final' };

      const respuesta = await apiFetch(`/api/reportes/${reporteACompletar.id}`, {
        method: 'PUT',
        body: JSON.stringify(reporteActualizado)
      });

      if (respuesta.ok) {
        enviarAuditoria(correoUsuario, "REPORTES", "EDICIÓN", `Cierre de Reporte Final ID: ${reporteACompletar.id}`);
        volverAListado();
      } else {
        alert("Fallo de transacción en la actualización del reporte.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al servidor de base de datos.");
    }
  };

  // Lógica de Renderizado y Filtrado
  const reportesFiltrados = listaReportes
    .filter(r => r.id.toLowerCase().includes(filtroReportes.toLowerCase()) || r.periodo.toLowerCase().includes(filtroReportes.toLowerCase()))
    .filter(r => usuarioActual.rol === 'Administrador' ? true : r.programaReporte.toUpperCase() === programaReal);

  const totalPaginasRep = Math.ceil(reportesFiltrados.length / itemsPorPagina) || 1;
  const indUltimo = paginaActual * itemsPorPagina;
  const indPrimer = indUltimo - itemsPorPagina;
  const reportesActuales = reportesFiltrados.slice(indPrimer, indUltimo);

  const tutoriasFiltradas = tutoriasBorrador.filter(t => t.tutorNombre.toLowerCase().includes(filtroTutorias.toLowerCase()) || t.asignatura.toLowerCase().includes(filtroTutorias.toLowerCase()) || t.id.toLowerCase().includes(filtroTutorias.toLowerCase()));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen relative">

      {/* ENCABEZADO GLOBAL */}
      <div className="bg-udc-primary p-6 text-white flex justify-between items-center rounded-t-xl border-b-4 border-udc-secondary">
        <div>
          <h2 className="text-xl font-bold tracking-wide">Gestión de Reportes (SGTP)</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
            {usuarioActual.rol === 'Jefe de Departamento' ? `Programa: ${programaReal}` : 'Panel de Administración Global'}
          </p>
        </div>
        {vistaActual !== 'pantalla1' && (
          <button onClick={volverAListado} className="flex items-center text-sm font-semibold text-udc-secondary hover:text-yellow-400 transition-colors border border-udc-secondary px-4 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver
          </button>
        )}
      </div>

      <div className="p-8">

        {/* VISTA 1: LISTADO PRINCIPAL */}
        {vistaActual === 'pantalla1' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6 gap-4">
              <div className="flex-1 w-full flex flex-col md:flex-row gap-4 items-center">
                <h3 className="text-xl font-bold text-udc-primary whitespace-nowrap">Listado de reportes</h3>
                <input type="text" placeholder="Búsqueda por Identificador o Periodo..." value={filtroReportes} onChange={(e) => setFiltroReportes(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-md outline-none focus:ring-1 focus:ring-udc-secondary" />
              </div>
              <button onClick={irAPantalla2} className="bg-udc-secondary text-udc-primary px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition-all text-sm shadow-sm flex items-center whitespace-nowrap">
                <span className="text-lg mr-2 leading-none">+</span> Crear Nuevo Reporte
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-udc-primary text-white text-xs uppercase font-semibold">
                  <tr><th className="p-4">Identificador</th><th className="p-4">Programa</th><th className="p-4">Periodo Académico</th><th className="p-4 text-center">Tutorías Agrupadas</th><th className="p-4 text-center">Estado</th><th className="p-4 text-center">Acciones</th></tr>
                </thead>
                <tbody className="text-sm divide-y bg-white">
                  {reportesActuales.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50">
                      <td className="p-4 font-semibold text-udc-primary">
                        {rep.id.split('-').slice(0, 3).join('-')}
                      </td>
                      <td className="p-4 font-semibold text-gray-600 text-xs">{rep.programaReporte}</td>
                      <td className="p-4 font-medium text-gray-600">{rep.periodo}</td>
                      <td className="p-4 text-center font-bold text-blue-600">{rep.tutorias ? rep.tutorias.length : 0}</td>
                      <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${rep.estado === 'Final' ? 'bg-gray-200 text-gray-700 border border-gray-300' : 'bg-green-50 text-green-700 border border-green-200'}`}>{rep.estado}</span></td>
                      
                      <td className="p-4 flex justify-center items-center gap-2">
                        {rep.estado === 'Inicial' ? (
                          <button onClick={() => iniciarFase2(rep)} className="px-4 py-1.5 rounded border text-xs font-bold bg-white text-udc-primary border-gray-300 hover:bg-gray-100 transition-all shadow-sm whitespace-nowrap">Ejecutar Cierre</button>
                        ) : (
                          <button onClick={() => abrirModalHistorico(rep)} className="text-udc-secondary hover:text-yellow-600 font-bold text-sm underline whitespace-nowrap">
                            Ver Detalles
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reportesActuales.length === 0 && <tr><td colSpan="6" className="text-center p-8 text-gray-500">No se encontraron reportes en el sistema.</td></tr>}
                </tbody>
              </table>
              {/* COMPONENTE DE PAGINACIÓN */}
              {reportesFiltrados.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    Mostrando {indPrimer + 1} - {Math.min(indUltimo, reportesFiltrados.length)} de {reportesFiltrados.length} registros
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} className="px-4 py-2 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50">ANTERIOR</button>
                    <span className="px-4 py-2 text-xs font-bold text-gray-700">Pág. {paginaActual} / {totalPaginasRep}</span>
                    <button onClick={() => setPaginaActual(p => Math.min(totalPaginasRep, p + 1))} disabled={paginaActual === totalPaginasRep} className="px-4 py-2 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50">SIGUIENTE</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VISTA 2: ESTRUCTURACIÓN DE TUTORÍAS */}
        {vistaActual === 'pantalla2' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6 gap-4">
              <div className="flex-1 w-full flex flex-col md:flex-row gap-4 items-center">
                <h3 className="text-xl font-bold text-udc-primary whitespace-nowrap">Tutorías Estructuradas</h3>
                <input type="text" placeholder="Búsqueda por Identificador o Asignatura..." value={filtroTutorias} onChange={(e) => setFiltroTutorias(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full max-w-md outline-none focus:ring-1 focus:ring-udc-secondary" />
              </div>
              <button onClick={irAPantalla3} className="bg-udc-secondary text-udc-primary px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition-all text-sm shadow-sm flex items-center whitespace-nowrap">
                <span className="text-lg mr-2 leading-none">+</span> Estructurar Tutoría
              </button>
            </div>

            {tutoriasFiltradas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 mx-auto max-w-2xl">
                <div className="text-4xl text-gray-300 mb-3 font-light">+</div><p className="text-udc-primary font-medium text-base">Directorio de tutorías vacío.</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-udc-primary text-white text-xs uppercase font-semibold">
                    <tr><th className="p-4">Identificador</th><th className="p-4">Tutor Par</th><th className="p-4">Asignatura</th><th className="p-4 text-center">Tutorados Asignados</th><th className="p-4 text-center">Gestión</th></tr>
                  </thead>
                  <tbody className="text-sm divide-y bg-white">
                    {tutoriasFiltradas.map((tut) => (
                      <tr key={tut.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-udc-primary">{tut.id}</td>
                        <td className="p-4 font-medium text-gray-800">{tut.tutorNombre}</td>
                        <td className="p-4 text-gray-600">{tut.asignatura}</td>
                        <td className="p-4 text-center font-black text-udc-primary text-lg">{tut.numeroTutorados}</td>
                        <td className="p-4 text-center space-x-3">
                          <button onClick={() => abrirModalTutoria(tut)} className="text-udc-secondary hover:text-yellow-600 font-bold text-sm underline whitespace-nowrap">
                            Detalles
                          </button>
                          <button onClick={() => eliminarTutoriaBorrador(tut.id)} className="text-red-500 hover:text-red-700 font-bold text-sm underline whitespace-nowrap">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tutoriasBorrador.length > 0 && (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button onClick={guardarReporteInicial} className="bg-udc-primary text-white px-8 py-3 rounded-lg font-bold shadow-sm flex items-center text-sm hover:bg-gray-800 transition">
                  Confirmar Persistencia de Datos
                </button>
              </div>
            )}
          </div>
        )}

        {/* VISTA 3: FORMULARIO DE ESTRUCTURACIÓN */}
        {vistaActual === 'pantalla3' && (
          <form onSubmit={agruparTutoria} className="animate-fade-in max-w-6xl mx-auto space-y-6">
            <div className="text-center mb-6"><h3 className="text-2xl font-bold text-udc-primary">Estructuración de Parámetros de Tutoría</h3></div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Asignatura</label>
                  <select
                    value={formAsignatura}
                    onChange={(e) => setFormAsignatura(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-medium outline-none bg-white text-sm focus:border-udc-primary focus:ring-1 focus:ring-udc-primary"
                    required
                    disabled={tutorConfirmado}
                  >
                    <option value="">Seleccione Asignatura Base...</option>
                    {catalogoAsignaturas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Periodo Académico Actual</label>
                  <select value={formPeriodo} onChange={(e) => setFormPeriodo(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg font-medium outline-none bg-white text-sm focus:border-udc-primary" required disabled={tutorConfirmado}>
                    <option value={obtenerPeriodoAcademicoActual()}>{obtenerPeriodoAcademicoActual()}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-xl border border-gray-200 border-t-4 border-t-udc-secondary shadow-sm">
              <h4 className="font-bold text-udc-primary mb-5">Validación de Identidad: Tutor Par</h4>

              <div className="flex gap-2 mb-6 border-b border-gray-100 pb-6 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tipo Doc.</label>
                  <select value={tutorDatos.tipoDoc} onChange={(e) => setTutorDatos({ ...tutorDatos, tipoDoc: e.target.value })} className="w-16 px-2 py-2.5 border border-gray-300 rounded-lg text-xs bg-gray-50 font-bold focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option><option value="PEP">PEP</option></select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Número de Identificación</label>
                  <input type="number" value={tutorDoc} onChange={(e) => setTutorDoc(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-gray-50 font-bold focus:border-udc-secondary" disabled={tutorConfirmado} required />
                </div>
                <button type="button" onClick={buscarTutor} disabled={tutorConfirmado} className="bg-gray-200 border border-gray-300 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-300 transition text-gray-800 h-[38px]">Consultar Directorio</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombres</label><input type="text" value={tutorDatos.nombres} onChange={(e) => setTutorDatos({ ...tutorDatos, nombres: limpiarTexto(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required /></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Apellidos</label><input type="text" value={tutorDatos.apellidos} onChange={(e) => setTutorDatos({ ...tutorDatos, apellidos: limpiarTexto(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código Estudiantil</label><input type="text" value={tutorDatos.codigo} onChange={(e) => setTutorDatos({ ...tutorDatos, codigo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Género</label><select value={tutorDatos.genero} onChange={(e) => setTutorDatos({ ...tutorDatos, genero: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required><option value="">---</option><option value="M">M</option><option value="F">F</option></select></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Número de Contacto</label><input type="tel" value={tutorDatos.telefono} onChange={(e) => setTutorDatos({ ...tutorDatos, telefono: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required /></div>

                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad de Adscripción</label>
                  {catalogoFacultades.length === 0 ? <span className="text-xs text-red-500 font-bold block mt-2">Catálogo vacío.</span> :
                    <select value={tutorDatos.facultad} onChange={(e) => setTutorDatos({ ...tutorDatos, facultad: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required><option value="">SELECCIONE FACULTAD...</option>{catalogoFacultades.map(f => <option key={f} value={f}>{f}</option>)}</select>}
                </div>

                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Programa Académico</label>
                  {catalogoProgramas.length === 0 ? <span className="text-xs text-red-500 font-bold block mt-2">Catálogo vacío.</span> :
                    <select value={tutorDatos.programa} onChange={(e) => setTutorDatos({ ...tutorDatos, programa: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required><option value="">SELECCIONE PROGRAMA...</option>{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select>}
                </div>

                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Campus</label>
                  {catalogoCampus.length === 0 ? <span className="text-xs text-red-500 font-bold block mt-2">Catálogo vacío.</span> :
                    <select value={tutorDatos.campus} onChange={(e) => setTutorDatos({ ...tutorDatos, campus: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required><option value="">SELECCIONE CAMPUS...</option>{catalogoCampus.map(s => <option key={s} value={s}>{s}</option>)}</select>}
                </div>

                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Correo Institucional</label><input type="email" value={tutorDatos.correo} onChange={(e) => setTutorDatos({ ...tutorDatos, correo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-udc-primary" disabled={tutorBloqueado || tutorConfirmado} required /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Promedio Acumulado Actual</label>
                  <input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={tutorDatos.promedio} onChange={(e) => setTutorDatos({ ...tutorDatos, promedio: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-sm bg-white focus:border-udc-primary" disabled={tutorConfirmado} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Nota Histórica en Asignatura</label>
                  <input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={tutorDatos.notaAsignatura} onChange={(e) => setTutorDatos({ ...tutorDatos, notaAsignatura: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-sm bg-white text-udc-primary" disabled={tutorConfirmado || !formAsignatura} required />
                </div>
              </div>

              {!tutorConfirmado ? (
                <button type="button" onClick={confirmarTutor} className="mt-5 bg-udc-primary text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition shadow">Validar Identidad y Asignar Rol Tutor</button>
              ) : (
                <div className="mt-5 text-udc-primary font-semibold text-xs bg-gray-100 p-3 rounded border border-gray-300 flex justify-between items-center"><span> Verificación Completa.</span> <button type="button" onClick={() => setTutorConfirmado(false)} className="underline font-bold">Modificar Entidad</button></div>
              )}
            </div>

            {/* SECCIÓN VINCULACIÓN DE TUTORADOS */}
            {tutorConfirmado && (
              <div className="bg-white p-7 rounded-xl border border-gray-200 border-t-4 border-t-gray-400 shadow-sm">
                <div className="flex justify-between items-center mb-5"><h4 className="font-bold text-udc-primary">Directorio de Tutorados Asignados</h4><span className="bg-gray-200 text-gray-800 font-bold px-3 py-1 rounded-full text-xs">{tutorados.length}</span></div>

                {tutorados.map((t, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-2 text-xs flex justify-between items-center">
                    <span><span className="font-bold text-udc-primary">{t.nombres} {t.apellidos}</span> (Cód: {t.codigo}) - Promedio de Ingreso: {t.promedioInicio} - Nivel de Riesgo: {t.riesgo}</span>
                    <button type="button" onClick={() => { const nl = [...tutorados]; nl.splice(idx, 1); setTutorados(nl); }} className="text-gray-500 hover:text-red-500 font-bold px-2 rounded transition">Eliminar</button>
                  </div>
                ))}

                <div className="bg-gray-50 p-5 rounded-xl mt-6 border border-gray-200 space-y-4">
                  <h5 className="text-xs font-bold text-gray-800 uppercase mb-2">Formulario de Asignación de Tutorado</h5>
                  <div className="flex gap-2 items-end">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tipo Doc.</label><select value={tutoradoDraft.tipoDoc} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, tipoDoc: e.target.value })} className="w-16 px-2 py-2.5 border border-gray-300 rounded text-xs bg-white font-bold"><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option></select></div>
                    <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Número de Identificación</label><input type="number" value={tutoradoDraft.documento} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, documento: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-udc-primary" /></div>
                    <button type="button" onClick={buscarTutoradoDraft} className="bg-gray-200 border border-gray-300 px-5 rounded font-semibold hover:bg-gray-300 text-xs text-gray-800 h-[38px] transition">Consultar</button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombres</label><input type="text" value={tutoradoDraft.nombres} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, nombres: limpiarTexto(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-udc-primary" disabled={tutoradoDraft.bloqueado} /></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Apellidos</label><input type="text" value={tutoradoDraft.apellidos} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, apellidos: limpiarTexto(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-udc-primary" disabled={tutoradoDraft.bloqueado} /></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Género</label><select value={tutoradoDraft.genero} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, genero: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">---</option><option value="M">M</option><option value="F">F</option></select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código Estudiantil</label><input type="text" value={tutoradoDraft.codigo} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, codigo: e.target.value })} className="w-full border border-gray-300 px-3 py-2 border rounded text-xs" disabled={tutoradoDraft.bloqueado} /></div>

                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad</label><select value={tutoradoDraft.facultad} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, facultad: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">SELECCIONE...</option>{catalogoFacultades.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Programa</label><select value={tutoradoDraft.programa} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, programa: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">SELECCIONE...</option>{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Campus</label><select value={tutoradoDraft.campus} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, campus: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white" disabled={tutoradoDraft.bloqueado}><option value="">SELECCIONE...</option>{catalogoCampus.map(s => <option key={s} value={s}>{s}</option>)}</select></div>

                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Índice de Riesgo</label><select value={tutoradoDraft.riesgo} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, riesgo: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded text-xs bg-white focus:border-udc-primary font-bold text-yellow-700"><option value="">SELECCIONE RIESGO...</option><option value="BAJO">BAJO RENDIMIENTO</option><option value="ALTO">ALTO RIESGO</option></select></div>
                    <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Promedio Inicial</label><input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={tutoradoDraft.promedioInicio} onChange={(e) => setTutoradoDraft({ ...tutoradoDraft, promedioInicio: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded text-xs font-bold focus:border-udc-primary" /></div>
                  </div>
                  <button type="button" onClick={agregarTutorado} className="bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold w-full hover:bg-gray-300 transition">Ejecutar Vinculación</button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200"><button type="submit" className="bg-udc-primary text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800 transition">Finalizar Estructuración de Tutoría</button></div>
          </form>
        )}

        {/* VISTA 4: GESTIÓN DE CIERRE DE REPORTE */}
        {vistaActual === 'pantalla4' && reporteACompletar && (
          <div className="animate-fade-in max-w-5xl mx-auto pb-10">
            <div className="mb-8 border-b border-gray-200 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-udc-primary">Métricas Finales de Tutoría</h3>
                <p className="text-gray-500 mt-1 text-sm">Registro de métricas para reporte: <span className="font-bold text-udc-secondary bg-yellow-50 px-2 rounded">{reporteACompletar.id.split('-').slice(0, 3).join('-')}</span> | Periodo Académico: {reporteACompletar.periodo}</p>
              </div>
              <div className="w-full md:w-72">
                <input type="text" placeholder="Búsqueda indexada por Tutor..." value={filtroTutorFase2} onChange={(e) => setFiltroTutorFase2(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-udc-primary bg-white transition-colors" />
              </div>
            </div>

            <form onSubmit={procesarReporteFinal}>

              {reporteACompletar.tutorias
                .filter(t => t.tutorNombre.toLowerCase().includes(filtroTutorFase2.toLowerCase()))
                .map((tutoria) => (
                  <div key={tutoria.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-udc-primary mb-3">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                      <div className="flex-1 cursor-pointer w-full" onClick={() => toggleExpandirTutoriaFase2(tutoria.id)}>
                        <div className="flex items-center gap-2">
                          <span className="bg-udc-secondary text-udc-primary px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap">{tutoria.id}</span>
                          <h4 className="text-sm font-bold text-udc-primary hover:text-udc-secondary transition-colors truncate">{tutoria.tutorNombre}</h4>
                          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">({tutoriasExpandidasFase2.includes(tutoria.id) ? 'Ocultar Componente' : 'Ver Componente'})</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-semibold tracking-wide mt-1 truncate">Asignatura Base: {tutoria.asignatura} | Tutorados Vinculados: {tutoria.tutoradosList.length}</p>
                      </div>

                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-udc-secondary w-full md:w-auto justify-between">
                        <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider m-0">Dictamen Final:</label>
                        <select value={tutoria.dictamen || ''} onChange={(e) => handleDictamenChange(tutoria.id, e.target.value)} className="font-bold outline-none bg-transparent text-udc-primary text-xs border-b border-udc-secondary m-0" required>
                          <option value="">Selección de Estado...</option><option value="SI">CUMPLIÓ REQUISITOS</option><option value="NO">NO CUMPLIÓ REQUISITOS</option>
                        </select>
                      </div>
                    </div>

                    {tutoriasExpandidasFase2.includes(tutoria.id) && (
                      <div className="mt-4 border-t border-gray-100 pt-4 animate-fade-in">
                        <h5 className="font-bold text-udc-primary text-xs mb-4 uppercase tracking-wider flex items-center border-b border-gray-100 pb-2">Matriz de Evaluación de Tutorados</h5>
                        <div className="space-y-6">
                          {tutoria.tutoradosList.map((tutorado, idxTutorado) => (
                            <div key={tutorado.idInterno || idxTutorado} className="bg-gray-50 p-5 rounded-lg border border-gray-200 border-t-2 border-t-udc-primary">
                              <p className="font-bold text-gray-800 mb-4 text-sm">{tutorado.nombres} {tutorado.apellidos} <span className="text-gray-500 font-normal text-xs ml-1">(Identificador: {tutorado.documento})</span></p>

                              <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-4">
                                <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Registro Inicial</label><input type="date" value={tutorado.fechaInicio || ''} onChange={(e) => handleEvaluacionChange(tutoria.id, idxTutorado, 'fechaInicio', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required /></div>
                                <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Registro Final</label><input type="date" value={tutorado.fechaFin || ''} onChange={(e) => handleEvaluacionChange(tutoria.id, idxTutorado, 'fechaFin', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required /></div>
                                <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Volumen Sesiones</label><input type="number" min="0" placeholder="Ej: 12" value={tutorado.totalSesiones || ''} onChange={(e) => handleEvaluacionChange(tutoria.id, idxTutorado, 'totalSesiones', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required /></div>
                                <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nota Calificación</label><input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} placeholder="Ej: 4.5" value={tutorado.notaFinal || ''} onChange={(e) => handleEvaluacionChange(tutoria.id, idxTutorado, 'notaFinal', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none font-bold bg-white focus:border-udc-primary" required /></div>
                                <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Promedio General</label><input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} placeholder="Ej: 4.2" value={tutorado.promAcumFinal || ''} onChange={(e) => handleEvaluacionChange(tutoria.id, idxTutorado, 'promAcumFinal', e.target.value)} className="w-full px-3 py-2 border border-yellow-300 rounded text-xs outline-none font-bold text-yellow-700 bg-yellow-50 focus:border-udc-secondary" required /></div>
                                <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Validación en SIRE</label><select value={tutorado.cargadoSire || ''} onChange={(e) => handleEvaluacionChange(tutoria.id, idxTutorado, 'cargadoSire', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white" required><option value="">Estado...</option><option value="SI">SÍ</option><option value="NO">NO</option></select></div>
                              </div>

                              <div className="mt-4">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Registro de Novedades de Seguimiento</label>
                                <textarea rows="2" placeholder="Registro detallado de variaciones en el proceso de acompañamiento..." value={tutorado.observaciones || ''} onChange={(e) => handleEvaluacionChange(tutoria.id, idxTutorado, 'observaciones', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none bg-white focus:border-udc-primary resize-y"></textarea>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              <div className="flex gap-4 justify-end border-t border-gray-200 pt-6 mt-8">
                <button type="button" onClick={volverAListado} className="px-6 py-2.5 bg-gray-100 font-bold text-sm rounded-lg hover:bg-gray-200 transition text-gray-700 border border-gray-300">Revertir Operación</button>
                <button type="submit" className="bg-udc-primary text-white px-8 py-2.5 font-bold text-sm rounded-lg hover:bg-gray-800 shadow-sm flex items-center transition">
                  Confirmar Finalización de Reporte
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* COMPONENTE MODAL: DETALLES DE ESTRUCTURACIÓN */}
      {modalTutoriaAbierto && tutoriaSeleccionadaParaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

            <div className="bg-udc-primary px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="text-lg font-bold">Resumen Paramétrico de Tutoría <span className="bg-udc-secondary text-udc-primary px-2 py-0.5 rounded text-xs ml-2">{tutoriaSeleccionadaParaModal.id}</span></h3>
                <p className="text-xs text-gray-300 mt-1">Entidad Tutor: {tutoriaSeleccionadaParaModal.tutorNombre} | Asignatura Vinculada: {tutoriaSeleccionadaParaModal.asignatura}</p>
              </div>
              <button onClick={cerrarModalTutoria} className="text-gray-300 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              <h4 className="font-bold text-sm text-udc-primary mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">Directorio de Tutorados Asignados ({tutoriaSeleccionadaParaModal.tutoradosList.length})</h4>

              {tutoriaSeleccionadaParaModal.tutoradosList.length === 0 ? (
                <p className="text-center text-gray-500 italic py-8">Ausencia de datos en el directorio actual.</p>
              ) : (
                <div className="space-y-4">
                  {tutoriaSeleccionadaParaModal.tutoradosList.map((tutorado, index) => (
                    <div key={tutorado.idInterno || index} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                      {tutoradoEnEdicion === index ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tipo Doc.</label><select value={datosEdicion.tipoDoc} onChange={(e) => setDatosEdicion({ ...datosEdicion, tipoDoc: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded"><option value="CC">CC</option><option value="TI">TI</option><option value="CE">CE</option></select></div>
                            <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Identificador</label><input type="text" value={datosEdicion.documento} onChange={(e) => setDatosEdicion({ ...datosEdicion, documento: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded" /></div>
                            <div className="col-span-3"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombres</label><input type="text" value={datosEdicion.nombres} onChange={(e) => setDatosEdicion({ ...datosEdicion, nombres: limpiarTexto(e.target.value) })} className="w-full border px-2 py-1.5 text-xs rounded" /></div>
                            <div className="col-span-3"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Apellidos</label><input type="text" value={datosEdicion.apellidos} onChange={(e) => setDatosEdicion({ ...datosEdicion, apellidos: limpiarTexto(e.target.value) })} className="w-full border px-2 py-1.5 text-xs rounded" /></div>
                            <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Género</label><select value={datosEdicion.genero} onChange={(e) => setDatosEdicion({ ...datosEdicion, genero: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded"><option value="M">M</option><option value="F">F</option></select></div>
                            <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Código Estudiantil</label><input type="text" value={datosEdicion.codigo} onChange={(e) => setDatosEdicion({ ...datosEdicion, codigo: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded" /></div>
                            <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sede Campus</label><select value={datosEdicion.campus} onChange={(e) => setDatosEdicion({ ...datosEdicion, campus: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded"><option value="">SELECCIONE...</option>{catalogoCampus.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                            <div className="col-span-3"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Programa</label><select value={datosEdicion.programa} onChange={(e) => setDatosEdicion({ ...datosEdicion, programa: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded">{catalogoProgramas.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                            <div className="col-span-3 lg:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Índice Riesgo</label><select value={datosEdicion.riesgo} onChange={(e) => setDatosEdicion({ ...datosEdicion, riesgo: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded font-bold text-yellow-700"><option value="BAJO">BAJO RENDIMIENTO</option><option value="ALTO">ALTO RIESGO</option></select></div>
                            <div className="col-span-3 lg:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Prom. Inicio</label><input type="number" step="0.1" min="0.0" onKeyDown={prevenirComa} value={datosEdicion.promedioInicio} onChange={(e) => setDatosEdicion({ ...datosEdicion, promedioInicio: e.target.value })} className="w-full border px-2 py-1.5 text-xs rounded font-bold" /></div>
                          </div>
                          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                            <button onClick={() => setTutoradoEnEdicion(null)} className="text-xs font-semibold text-gray-500 hover:text-gray-800">Descartar</button>
                            <button onClick={guardarEdicionTutorado} className="text-xs font-bold bg-udc-primary text-white px-4 py-1.5 rounded shadow">Aplicar Modificación</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-bold text-udc-primary text-sm">{tutorado.nombres} {tutorado.apellidos}</p>
                              <p className="text-xs text-gray-500 mt-1 uppercase">Id: {tutorado.tipoDoc} {tutorado.documento}</p>
                              <p className="text-xs text-gray-500 mt-0.5">Sexo: {tutorado.genero}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-700">Prog: <span className="font-normal">{tutorado.programa}</span></p>
                              <p className="text-xs font-bold text-gray-700 mt-1">Cód: <span className="font-normal">{tutorado.codigo}</span></p>
                              <p className="text-xs font-bold text-gray-700 mt-1">Campus: <span className="font-normal">{tutorado.campus}</span></p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded">Riesgo Inicial: <span className="text-yellow-600">{tutorado.riesgo}</span></p>
                              <p className="text-xs font-bold text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded mt-2">Promedio Inicial: <span className="text-udc-primary">{tutorado.promedioInicio}</span></p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4 border-l pl-4 border-gray-100">
                            <button onClick={() => iniciarEdicionTutorado(index, tutorado)} className="text-xs font-bold text-udc-primary hover:text-udc-secondary underline">Editar Entidad</button>
                            <button onClick={() => eliminarTutoradoInline(index)} className="text-xs font-bold text-red-500 hover:text-red-700 underline">Desvincular</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
              <button onClick={cerrarModalTutoria} className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg text-sm hover:bg-gray-300 transition">Finalizar Revisión</button>
            </div>
          </div>
        </div>
      )}

      {/* COMPONENTE MODAL: REGISTRO HISTÓRICO DE REPORTES */}
      {modalHistoricoAbierto && reporteHistoricoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">

            <div className="bg-udc-primary px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="text-lg font-bold">Datos Consilidados del Reporte <span className="bg-udc-secondary text-udc-primary px-2 py-0.5 rounded text-xs ml-2">{reporteHistoricoSeleccionado.id.split('-').slice(0, 3).join('-')}</span></h3>
                <p className="text-xs text-gray-300 mt-1">Programa Académico: {reporteHistoricoSeleccionado.programaReporte} | Periodo Cursado: {reporteHistoricoSeleccionado.periodo}</p>
              </div>
              <button onClick={cerrarModalHistorico} className="text-gray-300 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              <h4 className="font-bold text-sm text-udc-primary mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">Directorio de Tutorías Estructuradas ({reporteHistoricoSeleccionado.tutorias?.length || 0})</h4>

              {(!reporteHistoricoSeleccionado.tutorias || reporteHistoricoSeleccionado.tutorias.length === 0) ? (
                <p className="text-center text-gray-500 italic py-8">No se encontraron matrices de tutorías consolidadas en este bloque de datos.</p>
              ) : (
                <div className="space-y-6">
                  {reporteHistoricoSeleccionado.tutorias.map((tut, index) => (
                    <div key={tut.id || index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-udc-primary text-sm">{tut.tutorNombre}</p>
                          <p className="text-xs text-gray-500 font-medium">Asignatura Indexada: {tut.asignatura}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${tut.dictamen === 'SI' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            Evaluación Global: {tut.dictamen === 'SI' ? 'CUMPLIMIENTO APROBADO' : (tut.dictamen === 'NO' ? 'INCUMPLIMIENTO DE REQUISITOS' : 'PENDIENTE')}
                          </span>
                          <p className="text-xs text-gray-500 font-bold mt-1">Total Tutorados: {tut.tutoradosList?.length || 0}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        {(!tut.tutoradosList || tut.tutoradosList.length === 0) ? (
                          <p className="text-xs text-gray-400 italic">Ausencia de datos de tutorados.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="text-gray-500 uppercase border-b border-gray-200">
                                <tr>
                                  <th className="pb-2">Identidad Tutorado</th>
                                  <th className="pb-2">Credenciales (Cód/Doc)</th>
                                  <th className="pb-2">Rango Temporal (Inicio - Cierre)</th>
                                  <th className="pb-2 text-center">Tasa Sesiones</th>
                                  <th className="pb-2 text-center">Calificación Obtenida</th>
                                  <th className="pb-2 text-center">Promedio General</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {tut.tutoradosList.map((tutorado, tIdx) => (
                                  <tr key={tIdx} className="hover:bg-gray-50">
                                    <td className="py-2 font-semibold text-udc-primary">{tutorado.nombres} {tutorado.apellidos}</td>
                                    <td className="py-2 text-gray-600">{tutorado.codigo} <br /><span className="text-[10px] text-gray-400">{tutorado.documento}</span></td>
                                    <td className="py-2 text-gray-600">{tutorado.fechaInicio} — {tutorado.fechaFin}</td>
                                    <td className="py-2 text-center font-bold">{tutorado.totalSesiones}</td>
                                    <td className="py-2 text-center font-bold text-udc-primary">{tutorado.notaFinal}</td>
                                    <td className="py-2 text-center font-bold text-yellow-600">{tutorado.promAcumFinal}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
              <button onClick={cerrarModalHistorico} className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg text-sm hover:bg-gray-300 transition">Finalizar Revisión Documental</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reportes;