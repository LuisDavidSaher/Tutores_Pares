import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

// --- MENSAJERO DE AUDITORÍA ---
const enviarAuditoria = async (usuario, modulo, accion, detalle, estado = "Éxito") => {
  try {
    await fetch('http://localhost:8080/api/auditorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, modulo, accion, detalle, estado })
    });
  } catch (error) { 
    console.error("Fallo Auditoría silenciosa", error); 
  }
};

const GestionUsuarios = () => {
  const { user } = useContext(AuthContext); 
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [catalogoProgramas, setCatalogoProgramas] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState(''); 
  const [nuevoRol, setNuevoRol] = useState('Jefe de Departamento Académico');
  const [nuevoPrograma, setNuevoPrograma] = useState(''); 
  
  const [errorFormulario, setErrorFormulario] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetchUsuarios();
    fetchProgramas();
  }, []);

  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('http://localhost:8080/api/usuarios');
      if (!respuesta.ok) throw new Error("Error al obtener la lista de usuarios");
      const data = await respuesta.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const fetchProgramas = async () => {
    try {
      const respuesta = await fetch('http://localhost:8080/api/programas');
      if (respuesta.ok) {
        const data = await respuesta.json();
        setCatalogoProgramas(data.map(p => p.nombre));
      }
    } catch (error) {
      console.error("Error al cargar programas de Spring Boot:", error);
    }
  };

  const formatearNombre = (correo) => {
    return correo.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setErrorFormulario('');

    if (!nuevoCorreo.endsWith('@unicartagena.edu.co')) {
      setErrorFormulario('El usuario debe tener un correo institucional válido.');
      return;
    }
    if (nuevaPassword.length < 6) {
      setErrorFormulario('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nuevoRol === 'Jefe de Departamento Académico' && !nuevoPrograma) {
      setErrorFormulario('Debe seleccionar a qué programa pertenece este Jefe de Departamento.');
      return;
    }

    setGuardando(true);
    try {
      const rolCorto = nuevoRol === 'Administrador' ? 'Administrador' : 'Jefe de Departamento';
      const programaAsignar = rolCorto === 'Administrador' ? null : nuevoPrograma;

      const nuevoUsuario = {
        correo: nuevoCorreo,
        password: nuevaPassword,
        rol: rolCorto,
        programa: programaAsignar
      };

      const respuesta = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        throw new Error(errorText || "Error al crear el usuario en el servidor.");
      }

      enviarAuditoria(
        user?.role || 'Administrador', 
        "USUARIOS", 
        "CREACIÓN", 
        `Creó cuenta para ${nuevoCorreo} con rol ${rolCorto}`
      );

      setMostrarModal(false);
      setNuevoCorreo('');
      setNuevaPassword('');
      setNuevoPrograma('');
      setNuevoRol('Jefe de Departamento Académico');
      fetchUsuarios();
      
      alert(`Usuario ${nuevoCorreo} creado con éxito.`);
      
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarUsuario = async (id, correo) => {
    const confirmar = window.confirm(`¿Está seguro de revocar el acceso y eliminar de la BD a ${correo}?`);
    if (!confirmar) return;

    try {
      const respuesta = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: 'DELETE'
      });
      
      if (!respuesta.ok) throw new Error("No se pudo eliminar el usuario");
      
      enviarAuditoria(user?.role || 'Administrador', "USUARIOS", "ELIMINACIÓN", `Revocó acceso al usuario ${correo}`, "Alerta");
      fetchUsuarios(); 
    } catch (error) {
      alert("Error al eliminar usuario: " + error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto pb-10 min-h-screen">
      
      <div className="bg-[#1a232f] p-6 text-white flex justify-between items-center border-b-4 border-[#EBB700] rounded-t-xl">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Gestión de Usuarios y Roles</h2>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Administración de accesos al Sistema SGTP.</p>
        </div>
        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-[#EBB700] text-[#1B2631] px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Nuevo Usuario
        </button>
      </div>

      <div className="p-8">
        {cargando ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B2631]"></div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1B2631] text-white text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="p-4">Funcionario</th>
                  <th className="p-4">Correo Institucional</th>
                  <th className="p-4">Rol en el Sistema</th>
                  <th className="p-4">Programa Asignado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {usuarios.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mr-3 shrink-0">
                          {usr.correo.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-[#1B2631] truncate">{formatearNombre(usr.correo)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-500">{usr.correo}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        usr.rol === 'Administrador' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {usr.rol}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-600 text-xs">
                      {usr.programa ? usr.programa : <span className="text-gray-400 italic">Acceso Global</span>}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleEliminarUsuario(usr.id, usr.correo)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors font-bold text-xs"
                      >
                        Revocar
                      </button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-16 text-gray-500 font-medium bg-gray-50">No hay usuarios registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Crear Usuario */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border-t-4 border-[#EBB700]">
            <div className="bg-[#1B2631] px-6 py-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg tracking-wide">Asignar Nuevo Rol</h3>
              <button onClick={() => setMostrarModal(false)} className="text-gray-300 hover:text-white font-bold text-xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCrearUsuario} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Correo Institucional *</label>
                <input 
                  type="email" 
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  placeholder="ejemplo@unicartagena.edu.co" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#1B2631] bg-gray-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Contraseña de Acceso *</label>
                <input 
                  type="password" 
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#1B2631] bg-gray-50 focus:bg-white transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nivel de Acceso (Rol) *</label>
                <select 
                  value={nuevoRol}
                  onChange={(e) => {
                    setNuevoRol(e.target.value);
                    if(e.target.value === 'Administrador') setNuevoPrograma('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1B2631] outline-none focus:ring-1 focus:ring-[#1B2631] bg-gray-50 focus:bg-white transition-all"
                >
                  <option value="Jefe de Departamento Académico">Jefe de Departamento (Limitado)</option>
                  <option value="Administrador">Administrador (Acceso Total)</option>
                </select>
              </div>

              {nuevoRol === 'Jefe de Departamento Académico' && (
                <div className="animate-fade-in bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <label className="block text-[10px] font-bold text-yellow-800 uppercase tracking-widest mb-1">Asignar Programa *</label>
                  {catalogoProgramas.length === 0 ? (
                    <span className="text-xs font-bold text-red-500">⚠ No hay programas creados en Gestión Académica.</span>
                  ) : (
                    <select 
                      value={nuevoPrograma}
                      onChange={(e) => setNuevoPrograma(e.target.value)}
                      className="w-full px-3 py-2 border border-yellow-300 rounded text-sm outline-none bg-white text-[#1B2631]"
                      required
                    >
                      <option value="">Seleccione Programa...</option>
                      {catalogoProgramas.map(prog => (
                        <option key={prog} value={prog}>{prog}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {errorFormulario && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs text-center font-bold">
                  {errorFormulario}
                </div>
              )}

              <div className="pt-2 flex space-x-3">
                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-bold transition-colors flex justify-center items-center shadow ${guardando ? 'bg-gray-400' : 'bg-[#1B2631] hover:bg-gray-800'}`}>
                  {guardando ? 'Guardando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;