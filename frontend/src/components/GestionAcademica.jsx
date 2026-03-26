import React, { useState } from 'react';

const limpiarTexto = (texto) => texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\s]/g, "");

// SOLUCIÓN LINTER: Se usa la variable error en console para que no sea marcada como "unused"
const safeLoad = (key) => {
  try { 
    const data = localStorage.getItem(key); 
    return data ? JSON.parse(data) : []; 
  } catch (error) { 
    console.error("Aviso: Memoria local vacía o inaccesible", error);
    return []; 
  }
};

const GestionAcademica = () => {
  const [pestañaActual, setPestañaActual] = useState('sedes'); 
  const [busqueda, setBusqueda] = useState('');

  const [sedes, setSedes] = useState(() => safeLoad('sgtp_sedes'));
  const [facultades, setFacultades] = useState(() => safeLoad('sgtp_facultades'));
  const [programas, setProgramas] = useState(() => safeLoad('sgtp_programas'));
  const [asignaturas, setAsignaturas] = useState(() => safeLoad('sgtp_asignaturas'));

  const [formSede, setFormSede] = useState({ nombre: '', municipio: '' });
  const [formFacultad, setFormFacultad] = useState({ nombre: '' });
  const [formPrograma, setFormPrograma] = useState({ nombre: '', facultad: '', sede: '' });
  const [formAsignatura, setFormAsignatura] = useState({ codigo: '', nombre: '', facultad: '', programasRelated: [] });

  const guardarSede = (eventoSubmit) => {
    eventoSubmit.preventDefault();
    if (!formSede.nombre || !formSede.municipio) return;
    const idGen = sedes.length > 0 ? Math.max(...sedes.map(s => s.id)) + 1 : 1;
    const nueva = { id: idGen, nombre: limpiarTexto(formSede.nombre), municipio: limpiarTexto(formSede.municipio) };
    const nuevaLista = [nueva, ...sedes];
    setSedes(nuevaLista); localStorage.setItem('sgtp_sedes', JSON.stringify(nuevaLista));
    setFormSede({ nombre: '', municipio: '' }); alert("Sede registrada exitosamente.");
  };

  const guardarFacultad = (eventoSubmit) => {
    eventoSubmit.preventDefault();
    if (!formFacultad.nombre) return;
    const idGen = facultades.length > 0 ? Math.max(...facultades.map(f => f.id)) + 1 : 1;
    const nueva = { id: idGen, nombre: limpiarTexto(formFacultad.nombre) };
    const nuevaLista = [nueva, ...facultades];
    setFacultades(nuevaLista); localStorage.setItem('sgtp_facultades', JSON.stringify(nuevaLista));
    setFormFacultad({ nombre: '' }); alert("Facultad registrada exitosamente.");
  };

  const guardarPrograma = (eventoSubmit) => {
    eventoSubmit.preventDefault();
    if (!formPrograma.nombre || !formPrograma.facultad || !formPrograma.sede) { alert("Faltan datos."); return; }
    const idGen = programas.length > 0 ? Math.max(...programas.map(p => p.id)) + 1 : 1;
    const nueva = { id: idGen, nombre: limpiarTexto(formPrograma.nombre), facultad: formPrograma.facultad, sede: formPrograma.sede };
    const nuevaLista = [nueva, ...programas];
    setProgramas(nuevaLista); localStorage.setItem('sgtp_programas', JSON.stringify(nuevaLista));
    setFormPrograma({ nombre: '', facultad: '', sede: '' }); alert("Programa registrado exitosamente.");
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
    if(!window.confirm(`¿Seguro que desea eliminar este registro?`)) return;
    if (tipo === 'sede') { const res = sedes.filter(x => x.id !== id); setSedes(res); localStorage.setItem('sgtp_sedes', JSON.stringify(res)); }
    if (tipo === 'facultad') { const res = facultades.filter(x => x.id !== id); setFacultades(res); localStorage.setItem('sgtp_facultades', JSON.stringify(res)); }
    if (tipo === 'programa') { const res = programas.filter(x => x.id !== id); setProgramas(res); localStorage.setItem('sgtp_programas', JSON.stringify(res)); }
    if (tipo === 'asignatura') { const res = asignaturas.filter(x => x.id !== id); setAsignaturas(res); localStorage.setItem('sgtp_asignaturas', JSON.stringify(res)); }
  };

  const handleCheckboxProgramas = (progNombre) => {
    const actual = formAsignatura.programasRelated;
    if (actual.includes(progNombre)) setFormAsignatura({ ...formAsignatura, programasRelated: actual.filter(p => p !== progNombre) });
    else setFormAsignatura({ ...formAsignatura, programasRelated: [...actual, progNombre] });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      <div className="bg-[#1a232f] p-6 text-white border-b-4 border-[#EBB700] rounded-t-xl">
        <h2 className="text-2xl font-bold tracking-wide">Gestión Académica Institucional</h2>
        <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Configuración de Sedes, Facultades, Programas y Asignaturas</p>
      </div>

      <div className="flex px-8 mt-6 space-x-2 border-b border-gray-200">
        {['sedes', 'facultades', 'programas', 'asignaturas'].map((tab) => (
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

        {/* --- VISTA: SEDES --- */}
        {pestañaActual === 'sedes' && (
          <div>
            <form onSubmit={guardarSede} className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 border-t-[#EBB700] mb-8 shadow-sm">
              <h4 className="text-lg font-bold text-[#1B2631] mb-5 uppercase tracking-wider">Registrar Nueva Sede</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre de la Sede *</label><input type="text" value={formSede.nombre} onChange={(e) => setFormSede({...formSede, nombre: e.target.value})} placeholder="Ej: ZARAGOCILLA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631]" required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Municipio / Ciudad *</label><input type="text" value={formSede.municipio} onChange={(e) => setFormSede({...formSede, municipio: e.target.value})} placeholder="Ej: CARTAGENA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631]" required /></div>
              </div>
              <div className="flex justify-end mt-5"><button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800">Guardar Sede</button></div>
            </form>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4">ID</th><th className="p-4">Nombre de la Sede</th><th className="p-4">Municipio</th><th className="p-4 text-center">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y bg-white">
                {sedes.filter(s => s.nombre.includes(busqueda.toUpperCase())).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50"><td className="p-4 font-bold text-gray-500">{s.id}</td><td className="p-4 font-black text-[#1B2631]">{s.nombre}</td><td className="p-4 font-medium">{s.municipio}</td><td className="p-4 text-center"><button onClick={() => eliminarEntidad('sede', s.id)} className="text-red-600 font-bold hover:text-red-800 text-xs">Eliminar</button></td></tr>
                ))}
                {sedes.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No hay sedes registradas.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA: FACULTADES --- */}
        {pestañaActual === 'facultades' && (
          <div>
            <form onSubmit={guardarFacultad} className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 border-t-[#EBB700] mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre de la Facultad *</label><input type="text" value={formFacultad.nombre} onChange={(e) => setFormFacultad({nombre: e.target.value})} placeholder="Ej: INGENIERÍA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631]" required /></div>
              <button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800 w-full md:w-auto">Guardar Facultad</button>
            </form>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4 w-24">ID</th><th className="p-4">Nombre de la Facultad</th><th className="p-4 text-center w-32">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y bg-white">
                {facultades.filter(f => f.nombre.includes(busqueda.toUpperCase())).map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50"><td className="p-4 font-bold text-gray-500">{f.id}</td><td className="p-4 font-black text-[#1B2631]">{f.nombre}</td><td className="p-4 text-center"><button onClick={() => eliminarEntidad('facultad', f.id)} className="text-red-600 font-bold hover:text-red-800 text-xs">Eliminar</button></td></tr>
                ))}
                {facultades.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No hay facultades registradas.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA: PROGRAMAS --- */}
        {pestañaActual === 'programas' && (
          <div>
            <form onSubmit={guardarPrograma} className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-t-4 border-t-[#EBB700] shadow-sm mb-8">
              <h4 className="text-lg font-bold text-[#1B2631] mb-5 uppercase tracking-wider">Registrar Nuevo Programa Académico</h4>
              {facultades.length === 0 || sedes.length === 0 ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm font-bold">⚠ Atención: Debe registrar al menos una Facultad y una Sede antes de poder crear Programas.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end mb-5">
                    <div className="md:col-span-2"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre del Programa *</label><input type="text" value={formPrograma.nombre} onChange={(e) => setFormPrograma({...formPrograma, nombre: e.target.value})} placeholder="Ej: INGENIERÍA DE SISTEMAS" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#1B2631]" required /></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Facultad: *</label><select value={formPrograma.facultad} onChange={(e) => setFormPrograma({...formPrograma, facultad: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-[#1B2631]" required><option value="">Seleccione...</option>{facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sede Central: *</label><select value={formPrograma.sede} onChange={(e) => setFormPrograma({...formPrograma, sede: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-[#1B2631]" required><option value="">Seleccione...</option>{sedes.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}</select></div>
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-gray-800">Guardar Programa</button></div>
                  </div>
                </>
              )}
            </form>

            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#1B2631] text-white text-xs uppercase font-semibold">
                <tr><th className="p-4">Programa</th><th className="p-4">Facultad</th><th className="p-4">Sede Base</th><th className="p-4 text-center">Acciones</th></tr>
              </thead>
              <tbody className="text-sm divide-y bg-white">
                {programas.filter(p => p.nombre.includes(busqueda.toUpperCase())).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50"><td className="p-4 font-black text-[#1B2631]">{p.nombre}</td><td className="p-4 font-semibold text-gray-600">{p.facultad}</td><td className="p-4 text-gray-600">{p.sede}</td><td className="p-4 text-center"><button onClick={() => eliminarEntidad('programa', p.id)} className="text-red-600 font-bold hover:text-red-800 text-xs">Eliminar</button></td></tr>
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