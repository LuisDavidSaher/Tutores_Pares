import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Dashboard = () => {
  // Traemos el contexto para saber si es Admin o Jefe, y de qué programa
  const { user } = useContext(AuthContext);

  const [metricas, setMetricas] = useState({
    tutoresActivos: 0,
    tutoradosActivos: 0,
    asignaturas: 0,
    programas: 0,
    riesgoAlto: 0,
    riesgoBajo: 0,
    reportesCompletados: 0,
    reportesPendientes: 0,
    topProgramas: [], 
    topAsignaturas: [] 
  });

  // CONEXIÓN AL BACKEND
  useEffect(() => {
    let montado = true;
    const cargarMetricas = async () => {
      try {
        // Enviamos el programa del usuario como filtro al servidor
        const paramPrograma = user?.role === 'Administrador' ? 'MULTI-PROGRAMA (ADMIN)' : (user?.programa || '');
        const url = `http://localhost:8080/api/dashboard/metricas?programa=${encodeURIComponent(paramPrograma)}`;

        const respuesta = await fetch(url);
        if (respuesta.ok && montado) {
          const datos = await respuesta.json();
          setMetricas(prev => ({ ...prev, ...datos }));
        }
      } catch (error) {
        console.error("Error al cargar las métricas del Dashboard:", error);
      }
    };
    
    if(user) cargarMetricas();
    
    return () => { montado = false; };
  }, [user]);

  // Cálculos dinámicos para las barras de progreso
  const totalRiesgo = metricas.riesgoBajo + metricas.riesgoAlto;
  const porcentajeBajo = totalRiesgo > 0 ? Math.round((metricas.riesgoBajo / totalRiesgo) * 100) : 0;
  const porcentajeAlto = totalRiesgo > 0 ? Math.round((metricas.riesgoAlto / totalRiesgo) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#1B2631] p-6 text-white border-b-4 border-[#EBB700] rounded-t-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-wide">Dashboard de Estadísticas</h2>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">
            {user?.role === 'Administrador' ? 'Visión Global del Sistema' : `Métricas de ${user?.programa}`}
          </p>
        </div>
      </div>

      <div className="p-8 animate-fade-in">
        
        {/* TARJETAS DE MÉTRICAS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#1B2631] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tutores Activos</p>
                <h3 className="text-4xl font-black text-[#1B2631]">{metricas.tutoresActivos}</h3>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              </div>
            </div>
            <p className="text-xs text-green-600 font-bold mt-4">↑ 12% desde el último periodo</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#EBB700] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tutorados Activos</p>
                <h3 className="text-4xl font-black text-[#1B2631]">{metricas.tutoradosActivos}</h3>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-bold mt-4">Distribuidos en {metricas.programas} programas</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Asignaturas</p>
                <h3 className="text-4xl font-black text-[#1B2631]">{metricas.asignaturas}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-bold mt-4">Catálogo general habilitado</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Reportes Finales</p>
                <h3 className="text-4xl font-black text-[#1B2631]">{metricas.reportesCompletados}</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <p className="text-xs text-red-500 font-bold mt-4">Faltan {metricas.reportesPendientes} por cerrar</p>
          </div>

        </div>

        {/* SECCIÓN INFERIOR: GRÁFICOS Y DATOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-lg font-bold text-[#1B2631] mb-4">Métricas de Riesgo Inicial (Tutorados)</h4>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600">Bajo Rendimiento (Riesgo Bajo)</span>
                    <span className="text-[#1B2631]">{metricas.riesgoBajo} estudiantes ({porcentajeBajo}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#1B2631] h-2.5 rounded-full transition-all duration-1000" style={{ width: `${porcentajeBajo}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600">Alto Riesgo de Deserción</span>
                    <span className="text-red-600">{metricas.riesgoAlto} estudiantes ({porcentajeAlto}%)</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full shadow-sm transition-all duration-1000" style={{ width: `${porcentajeAlto}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* NUEVOS BLOQUES ESTADÍSTICOS CON TOP 10 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                   <h4 className="text-sm font-bold text-[#1B2631]">Top Programas (Tutores)</h4>
                </div>
                <ul className="space-y-3">
                  {metricas.topProgramas?.length > 0 ? metricas.topProgramas.slice(0, 5).map((prog, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700 truncate pr-2">{prog.nombre}</span>
                      <span className="bg-[#1B2631] text-white px-2 py-1 rounded text-xs font-bold">{prog.cantidad}</span>
                    </li>
                  )) : <p className="text-xs text-gray-400 italic">No hay datos suficientes aún.</p>}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                   <h4 className="text-sm font-bold text-[#1B2631]">Top Asignaturas (Tutorías)</h4>
                </div>
                <ul className="space-y-3">
                  {metricas.topAsignaturas?.length > 0 ? metricas.topAsignaturas.slice(0, 5).map((asig, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700 truncate pr-2">{asig.nombre}</span>
                      <span className="bg-[#EBB700] text-[#1B2631] px-2 py-1 rounded text-xs font-bold">{asig.cantidad}</span>
                    </li>
                  )) : <p className="text-xs text-gray-400 italic">No hay datos suficientes aún.</p>}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-[#1B2631] mb-5 border-b border-gray-100 pb-3 flex items-center">
              Guía Rápida
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-[#EBB700] font-black mr-2">✓</span>
                <div>
                  <p className="text-xs font-bold text-[#1B2631]">Reporte Inicial</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Registra tutores y tutorados al inicio del período.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#EBB700] font-black mr-2">✓</span>
                <div>
                  <p className="text-xs font-bold text-[#1B2631]">Reporte Final</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Cierra las tutorías al finalizar el semestre.</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
               <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1">Periodo Vigente</p>
               <p className="text-lg font-black text-[#1B2631]">2026-I</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;