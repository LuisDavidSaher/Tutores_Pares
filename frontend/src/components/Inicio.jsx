import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import bannerUdc from '../assets/universidad-de-cartagena-banner.jpg';

// Recibimos "setActiveMenu" como una propiedad para poder cambiar de pantalla desde aquí
const Inicio = ({ setActiveMenu }) => {
  // Traemos los datos del usuario logueado desde nuestra caja fuerte
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* Banner de Bienvenida Institucional */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm h-72 border-b-4 border-[#EBB700]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bannerUdc})` }}>
          {/* Un degradado oscuro para que el texto blanco resalte perfectamente */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B2631] via-[#1B2631]/90 to-transparent"></div>
        </div>
        <div className="relative z-10 p-10 flex flex-col justify-center h-full text-white w-full md:w-2/3">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">¡Hola, {user?.name || 'Funcionario'}!</h1>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed font-light">
            Bienvenido al Sistema de Gestión de Tutoría entre Pares (SGTP) de la Universidad de Cartagena. 
            Seleccione una acción rápida para comenzar o utilice el menú lateral.
          </p>
          <div className="inline-flex items-center space-x-2 bg-[#EBB700] text-[#1B2631] px-5 py-2.5 rounded-lg font-black text-sm w-max shadow-md uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Rol Activo: {user?.role || 'No definido'}</span>
          </div>
        </div>
      </div>

      {/* Sección de Accesos Rápidos */}
      <div>
        <h2 className="text-xl font-bold text-[#1B2631] mb-6 flex items-center tracking-wide uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#EBB700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Accesos Rápidos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta 1: Ir a Reportes */}
          <button 
            onClick={() => setActiveMenu('Reportes')} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#EBB700] transition-all text-left group flex flex-col justify-between h-full"
          >
            <div>
              <div className="w-12 h-12 bg-gray-50 text-[#1B2631] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#1B2631] group-hover:text-[#EBB700] transition-colors border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1B2631] text-lg mb-2 group-hover:text-[#EBB700] transition-colors">Diligenciar Reportes</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Registrar evaluaciones iniciales y finales de tutores y tutorados.</p>
            </div>
          </button>

          {/* Tarjeta 2: Ir a Gestión (Solo si es Admin) */}
          {user?.role === 'Administrador' ? (
            <button 
              onClick={() => setActiveMenu('Gestión de Usuarios')} 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#EBB700] transition-all text-left group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 bg-gray-50 text-[#1B2631] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#1B2631] group-hover:text-[#EBB700] transition-colors border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#1B2631] text-lg mb-2 group-hover:text-[#EBB700] transition-colors">Gestión de Usuarios</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Crear o revocar cuentas de Jefes de Departamento en el sistema.</p>
              </div>
            </button>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner text-center flex flex-col items-center justify-center h-full opacity-60">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               <h3 className="font-bold text-gray-500 mb-1">Módulo Restringido</h3>
               <p className="text-xs text-gray-400">Acceso exclusivo para el Administrador Global.</p>
            </div>
          )}

          {/* Tarjeta 3: Ir a Estadísticas */}
          <button 
            onClick={() => setActiveMenu('Dashboard Estadísticas')} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#EBB700] transition-all text-left group flex flex-col justify-between h-full"
          >
            <div>
              <div className="w-12 h-12 bg-gray-50 text-[#1B2631] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[#1B2631] group-hover:text-[#EBB700] transition-colors border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1B2631] text-lg mb-2 group-hover:text-[#EBB700] transition-colors">Dashboard Estadísticas</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Visualizar gráficos e indicadores de éxito del periodo académico actual.</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Inicio;