import React, { useState, useEffect } from 'react';

const limpiarTexto = (texto) => texto ? texto.toString().toUpperCase().trim() : "";

// ENVÍO DE AUDITORÍA
const enviarAuditoria = async (usuario, modulo, accion, detalle, estado = "Éxito") => {
  try {
    await fetch('http://localhost:8080/api/auditorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, modulo, accion, detalle, estado })
    });
  } catch (e) { 
    console.error("Fallo Auditoría silenciosa", e); 
  }
};

const GestionAcademica = ({ usuarioActual = { rol: 'Administrador' } }) => {
  const pestañaPorDefecto = usuarioActual.rol === 'Administrador' ? 'campus' : 'asignaturas';
  const [pestañaActual, setPestañaActual] = useState(pestañaPorDefecto); 
  const [busqueda, setBusqueda] = useState('');

  // SELLO DE IDENTIDAD COMPLETO PARA AUDITORÍA
  const emailReal = usuarioActual.email || (usuarioActual.rol === 'Administrador' ? 'admin.prueba@unicartagena.edu.co' : 'jefe.sistemas@unicartagena.edu.co');
  const programaReal = usuarioActual.programa || 'Sistemas';
  
  const correoUsuario = usuarioActual.rol === 'Administrador' 
    ? `Administrador Global (${emailReal})` 
    : `Jefe de ${programaReal.toUpperCase()} (${emailReal})`;
    
  // ESTADOS 100% CONECTADOS A DB
  const [campus, setCampus] = useState([]); 
  const [facultades, setFacultades] = useState([]); 
  const [programas, setProgramas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);

  // FORMULARIOS CON IDs
  const [formCampus, setFormCampus] = useState({ id: null, nombre: '', municipio: '' });
  const [formFacultad, setFormFacultad] = useState({ id: null, nombre: '', campus: '' }); 
  const [formPrograma, setFormPrograma] = useState({ id: null, nombre: '', facultad: '', campus: '', modalidad: '' });
  const [formAsignatura, setFormAsignatura] = useState({ id: null, codigo: '', nombre: '', facultad: '', programasRelated: [] });


  // CONEXIÓN GLOBAL AL BACKEND
  const cargarCatalogosDesdeAPI = async () => {
    try {
      if (usuarioActual.rol === 'Administrador') {
        const [resCampus, resFac, resProg] = await Promise.all([
          fetch('http://localhost:8080/api/campus'),
          fetch('http://localhost:8080/api/facultades'),
          fetch('http://localhost:8080/api/programas')
        ]);
        if (resCampus.ok) { const dataC = await resCampus.json(); setCampus(dataC); }
        if (resFac.ok) { const dataF = await resFac.json(); setFacultades(dataF); }
        if (resProg.ok) { const dataP = await resProg.json(); setProgramas(dataP); }
      }
      const resAsig = await fetch('http://localhost:8080/api/asignaturas');
      if (resAsig.ok) { const dataA = await resAsig.json(); setAsignaturas(dataA); }
    } catch (error) {
      console.error("Error conectando con el Backend:", error); 
    }
  };

  useEffect(() => {
    cargarCatalogosDesdeAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioActual.rol]); 

  // ======================= CRUD CAMPUS =======================
  const guardarOActualizarCampus = async (e) => {
    e.preventDefault();
    if (!formCampus.nombre || !formCampus.municipio) return;
    const datos = { nombre: limpiarTexto(formCampus.nombre), municipio: limpiarTexto(formCampus.municipio) };
    try {
      const isEdit = formCampus.id != null;
      const url = isEdit ? `http://localhost:8080/api/campus/${formCampus.id}` : 'http://localhost:8080/api/campus';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      if (res.ok) { 
        setFormCampus({ id: null, nombre: '', municipio: '' }); 
        cargarCatalogosDesdeAPI(); 
        enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", isEdit ? "EDICIÓN" : "CREACIÓN", `Se ${isEdit ? 'actualizó' : 'registró'} el Campus: ${datos.nombre}`);
      }
    } catch (error) { console.error(error); alert("Error de conexión."); }
  };

  const eliminarCampusReal = async (id) => {
    if(!window.confirm(`¿Está seguro de proceder con la eliminación?`)) return;
    const res = await fetch(`http://localhost:8080/api/campus/${id}`, { method: 'DELETE' });
    if(res.ok) {
        cargarCatalogosDesdeAPI();
        enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", "ELIMINACIÓN", `Se eliminó el Campus ID: ${id}`, "Alerta");
    }
  };

  // ======================= CRUD FACULTADES =======================
  const guardarOActualizarFacultad = async (e) => {
    e.preventDefault();
    if (!formFacultad.nombre || !formFacultad.campus) return; 
    const datos = { nombre: limpiarTexto(formFacultad.nombre), campus: formFacultad.campus };
    try {
      const isEdit = formFacultad.id != null;
      const url = isEdit ? `http://localhost:8080/api/facultades/${formFacultad.id}` : 'http://localhost:8080/api/facultades';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      if (res.ok) { 
          setFormFacultad({ id: null, nombre: '', campus: '' }); 
          cargarCatalogosDesdeAPI(); 
          enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", isEdit ? "EDICIÓN" : "CREACIÓN", `Se ${isEdit ? 'actualizó' : 'registró'} la Facultad: ${datos.nombre}`);
      }
    } catch (error) { console.error(error); alert("Error de conexión."); }
  };

  const eliminarFacultadReal = async (id) => {
    if(!window.confirm(`¿Está seguro de proceder con la eliminación?`)) return;
    const res = await fetch(`http://localhost:8080/api/facultades/${id}`, { method: 'DELETE' });
    if(res.ok) {
        cargarCatalogosDesdeAPI();
        enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", "ELIMINACIÓN", `Se eliminó la Facultad ID: ${id}`, "Alerta");
    }
  };

  // ======================= CRUD PROGRAMAS =======================
  const guardarOActualizarPrograma = async (e) => {
    e.preventDefault();
    if (!formPrograma.nombre || !formPrograma.facultad || !formPrograma.campus || !formPrograma.modalidad) return;
    const datos = { nombre: limpiarTexto(formPrograma.nombre), facultad: formPrograma.facultad, campus: formPrograma.campus, modalidad: formPrograma.modalidad };
    try {
      const isEdit = formPrograma.id != null;
      const url = isEdit ? `http://localhost:8080/api/programas/${formPrograma.id}` : 'http://localhost:8080/api/programas';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      if (res.ok) { 
          setFormPrograma({ id: null, nombre: '', facultad: '', campus: '', modalidad: '' }); 
          cargarCatalogosDesdeAPI(); 
          enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", isEdit ? "EDICIÓN" : "CREACIÓN", `Se ${isEdit ? 'actualizó' : 'registró'} el Programa: ${datos.nombre}`);
      }
    } catch (error) { console.error(error); alert("Error de conexión."); }
  };

  const eliminarProgramaReal = async (id) => {
    if(!window.confirm(`¿Está seguro de proceder con la eliminación?`)) return;
    const res = await fetch(`http://localhost:8080/api/programas/${id}`, { method: 'DELETE' });
    if(res.ok) {
        cargarCatalogosDesdeAPI();
        enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", "ELIMINACIÓN", `Se eliminó el Programa ID: ${id}`, "Alerta");
    }
  };

  // ======================= CRUD ASIGNATURAS =======================
  const guardarOActualizarAsignatura = async (e) => {
    e.preventDefault();
    if (!formAsignatura.codigo || !formAsignatura.nombre || !formAsignatura.facultad || formAsignatura.programasRelated.length === 0) return;
    const datos = { codigo: formAsignatura.codigo, nombre: limpiarTexto(formAsignatura.nombre), facultad: formAsignatura.facultad, programas: formAsignatura.programasRelated };
    const isEdit = formAsignatura.id != null;
    const url = isEdit ? `http://localhost:8080/api/asignaturas/${formAsignatura.id}` : 'http://localhost:8080/api/asignaturas';
    const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
    if (res.ok) {
        setFormAsignatura({ id: null, codigo: '', nombre: '', facultad: '', programasRelated: [] });
        cargarCatalogosDesdeAPI();
        enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", isEdit ? "EDICIÓN" : "CREACIÓN", `Se ${isEdit ? 'actualizó' : 'registró'} la Asignatura: ${datos.nombre}`);
    }
  };

  const eliminarAsignaturaReal = async (id) => {
    if(!window.confirm(`¿Está seguro de proceder con la eliminación?`)) return;
    const res = await fetch(`http://localhost:8080/api/asignaturas/${id}`, { method: 'DELETE' });
    if(res.ok) {
        cargarCatalogosDesdeAPI();
        enviarAuditoria(correoUsuario, "GESTIÓN ACADÉMICA", "ELIMINACIÓN", `Se eliminó la Asignatura ID: ${id}`, "Alerta");
    }
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen relative z-10">
      
      <div className="bg-[#1a232f] p-6 text-white border-b-4 border-[#EBB700] rounded-t-xl relative z-20">
        <h2 className="text-2xl font-bold tracking-wide">Gestión Académica Institucional</h2>
        <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">{usuarioActual.rol === 'Administrador' ? 'Configuración de Campus, Facultades, Programas y Asignaturas' : 'Gestión del Catálogo de Asignaturas'}</p>
      </div>

      <div className="flex px-8 mt-6 space-x-2 border-b border-gray-200 bg-white relative z-10">
        {pestañasVisibles.map((tab) => (
          <button key={tab} onClick={() => { setPestañaActual(tab); setBusqueda(''); }} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-t-lg transition-all border-t border-l border-r ${pestañaActual === tab ? 'bg-[#1B2631] text-white border-[#1B2631]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>{tab}</button>
        ))}
      </div>

      <div className="p-8 animate-fade-in relative z-0">
        <div className="mb-6"><input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value.toUpperCase())} placeholder={`BUSCAR EN ${pestañaActual.toUpperCase()}...`} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#1B2631] bg-gray-50 focus:bg-white transition-colors" /></div>

        {/* --- VISTA: CAMPUS --- */}
        {pestañaActual === 'campus' && (
          <div>
            <form onSubmit={guardarOActualizarCampus} className={`bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 mb-8 shadow-sm transition-colors duration-300 ${formCampus.id ? 'border-t-[#EBB700] bg-amber-50/30' : 'border-t-[#EBB700]'}`}>
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-lg font-bold text-[#1B2631] uppercase tracking-wider">{formCampus.id ? 'EDITAR CAMPUS' : 'REGISTRAR NUEVO CAMPUS'}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre del Campus *</label><input type="text" value={formCampus.nombre} onChange={(e) => setFormCampus({...formCampus, nombre: e.target.value.toUpperCase()})} placeholder="EJ: ZARAGOCILLA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Municipio / Ciudad *</label><input type="text" value={formCampus.municipio} onChange={(e) => setFormCampus({...formCampus, municipio: e.target.value.toUpperCase()})} placeholder="EJ: CARTAGENA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required /></div>
              </div>
              <div className="flex justify-end mt-5 gap-3">
                {formCampus.id && <button type="button" onClick={() => setFormCampus({ id: null, nombre: '', municipio: '' })} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-300">CANCELAR</button>}
                <button type="submit" className="bg-[#1B2631] hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow">{formCampus.id ? 'ACTUALIZAR' : 'GUARDAR'}</button>
              </div>
            </form>
            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm"><thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Nombre del Campus</th><th className="p-4">Municipio/Ciudad</th><th className="p-4 text-center">Acciones</th></tr></thead><tbody className="text-sm divide-y bg-white overflow-y-auto">
                {campus.filter(c => c.nombre.includes(busqueda.toUpperCase())).map((c) => (<tr key={c.id} className="hover:bg-gray-50"><td className="p-4 font-bold text-gray-500">{c.id}</td><td className="p-4 font-black text-[#1B2631]">{c.nombre}</td><td className="p-4 font-medium">{c.municipio}</td><td className="p-4 text-center flex justify-center gap-3"><button onClick={() => {setFormCampus(c); window.scrollTo(0,0);}} className="text-[#1B2631] hover:text-[#EBB700] font-bold text-xs uppercase tracking-tighter">Editar</button><button onClick={() => eliminarCampusReal(c.id)} className="text-red-700 hover:text-red-900 font-bold text-xs uppercase tracking-tighter">Eliminar</button></td></tr>))}
                {campus.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No hay registros almacenados.</td></tr>}
            </tbody></table>
          </div>
        )}

        {/* --- VISTA: FACULTADES --- */}
        {pestañaActual === 'facultades' && (
          <div>
            <form onSubmit={guardarOActualizarFacultad} className={`bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 mb-8 shadow-sm transition-colors duration-300 ${formFacultad.id ? 'border-t-[#EBB700] bg-amber-50/30' : 'border-t-[#EBB700]'}`}>
              <div className="flex justify-between items-center mb-5"><h4 className="text-lg font-bold text-[#1B2631] uppercase tracking-wider">{formFacultad.id ? 'EDITAR FACULTAD' : 'REGISTRAR NUEVA FACULTAD'}</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="w-full"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre de la Facultad *</label><input type="text" value={formFacultad.nombre} onChange={(e) => setFormFacultad({...formFacultad, nombre: e.target.value.toUpperCase()})} placeholder="EJ: INGENIERÍA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required /></div>
                <div className="w-full"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Campus de Pertenencia *</label>
                  <select value={formFacultad.campus} onChange={(e) => setFormFacultad({...formFacultad, campus: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required>
                    <option value="">Seleccione Campus...</option>
                    {campus.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-5 gap-3">
                {formFacultad.id && <button type="button" onClick={() => setFormFacultad({ id: null, nombre: '', campus: '' })} className="px-6 py-2.5 bg-gray-200 font-bold text-sm rounded-lg hover:bg-gray-300 w-full md:w-auto">CANCELAR</button>}
                <button type="submit" className="bg-[#1B2631] hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow w-full md:w-auto">{formFacultad.id ? 'ACTUALIZAR' : 'GUARDAR'}</button>
              </div>
            </form>
            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm"><thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold"><tr><th className="p-4">Facultad</th><th className="p-4">Campus Asignado</th><th className="p-4 text-center">Acciones</th></tr></thead><tbody className="text-sm divide-y bg-white overflow-y-auto">
                {facultades.filter(f => f.nombre.includes(busqueda.toUpperCase())).map((f) => (<tr key={f.id} className="hover:bg-gray-50"><td className="p-4 font-black text-[#1B2631]">{f.nombre}</td><td className="p-4 font-bold text-gray-500">{f.campus || 'NO ASIGNADO'}</td><td className="p-4 text-center flex justify-center gap-3"><button onClick={() => {setFormFacultad(f); window.scrollTo(0,0);}} className="text-[#1B2631] font-bold text-xs uppercase">Editar</button><button onClick={() => eliminarFacultadReal(f.id)} className="text-red-700 font-bold text-xs uppercase">Eliminar</button></td></tr>))}
                {facultades.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No hay registros almacenados.</td></tr>}
            </tbody></table>
          </div>
        )}

        {/* --- VISTA: PROGRAMAS --- */}
        {pestañaActual === 'programas' && (
          <div>
            <form onSubmit={guardarOActualizarPrograma} className={`bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 mb-8 shadow-sm transition-colors duration-300 ${formPrograma.id ? 'border-t-[#EBB700] bg-amber-50/30' : 'border-t-[#EBB700]'}`}>
              <div className="flex justify-between items-center mb-5"><h4 className="text-lg font-bold text-[#1B2631] uppercase tracking-wider">{formPrograma.id ? 'EDITAR PROGRAMA' : 'REGISTRAR NUEVO PROGRAMA'}</h4></div>
              {facultades.length === 0 || campus.length === 0 ? (<div className="bg-gray-100 text-gray-600 p-4 rounded-lg font-bold text-sm">[ATENCIÓN] Registre Facultad y Campus primero.</div>) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end mb-5">
                    <div className="md:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre Oficial del Programa *</label><input type="text" value={formPrograma.nombre} onChange={(e) => setFormPrograma({...formPrograma, nombre: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required /></div>
                    
                    <div className="md:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad *</label>
                    <select value={formPrograma.facultad} onChange={(e) => {
                      const fac = facultades.find(f => f.nombre === e.target.value);
                      setFormPrograma({...formPrograma, facultad: e.target.value, campus: fac ? fac.campus : ''});
                    }} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required>
                      <option value="">Seleccione...</option>
                      {facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                    </select></div>

                    <div className="md:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Modalidad *</label>
                    <select value={formPrograma.modalidad} onChange={(e) => setFormPrograma({...formPrograma, modalidad: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white font-bold text-[#1B2631]" required>
                      <option value="">Seleccione Modalidad...</option>
                      <option value="Presencial">Presencial</option>
                      <option value="A Distancia">A Distancia</option>
                    </select></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Campus (Auto)</label><input type="text" value={formPrograma.campus} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 font-bold" readOnly /></div>
                    <div className="md:col-span-2 flex justify-end gap-3">{formPrograma.id && <button type="button" onClick={() => setFormPrograma({ id: null, nombre: '', facultad: '', campus: '', modalidad: '' })} className="px-6 py-2.5 bg-gray-200 font-bold text-sm rounded-lg">CANCELAR</button>}<button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800">{formPrograma.id ? 'ACTUALIZAR' : 'GUARDAR'}</button></div>
                  </div>
                </>
              )}
            </form>
            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm"><thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold"><tr><th className="p-4">Programa Académico</th><th className="p-4">Facultad</th><th className="p-4">Campus</th><th className="p-4">Modalidad</th><th className="p-4 text-center">Acciones</th></tr></thead><tbody className="text-sm divide-y bg-white overflow-y-auto pr-2">
                {programas.filter(p => p.nombre.includes(busqueda.toUpperCase())).map((p) => (<tr key={p.id} className="hover:bg-gray-50"><td className="p-4 font-black text-[#1B2631]">{p.nombre}</td><td className="p-4 font-semibold text-gray-600">{p.facultad}</td><td className="p-4 text-gray-600 text-xs">{p.campus}</td><td className="p-4 text-gray-600 text-xs font-bold">{p.modalidad || 'N/A'}</td><td className="p-4 text-center flex justify-center gap-3"><button onClick={() => {setFormPrograma({id: p.id, nombre: p.nombre, facultad: p.facultad, campus: p.campus, modalidad: p.modalidad || ''}); window.scrollTo(0,0);}} className="text-[#1B2631] font-bold text-xs uppercase">Editar</button><button onClick={() => eliminarProgramaReal(p.id)} className="text-red-700 font-bold text-xs uppercase">Eliminar</button></td></tr>))}
                {programas.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No hay registros almacenados.</td></tr>}
            </tbody></table>
          </div>
        )}

        {/* --- VISTA: ASIGNATURAS --- */}
        {pestañaActual === 'asignaturas' && (
          <div>
            <form onSubmit={guardarOActualizarAsignatura} className={`bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 mb-8 shadow-sm transition-colors duration-300 ${formAsignatura.id ? 'border-t-[#EBB700] bg-amber-50/30' : 'border-t-[#EBB700]'}`}>
              <div className="flex justify-between items-center mb-5"><h4 className="text-lg font-bold text-[#1B2631] uppercase tracking-wider">{formAsignatura.id ? 'EDITAR ASIGNATURA' : 'REGISTRAR ASIGNATURA'}</h4></div>
              {programas.length === 0 ? (<div className="bg-gray-100 text-gray-600 p-4 rounded-lg font-bold text-sm">[ATENCIÓN] Registre programas primero.</div>) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Código *</label><input type="number" value={formAsignatura.codigo} onChange={(e) => setFormAsignatura({...formAsignatura, codigo: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required /></div>
                    <div className="md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre Oficial *</label><input type="text" value={formAsignatura.nombre} onChange={(e) => setFormAsignatura({...formAsignatura, nombre: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad *</label><select value={formAsignatura.facultad} onChange={(e) => setFormAsignatura({...formAsignatura, facultad: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" required><option value="">Seleccionar...</option>{facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}</select></div>
                    <div className="md:col-span-2 bg-white p-4 rounded-xl border shadow-sm">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Vincular a Programas *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-32 overflow-y-auto pr-2">
                        {programas.map(prog => (
                          <label key={prog.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg"><input type="checkbox" checked={formAsignatura.programasRelated.includes(prog.nombre)} onChange={() => handleCheckboxProgramas(prog.nombre)} className="w-4 h-4 accent-[#1B2631]" /><span className="text-xs font-bold text-gray-700">{prog.nombre}</span></label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 pt-4 border-t gap-3">{formAsignatura.id && <button type="button" onClick={() => setFormAsignatura({ id: null, codigo: '', nombre: '', facultad: '', programasRelated: [] })} className="px-6 py-2.5 bg-gray-200 font-bold text-sm rounded-lg">CANCELAR</button>}<button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800">{formAsignatura.id ? 'ACTUALIZAR' : 'GUARDAR'}</button></div>
                </>
              )}
            </form>
            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm relative z-0"><thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold"><tr><th className="p-4 w-20">Cód</th><th className="p-4">Asignatura</th><th className="p-4">Facultad</th><th className="p-4">Programas</th><th className="p-4 text-center">Acciones</th></tr></thead><tbody className="text-sm divide-y bg-white overflow-y-auto">
                {asignaturas.filter(a => a.nombre.includes(busqueda.toUpperCase()) || a.codigo.includes(busqueda)).map((m) => (<tr key={m.id} className="hover:bg-gray-50"><td className="p-4 font-bold text-gray-600">{m.codigo}</td><td className="p-4 font-black text-[#1B2631]">{m.nombre}</td><td className="p-4 font-semibold text-gray-600">{m.facultad}</td><td className="p-4 text-xs font-medium text-gray-500">{m.programas.join(', ')}</td><td className="p-4 text-center flex justify-center gap-3"><button onClick={() => {setFormAsignatura({id: m.id, codigo: m.codigo, nombre: m.nombre, facultad: m.facultad, programasRelated: m.programas}); window.scrollTo(0,0);}} className="text-[#1B2631] font-bold text-xs uppercase">Editar</button><button onClick={() => eliminarAsignaturaReal(m.id)} className="text-red-700 font-bold text-xs uppercase">Eliminar</button></td></tr>))}
                {asignaturas.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No hay registros almacenados.</td></tr>}
            </tbody></table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionAcademica;