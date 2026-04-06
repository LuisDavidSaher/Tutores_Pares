import React, { useState, useEffect } from 'react';

const limpiarTexto = (texto) => texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\s]/g, "");

const safeLoad = (key) => {
  try { 
    const data = localStorage.getItem(key); 
    return data ? JSON.parse(data) : []; 
  } catch (error) { 
    console.error("Aviso: Memoria local vacía o inaccesible", error); 
    return []; 
  }
};

const GestionAcademica = ({ usuarioActual = { rol: 'Administrador' } }) => {
  const pestañaPorDefecto = usuarioActual.rol === 'Administrador' ? 'campus' : 'asignaturas';
  const [pestañaActual, setPestañaActual] = useState(pestañaPorDefecto); 
  const [busqueda, setBusqueda] = useState('');

  // ESTADOS CONECTADOS A DB
  const [campus, setCampus] = useState([]); 
  const [facultades, setFacultades] = useState([]); // <--- Ahora arranca vacío, se llenará con la API

  // ESTADOS MOCKS TEMPORALES
  const [programas, setProgramas] = useState(() => safeLoad('sgtp_programas'));
  const [asignaturas, setAsignaturas] = useState(() => safeLoad('sgtp_asignaturas'));

  // FORMULARIOS (Incluyen ID para edición)
  const [formCampus, setFormCampus] = useState({ id: null, nombre: '', municipio: '' });
  const [formFacultad, setFormFacultad] = useState({ id: null, nombre: '' }); // <--- Añadido ID
  const [formPrograma, setFormPrograma] = useState({ nombre: '', facultad: '', campus: '' });
  const [formAsignatura, setFormAsignatura] = useState({ codigo: '', nombre: '', facultad: '', programasRelated: [] });

  // ==============================================================
  // 🔗 CONEXIÓN REAL CON SPRING BOOT (CRUD CAMPUS Y FACULTADES)
  // ==============================================================
  
  // 1. LEER (GET)
  const cargarCatalogosDesdeAPI = async () => {
    try {
      // Cargar Campus
      const resCampus = await fetch('http://localhost:8080/api/campus');
      if (resCampus.ok) setCampus(await resCampus.json());

      // Cargar Facultades
      const resFacultades = await fetch('http://localhost:8080/api/facultades');
      if (resFacultades.ok) setFacultades(await resFacultades.json());

    } catch (error) {
      console.error("Error conectando con el Backend de Spring Boot:", error); 
    }
  };

  useEffect(() => {
    let montado = true;
    const fetchInicial = async () => {
      if (usuarioActual.rol === 'Administrador' && montado) {
        cargarCatalogosDesdeAPI();
      }
    };
    fetchInicial();
    return () => { montado = false; };
  }, [usuarioActual.rol]); 

  // ======================= CRUD CAMPUS =======================
  const guardarOActualizarCampus = async (eventoSubmit) => {
    eventoSubmit.preventDefault();
    if (!formCampus.nombre || !formCampus.municipio) return;

    const datosCampus = { nombre: limpiarTexto(formCampus.nombre), municipio: limpiarTexto(formCampus.municipio) };

    try {
      const url = formCampus.id ? `http://localhost:8080/api/campus/${formCampus.id}` : 'http://localhost:8080/api/campus';
      const method = formCampus.id ? 'PUT' : 'POST';

      const respuesta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCampus)
      });

      if (respuesta.ok) {
        alert(`¡Campus ${formCampus.id ? 'actualizado' : 'guardado'} en la Base de Datos Real!`);
        setFormCampus({ id: null, nombre: '', municipio: '' }); 
        cargarCatalogosDesdeAPI(); 
      }
    } catch (error) {
      console.error(error); 
      alert("Error al guardar/actualizar. Revise que Spring Boot esté encendido.");
    }
  };

  const iniciarEdicionCampus = (campusAEditar) => {
    setFormCampus({ id: campusAEditar.id, nombre: campusAEditar.nombre, municipio: campusAEditar.municipio });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarCampusReal = async (id) => {
    if(!window.confirm(`¿Seguro que desea eliminar este Campus permanentemente?`)) return;
    try {
      const respuesta = await fetch(`http://localhost:8080/api/campus/${id}`, { method: 'DELETE' });
      if (respuesta.ok) cargarCatalogosDesdeAPI(); 
    } catch (error) {
      console.error(error); 
      alert("Error al eliminar.");
    }
  };

  // ======================= CRUD FACULTADES =======================
  const guardarOActualizarFacultad = async (eventoSubmit) => {
    eventoSubmit.preventDefault();
    if (!formFacultad.nombre) return;

    const datosFacultad = { nombre: limpiarTexto(formFacultad.nombre) };

    try {
      const url = formFacultad.id ? `http://localhost:8080/api/facultades/${formFacultad.id}` : 'http://localhost:8080/api/facultades';
      const method = formFacultad.id ? 'PUT' : 'POST';

      const respuesta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFacultad)
      });

      if (respuesta.ok) {
        alert(`¡Facultad ${formFacultad.id ? 'actualizada' : 'guardada'} en la Base de Datos Real!`);
        setFormFacultad({ id: null, nombre: '' }); 
        cargarCatalogosDesdeAPI(); 
      }
    } catch (error) {
      console.error(error); 
      alert("Error al guardar/actualizar. Revise que Spring Boot esté encendido.");
    }
  };

  const iniciarEdicionFacultad = (facultadAEditar) => {
    setFormFacultad({ id: facultadAEditar.id, nombre: facultadAEditar.nombre });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarFacultadReal = async (id) => {
    if(!window.confirm(`¿Seguro que desea eliminar esta Facultad permanentemente?`)) return;
    try {
      const respuesta = await fetch(`http://localhost:8080/api/facultades/${id}`, { method: 'DELETE' });
      if (respuesta.ok) cargarCatalogosDesdeAPI(); 
    } catch (error) {
      console.error(error); 
      alert("Error al eliminar.");
    }
  };

  // ==============================================================
  // FUNCIONES DE CATÁLOGOS LOCALES (MOCKS TEMPORALES)
  // ==============================================================

  const guardarPrograma = (eventoSubmit) => {
    eventoSubmit.preventDefault();
    if (!formPrograma.nombre || !formPrograma.facultad || !formPrograma.campus) { alert("Faltan datos."); return; }
    const idGen = programas.length > 0 ? Math.max(...programas.map(p => p.id)) + 1 : 1;
    const nueva = { id: idGen, nombre: limpiarTexto(formPrograma.nombre), facultad: formPrograma.facultad, campus: formPrograma.campus };
    const nuevaLista = [nueva, ...programas];
    setProgramas(nuevaLista); localStorage.setItem('sgtp_programas', JSON.stringify(nuevaLista));
    setFormPrograma({ nombre: '', facultad: '', campus: '' }); alert("Programa registrado exitosamente.");
  };

  const guardarAsignatura = (eventoSubmit) => {
    eventoSubmit.preventDefault();
    if (!formAsignatura.codigo || !formAsignatura.nombre || !formAsignatura.facultad || formAsignatura.programasRelated.length === 0) { alert("Faltan datos o programas."); return; }
    const idGen = asignaturas.length > 0 ? Math.max(...asignaturas.map(a => a.id)) + 1 : 1;
    const nueva = { id: idGen, codigo: formAsignatura.codigo, nombre: limpiarTexto(formAsignatura.nombre), facultad: formAsignatura.facultad, programas: formAsignatura.programasRelated };
    const nuevaLista = [nueva, ...asignaturas];
    setAsignaturas(nuevaLista); localStorage.setItem('sgtp_asignaturas', JSON.stringify(nuevaLista));
    setFormAsignatura({ codigo: '', nombre: '', facultad: '', programasRelated: [] }); alert("Asignatura registrada exitosamente.");
  };

  const eliminarEntidad = (tipo, id) => {
    if (tipo === 'campus') { eliminarCampusReal(id); return; } 
    if (tipo === 'facultad') { eliminarFacultadReal(id); return; } // <--- Desviamos al backend real
    
    if(!window.confirm(`¿Seguro que desea eliminar este registro?`)) return;
    if (tipo === 'programa') { const res = programas.filter(x => x.id !== id); setProgramas(res); localStorage.setItem('sgtp_programas', JSON.stringify(res)); }
    if (tipo === 'asignatura') { const res = asignaturas.filter(x => x.id !== id); setAsignaturas(res); localStorage.setItem('sgtp_asignaturas', JSON.stringify(res)); }
  };

  const handleCheckboxProgramas = (progNombre) => {
    const actual = formAsignatura.programasRelated;
    if (actual.includes(progNombre)) setFormAsignatura({ ...formAsignatura, programasRelated: actual.filter(p => p !== progNombre) });
    else setFormAsignatura({ ...formAsignatura, programasRelated: [...actual, progNombre] });
  };

  const pestañasVisibles = usuarioActual.rol === 'Administrador' 
    ? ['campus', 'facultades', 'programas', 'asignaturas'] 
    : ['asignaturas'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      <div className="bg-[#1a232f] p-6 text-white border-b-4 border-[#EBB700] rounded-t-xl">
        <h2 className="text-2xl font-bold tracking-wide">Gestión Académica Institucional</h2>
        <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">
          {usuarioActual.rol === 'Administrador' ? 'Configuración de Campus, Facultades, Programas y Asignaturas' : 'Gestión del Catálogo de Asignaturas'}
        </p>
      </div>

      <div className="flex px-8 mt-6 space-x-2 border-b border-gray-200">
        {pestañasVisibles.map((tab) => (
          <button 
            key={tab} onClick={() => { setPestañaActual(tab); setBusqueda(''); }}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-t-lg transition-all border-t border-l border-r ${
              pestañaActual === tab ? 'bg-[#1B2631] text-white border-[#1B2631]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8 animate-fade-in">
        <div className="mb-6">
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder={`Buscar en ${pestañaActual.toUpperCase()}...`} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#1B2631] bg-gray-50 focus:bg-white transition-colors" />
        </div>

        {/* --- VISTA: CAMPUS --- */}
        {pestañaActual === 'campus' && (
          <div>
            <form onSubmit={guardarOActualizarCampus} className={`bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 mb-8 shadow-sm transition-colors duration-300 ${formCampus.id ? 'border-t-blue-500 bg-blue-50' : 'border-t-[#EBB700]'}`}>
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-lg font-bold text-[#1B2631] uppercase tracking-wider">
                  {formCampus.id ? 'Editar Campus' : 'Registrar Nuevo Campus'}
                </h4>
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded font-bold">🟢 CONECTADO A DB</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre del Campus *</label><input type="text" value={formCampus.nombre} onChange={(e) => setFormCampus({...formCampus, nombre: e.target.value})} placeholder="Ej: ZARAGOCILLA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631] bg-white" required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Municipio / Ciudad *</label><input type="text" value={formCampus.municipio} onChange={(e) => setFormCampus({...formCampus, municipio: e.target.value})} placeholder="Ej: CARTAGENA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631] bg-white" required /></div>
              </div>
              <div className="flex justify-end mt-5 gap-3">
                {formCampus.id && (
                  <button type="button" onClick={() => setFormCampus({ id: null, nombre: '', municipio: '' })} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-300 transition">Cancelar</button>
                )}
                <button type="submit" className={`${formCampus.id ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1B2631] hover:bg-gray-800'} text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow transition-colors`}>
                  {formCampus.id ? 'Actualizar Campus' : 'Guardar Campus'}
                </button>
              </div>
            </form>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4">ID (DB)</th><th className="p-4">Nombre del Campus</th><th className="p-4">Municipio</th><th className="p-4 text-center">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y bg-white">
                {campus.filter(c => c.nombre.includes(busqueda.toUpperCase())).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-500">{c.id}</td>
                    <td className="p-4 font-black text-[#1B2631]">{c.nombre}</td>
                    <td className="p-4 font-medium">{c.municipio}</td>
                    <td className="p-4 text-center flex justify-center gap-3">
                      <button onClick={() => iniciarEdicionCampus(c)} className="text-blue-600 font-bold hover:text-blue-800 text-xs">Editar</button>
                      <button onClick={() => eliminarEntidad('campus', c.id)} className="text-red-600 font-bold hover:text-red-800 text-xs">Eliminar BD</button>
                    </td>
                  </tr>
                ))}
                {campus.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No hay campus en la base de datos real. Agregue uno arriba.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA: FACULTADES --- */}
        {pestañaActual === 'facultades' && (
          <div>
            <form onSubmit={guardarOActualizarFacultad} className={`bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 mb-8 shadow-sm transition-colors duration-300 ${formFacultad.id ? 'border-t-blue-500 bg-blue-50' : 'border-t-[#EBB700]'}`}>
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-lg font-bold text-[#1B2631] uppercase tracking-wider">
                  {formFacultad.id ? 'Editar Facultad' : 'Registrar Nueva Facultad'}
                </h4>
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded font-bold">🟢 CONECTADA A DB</span>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre de la Facultad *</label><input type="text" value={formFacultad.nombre} onChange={(e) => setFormFacultad({...formFacultad, nombre: e.target.value})} placeholder="Ej: INGENIERÍA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631] bg-white" required /></div>
                
                {formFacultad.id && (
                  <button type="button" onClick={() => setFormFacultad({ id: null, nombre: '' })} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-300 transition w-full md:w-auto">Cancelar</button>
                )}
                <button type="submit" className={`${formFacultad.id ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1B2631] hover:bg-gray-800'} text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow transition-colors w-full md:w-auto`}>
                  {formFacultad.id ? 'Actualizar Facultad' : 'Guardar Facultad'}
                </button>
              </div>
            </form>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4 w-24">ID (DB)</th><th className="p-4">Nombre de la Facultad</th><th className="p-4 text-center w-48">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y bg-white">
                {facultades.filter(f => f.nombre.includes(busqueda.toUpperCase())).map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-500">{f.id}</td>
                    <td className="p-4 font-black text-[#1B2631]">{f.nombre}</td>
                    <td className="p-4 text-center flex justify-center gap-3">
                      <button onClick={() => iniciarEdicionFacultad(f)} className="text-blue-600 font-bold hover:text-blue-800 text-xs">Editar</button>
                      <button onClick={() => eliminarEntidad('facultad', f.id)} className="text-red-600 font-bold hover:text-red-800 text-xs">Eliminar BD</button>
                    </td>
                  </tr>
                ))}
                {facultades.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No hay facultades en la base de datos real.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA: PROGRAMAS --- */}
        {pestañaActual === 'programas' && (
          <div>
            <form onSubmit={guardarPrograma} className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 border-t-[#EBB700] shadow-sm mb-8">
              <h4 className="text-lg font-bold text-[#1B2631] mb-5 uppercase tracking-wider">Registrar Nuevo Programa Académico</h4>
              {facultades.length === 0 || campus.length === 0 ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm font-bold">⚠ Atención: Debe registrar al menos una Facultad y un Campus antes de poder crear Programas.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end mb-5">
                    <div className="md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre del Programa *</label><input type="text" value={formPrograma.nombre} onChange={(e) => setFormPrograma({...formPrograma, nombre: e.target.value})} placeholder="Ej: INGENIERÍA DE SISTEMAS" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631]" required /></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad: *</label><select value={formPrograma.facultad} onChange={(e) => setFormPrograma({...formPrograma, facultad: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-[#1B2631]" required><option value="">Seleccione...</option>{facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Campus Base: *</label><select value={formPrograma.campus} onChange={(e) => setFormPrograma({...formPrograma, campus: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-[#1B2631]" required><option value="">Seleccione...</option>{campus.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}</select></div>
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800">Guardar Programa</button></div>
                  </div>
                </>
              )}
            </form>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4">Programa</th><th className="p-4">Facultad</th><th className="p-4">Campus Base</th><th className="p-4 text-center">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y bg-white">
                {programas.filter(p => p.nombre.includes(busqueda.toUpperCase())).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50"><td className="p-4 font-black text-[#1B2631]">{p.nombre}</td><td className="p-4 font-semibold text-gray-600">{p.facultad}</td><td className="p-4 text-gray-600">{p.campus}</td><td className="p-4 text-center"><button onClick={() => eliminarEntidad('programa', p.id)} className="text-red-600 font-bold hover:text-red-800 text-xs">Eliminar</button></td></tr>
                ))}
                {programas.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No hay programas registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA: ASIGNATURAS --- */}
        {pestañaActual === 'asignaturas' && (
          <div>
            <form onSubmit={guardarAsignatura} className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 border-t-[#EBB700] mb-8 shadow-sm">
              <h4 className="text-lg font-bold text-[#1B2631] mb-5 uppercase tracking-wider">Registrar Nueva Asignatura</h4>
              {programas.length === 0 ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm font-bold">⚠ Atención: Debe registrar al menos un Programa antes de crear Asignaturas.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código *</label><input type="number" value={formAsignatura.codigo} onChange={(e) => setFormAsignatura({...formAsignatura, codigo: e.target.value})} placeholder="Ej: 1010101" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631]" required /></div>
                    <div className="md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre Oficial *</label><input type="text" value={formAsignatura.nombre} onChange={(e) => setFormAsignatura({...formAsignatura, nombre: e.target.value})} placeholder="Ej: CÁLCULO DIFERENCIAL" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631]" required /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad *</label><select value={formAsignatura.facultad} onChange={(e) => setFormAsignatura({...formAsignatura, facultad: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-[#1B2631]" required><option value="">Seleccionar...</option>{facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}</select></div>
                    <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Vincular a Programas (Seleccione varios) *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-32 overflow-y-auto pr-2">
                        {programas.map(prog => (
                          <label key={prog.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition">
                            <input type="checkbox" checked={formAsignatura.programasRelated.includes(prog.nombre)} onChange={() => handleCheckboxProgramas(prog.nombre)} className="w-4 h-4 text-[#1B2631] focus:ring-[#1B2631] rounded accent-[#1B2631]" />
                            <span className="text-xs font-bold text-gray-700">{prog.nombre}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 pt-4 border-t border-gray-200"><button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800">Guardar Asignatura</button></div>
                </>
              )}
            </form>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4 w-20">Código</th><th className="p-4">Asignatura</th><th className="p-4">Facultad</th><th className="p-4">Programas Vinculados</th><th className="p-4 text-center">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y bg-white">
                {asignaturas.filter(a => a.nombre.includes(busqueda.toUpperCase()) || a.codigo.includes(busqueda)).map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50"><td className="p-4 font-bold text-gray-600">{m.codigo}</td><td className="p-4 font-black text-[#1B2631]">{m.nombre}</td><td className="p-4 font-semibold text-gray-600">{m.facultad}</td><td className="p-4 text-xs font-medium text-gray-500">{m.programas.join(', ')}</td><td className="p-4 text-center"><button onClick={() => eliminarEntidad('asignatura', m.id)} className="text-red-600 font-bold hover:text-red-800 text-xs">Eliminar</button></td></tr>
                ))}
                {asignaturas.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500 bg-gray-50">No hay asignaturas registradas.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default GestionAcademica;