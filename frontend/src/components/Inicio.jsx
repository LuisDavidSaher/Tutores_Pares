import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import bannerUdc from '../assets/universidad-de-cartagena-banner.jpg';

const Inicio = ({ setActiveMenu }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* BANNER INSTITUCIONAL */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm h-72 border-b-4 border-udc-secondary">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bannerUdc})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-udc-primary via-udc-primary/90 to-transparent"></div>
        </div>
        <div className="relative z-10 p-10 flex flex-col justify-center h-full text-white w-full md:w-2/3">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">¡Hola, {user?.name || 'Funcionario'}!</h1>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed font-light">
            Bienvenido al Sistema de Gestión de Tutores Pares (SGTP) de la Universidad de Cartagena. 
            Seleccione una acción rápida para comenzar o utilice el menú lateral.
          </p>
          <div className="inline-flex items-center space-x-2 bg-udc-secondary text-udc-primary px-5 py-2.5 rounded-lg font-black text-sm w-max shadow-md uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Rol Activo: {user?.role || 'No definido'}</span>
          </div>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <h2 className="text-xl font-bold text-udc-primary mb-6 flex items-center tracking-wide uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-udc-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Accesos Rápidos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <button 
            onClick={() => setActiveMenu('Reportes')} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-udc-secondary transition-all text-left group flex flex-col justify-between h-full"
          >
            <div>
              <div className="w-12 h-12 bg-gray-50 text-udc-primary rounded-lg flex items-center justify-center mb-5 group-hover:bg-udc-primary group-hover:text-udc-secondary transition-colors border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-udc-primary text-lg mb-2 group-hover:text-udc-secondary transition-colors">Diligenciar Reportes</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Registrar evaluaciones iniciales y finales de tutores y tutorados.</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveMenu('Gestión Académica')} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-udc-secondary transition-all text-left group flex flex-col justify-between h-full"
          >
            <div>
              <div className="w-12 h-12 bg-gray-50 text-udc-primary rounded-lg flex items-center justify-center mb-5 group-hover:bg-udc-primary group-hover:text-udc-secondary transition-colors border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="font-bold text-udc-primary text-lg mb-2 group-hover:text-udc-secondary transition-colors">Gestión Académica</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Configuración de programas, campus y asignaturas de la institución.</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveMenu('Dashboard Estadísticas')} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-udc-secondary transition-all text-left group flex flex-col justify-between h-full"
          >
            <div>
              <div className="w-12 h-12 bg-gray-50 text-udc-primary rounded-lg flex items-center justify-center mb-5 group-hover:bg-udc-primary group-hover:text-udc-secondary transition-colors border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="font-bold text-udc-primary text-lg mb-2 group-hover:text-udc-secondary transition-colors">Dashboard Estadísticas</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Visualizar gráficos e indicadores de éxito del periodo académico actual.</p>
            </div>
          </button>

          {user?.role === 'Administrador' && (
            <>
              <button 
                onClick={() => setActiveMenu('Gestión de Datos')} 
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-udc-secondary transition-all text-left group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 bg-gray-50 text-udc-primary rounded-lg flex items-center justify-center mb-5 group-hover:bg-udc-primary group-hover:text-udc-secondary transition-colors border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-udc-primary text-lg mb-2 group-hover:text-udc-secondary transition-colors">Gestión de Datos</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Ejecutar cargas masivas y consultar la base de datos histórica.</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveMenu('Gestión de Usuarios')} 
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-udc-secondary transition-all text-left group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 bg-gray-50 text-udc-primary rounded-lg flex items-center justify-center mb-5 group-hover:bg-udc-primary group-hover:text-udc-secondary transition-colors border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-udc-primary text-lg mb-2 group-hover:text-udc-secondary transition-colors">Gestión de Usuarios</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Crear o revocar cuentas de funcionarios autorizados en el sistema.</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveMenu('Auditorías')} 
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-udc-secondary transition-all text-left group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 bg-gray-50 text-udc-primary rounded-lg flex items-center justify-center mb-5 group-hover:bg-udc-primary group-hover:text-udc-secondary transition-colors border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-udc-primary text-lg mb-2 group-hover:text-udc-secondary transition-colors">Auditorías</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Revisar el registro de trazabilidad de acciones dentro del aplicativo.</p>
                </div>
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Inicio;