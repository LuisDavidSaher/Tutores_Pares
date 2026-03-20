import React, { useState } from 'react';

const catalogoFacultades = ["INGENIERÍA", "CIENCIAS EXACTAS", "MEDICINA", "DERECHO"];
const catalogoProgramas = ["INGENIERÍA DE SISTEMAS", "MEDICINA", "DERECHO", "ODONTOLOGÍA", "ADMINISTRACIÓN"];

// Función para forzar mayúsculas y quitar tildes
const limpiarTexto = (texto) => texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\s]/g, "");

const Asignaturas = () => {
  // Solución Linter: Inicialización directa desde localStorage (Sin useEffect)
  const [asignaturas, setAsignaturas] = useState(() => {
    const materiasGuardadas = localStorage.getItem('sgtp_asignaturas');
    return materiasGuardadas ? JSON.parse(materiasGuardadas) : [];
  });
  
  // Estados del Formulario
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [facultad, setFacultad] = useState('');
  const [programasSeleccionados, setProgramasSeleccionados] = useState([]);

  const handleCheckboxChange = (programa) => {
    if (programasSeleccionados.includes(programa)) {
      setProgramasSeleccionados(programasSeleccionados.filter(p => p !== programa));
    } else {
      setProgramasSeleccionados([...programasSeleccionados, programa]);
    }
  };

  const guardarAsignatura = (e) => {
    e.preventDefault();
    if (programasSeleccionados.length === 0) {
      alert("Debe seleccionar al menos un programa académico para esta asignatura."); return;
    }

    const nuevaAsignatura = {
      id: Date.now(),
      codigo: codigo,
      nombre: limpiarTexto(nombre),
      facultad: facultad,
      programas: programasSeleccionados
    };

    const nuevaLista = [nuevaAsignatura, ...asignaturas];
    setAsignaturas(nuevaLista);
    
    // Guardar en la memoria del navegador
    localStorage.setItem('sgtp_asignaturas', JSON.stringify(nuevaLista));

    // Limpiar formulario
    setCodigo(''); setNombre(''); setFacultad(''); setProgramasSeleccionados([]);
    alert("¡Asignatura creada y vinculada al catálogo del sistema!");
  };

  const eliminarAsignatura = (id) => {
    if(!window.confirm("¿Seguro que desea eliminar esta asignatura del catálogo?")) return;
    const nuevaLista = asignaturas.filter(a => a.id !== id);
    setAsignaturas(nuevaLista);
    localStorage.setItem('sgtp_asignaturas', JSON.stringify(nuevaLista));
  };

  const limpiarFormulario = () => {
    setCodigo(''); setNombre(''); setFacultad(''); setProgramasSeleccionados([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      {/* HEADER GLOBAL */}
      <div className="bg-[#1a232f] p-6 text-white border-b-4 border-[#EBB700]">
        <h2 className="text-2xl font-bold tracking-wide">Gestión de Asignaturas (Catálogo)</h2>
        <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Univ. de Cartagena - Bienestar Universitario</p>
      </div>

      <div className="p-8 animate-fade-in">
        
        {/* FORMULARIO DE CREACIÓN */}
        <form onSubmit={guardarAsignatura} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mb-10">
          <h3 className="text-xl font-bold text-[#1B2631] mb-6 border-b border-gray-200 pb-3">Registrar Nueva Asignatura</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Código *</label>
              <input type="number" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: 1010101" className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#1B2631] font-bold" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre de la asignatura *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: CÁLCULO DIFERENCIAL" className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#1B2631] font-bold" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Facultad Base *</label>
              <select value={facultad} onChange={(e) => setFacultad(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded outline-none bg-white font-semibold" required>
                <option value="">Seleccionar facultad...</option>
                {catalogoFacultades.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 bg-white p-4 rounded border border-gray-300">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Programas Relacionados (Puede elegir varios) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catalogoProgramas.map(prog => (
                  <label key={prog} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-blue-50 rounded transition-colors">
                    <input type="checkbox" checked={programasSeleccionados.includes(prog)} onChange={() => handleCheckboxChange(prog)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-gray-700">{prog}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={limpiarFormulario} className="px-6 py-2.5 bg-gray-200 font-bold rounded hover:bg-gray-300 text-gray-700 transition">Limpiar</button>
            <button type="submit" className="bg-[#1B2631] text-white px-8 py-2.5 font-bold rounded shadow hover:bg-gray-800 transition">Guardar Asignatura</button>
          </div>
        </form>

        {/* TABLA DE ASIGNATURAS */}
        <h3 className="text-xl font-bold text-[#1B2631] mb-4">Asignaturas existentes en el catálogo</h3>
        <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-[#1B2631] text-white text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="p-4 w-24">Código</th>
              <th className="p-4">Asignatura</th>
              <th className="p-4">Facultad</th>
              <th className="p-4">Programas Relacionados</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y bg-white">
            {asignaturas.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-8 text-gray-500 italic">No hay asignaturas registradas. Cree una arriba.</td></tr>
            ) : (
              asignaturas.map((asig) => (
                <tr key={asig.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-700">{asig.codigo}</td>
                  <td className="p-4 font-black text-[#1B2631]">{asig.nombre}</td>
                  <td className="p-4 font-semibold text-gray-600">{asig.facultad}</td>
                  <td className="p-4 text-xs text-gray-500">{asig.programas.join(', ')}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => eliminarAsignatura(asig.id)} className="px-3 py-1 bg-red-50 text-red-600 font-bold rounded hover:bg-red-100 transition">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Asignaturas;