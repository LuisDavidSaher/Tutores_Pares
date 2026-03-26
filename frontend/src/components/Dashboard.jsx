import React from 'react';

const Dashboard = () => {
  // --- MOCK DATA: Simulando métricas del sistema ---
  const metricas = {
    tutoresActivos: 45,
    tutoradosActivos: 120,
    asignaturas: 18,
    programas: 6,
    riesgoAlto: 28,
    riesgoBajo: 92,
    reportesCompletados: 14,
    reportesPendientes: 5
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto pb-10 min-h-screen">
      
      {/* ==========================================
          HEADER PRINCIPAL ESTÁNDAR SGTP
      ========================================= */}
      <div className="bg-[#1B2631] p-6 text-white border-b-4 border-[#EBB700] rounded-t-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-wide">Dashboard de Estadísticas</h2>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">
            Visión General del Sistema de Gestión de Tutores Pares
          </p>
        </div>
      </div>

      <div className="p-8 animate-fade-in">
        
        {/* ==========================================
            TARJETAS DE MÉTRICAS PRINCIPALES (KPIs)
        ========================================== */}
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
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Reportes Finalizados</p>
                <h3 className="text-4xl font-black text-[#1B2631]">{metricas.reportesCompletados}</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <p className="text-xs text-red-500 font-bold mt-4">Faltan {metricas.reportesPendientes} por cerrar</p>
          </div>

        </div>

        {/* ==========================================
            SECCIÓN INFERIOR: GRÁFICOS Y DATOS
        ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Información General */}
          <div className="lg:col-span-2 bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#1B2631] mb-4 border-b border-gray-200 pb-3">Información General del Programa</h3>
            <p className="text-sm font-bold text-[#EBB700] mb-4">Bienvenido al Sistema de Gestión de Tutores.</p>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Este aplicativo facilita la administración del programa de retención estudiantil de la Universidad de Cartagena, permitiendo registrar tutores y tutorados, generar reportes y consultar estadísticas de manera centralizada.
            </p>

            <h4 className="text-lg font-bold text-[#1B2631] mb-4">Métricas de Riesgo (Tutorados)</h4>
            
            {/* Barras de Progreso Simuladas con CSS */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-600">Bajo Rendimiento (Riesgo Bajo)</span>
                  <span className="text-[#1B2631]">{metricas.riesgoBajo} estudiantes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#1B2631] h-2.5 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-600">Alto Riesgo de Deserción</span>
                  <span className="text-red-600">{metricas.riesgoAlto} estudiantes</span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full shadow-sm" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Guía de Uso (Mantenida del diseño original pero estilizada) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-[#1B2631] mb-5 border-b border-gray-100 pb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#EBB700]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                  <p className="text-[11px] text-gray-500 mt-0.5">Evalúa el desempeño y cierra las tutorías al finalizar el semestre.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#EBB700] font-black mr-2">✓</span>
                <div>
                  <p className="text-xs font-bold text-[#1B2631]">Consultar Datos</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Accede al histórico de tutores y tutorados mediante filtros.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#EBB700] font-black mr-2">✓</span>
                <div>
                  <p className="text-xs font-bold text-[#1B2631]">Asignaturas</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Alimenta el catálogo de materias para usarlas en los reportes.</p>
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