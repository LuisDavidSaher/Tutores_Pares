import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Modal de Crear Usuario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevoRol, setNuevoRol] = useState('Jefe de Departamento Académico');
  const [errorFormulario, setErrorFormulario] = useState('');
  const [guardando, setGuardando] = useState(false);

  // 1. Cargar los usuarios desde Supabase al entrar a la pantalla
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('roles_usuarios')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setUsuarios(data);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error.message);
    } finally {
      setCargando(false);
    }
  };

  // 2. Función para formatear el nombre basado en el correo
  const formatearNombre = (correo) => {
    return correo.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // 3. Crear un nuevo usuario en la base de datos
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setErrorFormulario('');

    // Validación estricta de negocio
    if (!nuevoCorreo.endsWith('@unicartagena.edu.co')) {
      setErrorFormulario('El usuario debe tener un correo institucional válido.');
      return;
    }

    setGuardando(true);
    try {
      // Verificamos si ya existe en la tabla
      const { data: existente } = await supabase
        .from('roles_usuarios')
        .select('correo')
        .eq('correo', nuevoCorreo)
        .single();

      if (existente) {
        throw new Error('Este correo ya tiene un rol asignado en el sistema.');
      }

      // Insertamos el nuevo rol en la base de datos
      const { error } = await supabase
        .from('roles_usuarios')
        .insert([{ correo: nuevoCorreo, rol: nuevoRol }]);

      if (error) throw error;

      // Éxito: Cerramos modal, limpiamos y recargamos la tabla
      setMostrarModal(false);
      setNuevoCorreo('');
      setNuevoRol('Jefe de Departamento Académico');
      fetchUsuarios();
      
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  };

  // 4. Eliminar un usuario (Revocar acceso)
  const handleEliminarUsuario = async (id, correo) => {
    const confirmar = window.confirm(`¿Está seguro de revocar el acceso a ${correo}?`);
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('roles_usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchUsuarios(); // Recargamos la tabla para que desaparezca
    } catch (error) {
      alert("Error al eliminar usuario: " + error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
      
      {/* Encabezado del Módulo */}
      <div className="bg-[#1B2631] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios y Roles</h2>
          <p className="text-sm text-gray-300 mt-1">Administración de accesos al Sistema de Gestión de Tutores Pares.</p>
        </div>
        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-[#EBB700] text-[#1B2631] px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Nuevo Funcionario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="p-6">
        {cargando ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B2631]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4">Funcionario</th>
                  <th className="p-4">Correo Institucional</th>
                  <th className="p-4">Rol en el Sistema</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mr-3">
                          {usr.correo.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{formatearNombre(usr.correo)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{usr.correo}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        usr.rol === 'Administrador' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {usr.rol}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleEliminarUsuario(usr.id, usr.correo)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Revocar Acceso"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No hay usuarios registrados en la base de datos.</td>
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="bg-[#1B2631] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Asignar Nuevo Rol</h3>
              <button onClick={() => setMostrarModal(false)} className="text-gray-300 hover:text-white font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleCrearUsuario} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Correo Institucional del Funcionario</label>
                <input 
                  type="email" 
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  placeholder="ejemplo@unicartagena.edu.co" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B2631] outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nivel de Acceso (Rol)</label>
                <select 
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B2631] outline-none transition-all"
                >
                  <option value="Jefe de Departamento Académico">Jefe de Departamento Académico (Lómitado)</option>
                  <option value="Administrador">Administrador (Acceso Total)</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  * El Jefe solo puede diligenciar reportes. El Administrador tiene control total del sistema.
                </p>
              </div>

              {errorFormulario && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-bold">
                  {errorFormulario}
                </div>
              )}

              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className={`flex-1 px-4 py-2 text-white rounded-lg font-bold transition-colors flex justify-center items-center ${guardando ? 'bg-gray-400' : 'bg-[#1B2631] hover:bg-gray-800'}`}>
                  {guardando ? 'Guardando...' : 'Asignar Rol'}
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