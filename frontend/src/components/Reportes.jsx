import React, { useState } from 'react';

const Reportes = () => {
  const [tipoUsuario, setTipoUsuario] = useState('tutor'); 
  const [tipoReporte, setTipoReporte] = useState('inicial'); 
  
  // Nuevos estados para controlar la lógica de las sedes
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');

  // Estructura de datos basada en la arquitectura real de la universidad y sus modalidades
  const sedesYProgramas = {
    "Campus Claustro de San Agustín": [
      "Derecho", "Filosofía", "Historia", "Lingüística y Literatura", "Comunicación Social", "Trabajo Social", "Licenciaturas (Educación, Informática)"
    ],
    "Campus Ciencias Exactas y Naturales": [
      "Química", "Física", "Biología", "Matemáticas", "Metrología Industrial", "Lenguas Extranjeras"
    ],
    "Campus Ciencias de la Salud": [
      "Medicina", "Enfermería", "Odontología", "Química Farmacéutica", "Administración de Servicios de Salud", "Seguridad y Salud en el Trabajo"
    ],
    "Campus de Ciencias Económicas e Ingeniería": [
      "Administración de Empresas", "Administración Industrial", "Contaduría Pública", "Economía", "Administración Turística y Hotelera", "Administración Financiera", "Administración Pública", "Ingeniería Civil", "Ingeniería Química", "Ingeniería de Sistemas", "Ingeniería de Alimentos", "Ingeniería de Software (Distancia)", "Operación de Procesos Petroquímicos"
    ],
    "Centro Tutorial - San Juan Nepomuceno": [
      "Administración Agroindustrial (Distancia)", "Administración de Empresas", "Administración de Empresas Turísticas y Hoteleras", "Administración de Servicios de Salud", "Administración Financiera", "Ingeniería Civil", "Ingeniería de Alimentos", "Ingeniería de Software (Distancia)", "Ingeniería Química", "Licenciatura en Educación Infantil", "Trabajo Social"
    ],
    "Centro Tutorial - El Carmen de Bolívar": [
      "Administración de Servicios de Salud", "Administración Financiera", "Ingeniería de Software (Distancia)", "Seguridad y Salud en el Trabajo", "Licenciatura en Informática", "Licenciatura en Pedagogía Infantil"
    ],
    "Centro Tutorial - Magangué": [
      "Administración de Empresas", "Administración de Servicios de Salud", "Administración Financiera", "Ingeniería de Software (Distancia)", "Técnica Profesional en Gestión Pública", "Lenguas Extranjeras"
    ],
    "Centro Tutorial - Cereté (Córdoba)": [
      "Administración de Empresas (Distancia)", "Administración de Servicios de Salud", "Administración Financiera", "Ingeniería de Software (Distancia)", "Técnica Profesional en Gestión Pública"
    ],
    "Centro Tutorial - Lorica (Córdoba)": [
      "Administración de Empresas (Distancia)", "Administración de Servicios de Salud", "Administración Financiera", "Ingeniería de Software (Distancia)"
    ],
    "Centro Tutorial - Mompox": [
      "Administración de Empresas", "Administración de Empresas Turísticas y Hoteleras", "Administración de Servicios de Salud", "Administración Financiera", "Ingeniería de Software (Distancia)"
    ]
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reporte ${tipoReporte.toUpperCase()} de ${tipoUsuario.toUpperCase()} guardado con éxito. Sede: ${sedeSeleccionada}, Programa: ${programaSeleccionado}`);
  };

  // Función para limpiar el programa cuando se cambia de sede
  const handleCambioSede = (e) => {
    setSedeSeleccionada(e.target.value);
    setProgramaSeleccionado('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
      
      {/* Encabezado del Módulo */}
      <div className="bg-[#1B2631] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Módulo de Reportes Oficiales</h2>
          <p className="text-sm text-gray-300 mt-1">Diligenciamiento de datos de Tutores y Tutorados (Ciclo 2026-I)</p>
        </div>
      </div>

      {/* Controles de Selección */}
      <div className="p-6 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex bg-gray-200 p-1 rounded-lg w-full md:w-auto">
          <button onClick={() => setTipoUsuario('tutor')} className={`flex-1 md:w-40 py-2 text-sm font-semibold rounded-md transition-all ${tipoUsuario === 'tutor' ? 'bg-white text-[#1B2631] shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            Tutor Par
          </button>
          <button onClick={() => setTipoUsuario('tutorado')} className={`flex-1 md:w-40 py-2 text-sm font-semibold rounded-md transition-all ${tipoUsuario === 'tutorado' ? 'bg-white text-[#1B2631] shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            Tutorado
          </button>
        </div>

        <div className="flex space-x-2 w-full md:w-auto">
          <button onClick={() => setTipoReporte('inicial')} className={`flex-1 md:w-32 py-2 text-sm font-bold border-2 rounded-lg transition-all ${tipoReporte === 'inicial' ? 'border-[#EBB700] bg-yellow-50 text-yellow-800' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
            Reporte Inicial
          </button>
          <button onClick={() => setTipoReporte('final')} className={`flex-1 md:w-32 py-2 text-sm font-bold border-2 rounded-lg transition-all ${tipoReporte === 'final' ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
            Reporte Final
          </button>
        </div>
      </div>

      {/* Área del Formulario Dinámico */}
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
          Diligenciar Reporte {tipoReporte === 'inicial' ? 'Inicial' : 'Final'} - {tipoUsuario === 'tutor' ? 'Tutor Par' : 'Tutorado'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECCIÓN 1: DATOS GENERALES */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Datos Personales y Estudiantiles</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white">
                  <option>Cédula de Ciudadanía (CC)</option>
                  <option>Tarjeta de Identidad (TI)</option>
                  <option>Cédula de Extranjería (CE)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Estudiantil</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white">
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>Otro / Prefiero no decir</option>
                </select>
              </div>
              
              {/* NUEVO: Selectores de Sede y Programa */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sede / Campus</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-[#1B2631]" 
                  value={sedeSeleccionada}
                  onChange={handleCambioSede}
                  required
                >
                  <option value="">Seleccione una sede...</option>
                  {Object.keys(sedesYProgramas).map(sede => (
                    <option key={sede} value={sede}>{sede}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Programa Académico</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-[#1B2631] disabled:bg-gray-100 disabled:text-gray-400" 
                  value={programaSeleccionado}
                  onChange={(e) => setProgramaSeleccionado(e.target.value)}
                  disabled={!sedeSeleccionada}
                  required
                >
                  <option value="">Primero seleccione una sede...</option>
                  {sedeSeleccionada && sedesYProgramas[sedeSeleccionada].map(programa => (
                    <option key={programa} value={programa}>{programa}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* SECCIÓN 2: CAMPOS ESPECÍFICOS SEGÚN ROL */}
          {tipoUsuario === 'tutor' ? (
            <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
              <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-4">Métricas del Tutor Par</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promedio Acumulado</label>
                  <input type="number" step="0.1" max="5.0" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nota en la Asignatura</label>
                  <input type="number" step="0.1" max="5.0" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tutorados Asignados</label>
                  <input type="number" min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              
              {tipoReporte === 'final' && (
                <div className="mt-6 pt-6 border-t border-blue-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cumplió con la Labor</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white">
                      <option>Sí, cumplimiento total</option>
                      <option>No, cumplimiento parcial o nulo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horas Totales Certificadas</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-orange-50/50 p-6 rounded-lg border border-orange-100">
              <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-4">Métricas del Tutorado</h4>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo Identificado</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-orange-500">
                    <option>Bajo Rendimiento Académico</option>
                    <option>Riesgo de Deserción</option>
                    <option>Dificultad en Ciencias Exactas</option>
                    <option>Problemas de Adaptación</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>

              {tipoReporte === 'final' && (
                <div className="mt-6 pt-6 border-t border-orange-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recibió el Acompañamiento</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white">
                      <option>Sí, completó las sesiones</option>
                      <option>No, abandonó el proceso</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botón de Enviar */}
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-[#1B2631] text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md">
              Guardar Reporte Oficial
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Reportes;