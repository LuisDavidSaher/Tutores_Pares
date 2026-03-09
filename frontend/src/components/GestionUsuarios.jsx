import React, { useState } from 'react';

const GestionUsuarios = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    rol: ''
  });
  
  const [errorCorreo, setErrorCorreo] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validación estricta del dominio en tiempo real
    if (name === 'correo') {
      if (value.length > 0 && !value.endsWith('@unicartagena.edu.co')) {
        setErrorCorreo('El correo debe pertenecer al dominio @unicartagena.edu.co');
      } else {
        setErrorCorreo('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.correo.endsWith('@unicartagena.edu.co')) {
      alert("Error: No se puede registrar un usuario ajeno a la institución.");
      return;
    }
    
    // Aquí simulamos el envío al backend
    alert(`Usuario ${formData.nombres} creado exitosamente con el rol: ${formData.rol}`);
    
    // Limpiar formulario
    setFormData({
      nombres: '', apellidos: '', correo: '', contrasena: '', rol: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl mx-auto">
      
      {/* Encabezado del Módulo */}
      <div className="bg-[#1B2631] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión y Control de Accesos</h2>
          <p className="text-sm text-gray-300 mt-1">Creación de credenciales para personal administrativo y académico.</p>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Datos del Usuario */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Sección: Datos Personales */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b pb-2">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                  <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631]" required placeholder="Ej: Carlos Alberto" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                  <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631]" required placeholder="Ej: Mendoza Ruiz" />
                </div>
              </div>
            </div>

            {/* Sección: Datos de Acceso */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b pb-2">Credenciales de Acceso</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional Oficial</label>
                  <input 
                    type="email" 
                    name="correo" 
                    value={formData.correo} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${errorCorreo ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-[#1B2631]'}`} 
                    required 
                    placeholder="usuario@unicartagena.edu.co" 
                  />
                  {errorCorreo && <p className="text-red-500 text-xs font-bold mt-1">{errorCorreo}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Temporal</label>
                    <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631]" required placeholder="Mínimo 8 caracteres" minLength="8" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Selección de Rol */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Asignación de Rol</h3>
            
            <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${formData.rol === 'Centro de Bienestar' ? 'border-[#1B2631] bg-blue-50 ring-1 ring-[#1B2631]' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-3">
                <input type="radio" name="rol" value="Centro de Bienestar" checked={formData.rol === 'Centro de Bienestar'} onChange={handleChange} className="text-[#1B2631] focus:ring-[#1B2631]" required />
                <div>
                  <span className="block text-sm font-bold text-gray-900">Administrador (Bienestar)</span>
                  <span className="block text-xs text-gray-500 mt-1">Gestión completa del sistema, estadísticas históricas y reportes globales.</span>
                </div>
              </div>
            </label>

            <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${formData.rol === 'Jefe de Departamento Académico' ? 'border-[#1B2631] bg-blue-50 ring-1 ring-[#1B2631]' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-3">
                <input type="radio" name="rol" value="Jefe de Departamento Académico" checked={formData.rol === 'Jefe de Departamento Académico'} onChange={handleChange} className="text-[#1B2631] focus:ring-[#1B2631]" required />
                <div>
                  <span className="block text-sm font-bold text-gray-900">Jefe de Departamento</span>
                  <span className="block text-xs text-gray-500 mt-1">Acceso restringido para diligenciar reportes iniciales y finales de su programa.</span>
                </div>
              </div>
            </label>

            <div className="pt-6 mt-6 border-t border-gray-200">
              <button 
                type="submit" 
                className="w-full bg-[#1B2631] text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!errorCorreo || !formData.correo}
              >
                Crear Cuenta Institucional
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default GestionUsuarios;