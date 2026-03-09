import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import logoCorto from '../assets/Logo_Corto.png';
import logoUdc from '../assets/Logo_Completo.png';

import GestionDatos from './GestionDatos.jsx';
import Certificados from './Certificados.jsx';
import Dashboard from './Dashboard.jsx';
import Reportes from './Reportes.jsx';
import Auditorias from './Auditorias.jsx';
import Inicio from './Inicio.jsx';
import GestionUsuarios from './GestionUsuarios.jsx';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeMenu, setActiveMenu] = useState('Inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuOptions = [
    'Inicio',
    'Gestión de Usuarios',
    'Gestión de Tutores y Tutorados',
    'Reportes',
    'Dashboard Estadísticas',
    'Auditorías',
    'Certificados'
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* --- BARRA LATERAL (SIDEBAR) --- */}
      <aside className={`bg-[#1B2631] text-white flex flex-col justify-between shadow-2xl transition-all duration-300 shrink-0 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div>
          <div className={`p-6 flex items-center border-b border-gray-700 transition-all ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <img src={logoCorto} alt="Logo Corto UDC" className="w-12 h-12 object-contain shrink-0" />
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden whitespace-nowrap">
                <h2 className="font-bold text-sm tracking-wide text-white">GESTOR DE TUTORES</h2>
                <p className="text-xs text-[#EBB700]">Univ. de Cartagena</p>
              </div>
            )}
          </div>

          <nav className="mt-6 flex flex-col gap-1 px-3">
            {menuOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActiveMenu(option)}
                title={!isSidebarOpen ? option : ""}
                className={`flex items-center py-3 rounded-lg text-sm font-medium transition-all ${
                  isSidebarOpen ? 'px-4 w-full' : 'justify-center w-full'
                } ${
                  activeMenu === option 
                    ? 'bg-white/10 text-[#EBB700] border-l-4 border-[#EBB700]' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${activeMenu === option ? 'bg-[#EBB700]' : 'bg-gray-500'} ${isSidebarOpen ? 'mr-3' : ''}`}></span>
                {isSidebarOpen && <span className="whitespace-nowrap overflow-hidden">{option}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className={`p-4 border-t border-gray-700 bg-black/20 flex ${isSidebarOpen ? 'justify-between items-center' : 'flex-col justify-center space-y-4'}`}>
          <div className={`flex items-center overflow-hidden ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-[#EBB700] text-[#1B2631] flex items-center justify-center font-bold text-lg shrink-0">
              {user.name.charAt(0)}
            </div>
            {isSidebarOpen && (
              <div className="truncate">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.role}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={logout}
            title="Cerrar Sesión"
            className={`p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors ${!isSidebarOpen && 'w-full flex justify-center'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </aside>

      {/* --- ÁREA DE CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 relative">
        
        <header className="bg-white px-8 py-5 border-b border-gray-200 shadow-sm flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none transition-colors"
              title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="text-sm text-gray-500 hidden sm:block">
            Periodo Académico: <span className="font-bold text-[#1B2631]">2026-I</span>
          </div>
        </header>

        {/* Contenedor dinámico de vistas */}
        <div className="p-8 flex-1">
          {activeMenu === 'Inicio' ? (
            <Inicio setActiveMenu={setActiveMenu} />
          ) : activeMenu === 'Gestión de Usuarios' ? (
            <GestionUsuarios />
          ) : activeMenu === 'Gestión de Tutores y Tutorados' ? (
            <GestionDatos />
          ) : activeMenu === 'Certificados' ? (
            <Certificados />
          ) : activeMenu === 'Dashboard Estadísticas' ? (
            <Dashboard />
          ) : activeMenu === 'Reportes' ? (
            <Reportes />
          ) : activeMenu === 'Auditorías' ? (
            <Auditorias />
          ) : null}
        </div>

        {/* --- FOOTER GLOBAL --- */}
        <footer className="bg-white border-t border-gray-200 mt-auto w-full">
          <div className="max-w-7xl mx-auto p-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              
              <div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm">Sistema de Gestión de Tutores Pares (SGTP)</h3>
                <p className="text-gray-500 text-sm mb-4">Universidad de Cartagena</p>
                <img src={logoUdc} alt="Universidad de Cartagena" className="w-48 object-contain" />
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Enlaces Rápidos</h3>
                <ul className="text-gray-500 text-sm space-y-2 mb-6">
                  <li><a href="https://www.unicartagena.edu.co/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1B2631] transition-colors">Portal Universidad de Cartagena</a></li>
                  <li><a href="#" className="hover:text-[#1B2631] transition-colors">Guía de Uso del Aplicativo</a></li>
                </ul>
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Redes Sociales</h3>
                <div className="flex space-x-3">
                  
                  {/* Facebook (SVG Seguro) */}
                  <a href="#" className="w-8 h-8 rounded-full bg-yellow-50 text-[#EBB700] hover:bg-[#EBB700] hover:text-white transition-all flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  
                  {/* Instagram (SVG Seguro) */}
                  <a href="#" className="w-8 h-8 rounded-full bg-yellow-50 text-[#EBB700] hover:bg-[#EBB700] hover:text-white transition-all flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  
                  {/* X / Twitter (SVG Seguro) */}
                  <a href="#" className="w-8 h-8 rounded-full bg-yellow-50 text-[#EBB700] hover:bg-[#EBB700] hover:text-white transition-all flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                  </a>

                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Contacto y Soporte</h3>
                <p className="text-gray-500 text-sm mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Email:
                </p>
                <ul className="text-[#EBB700] text-sm space-y-2 font-medium">
                  <li><a href="mailto:soporte@unicartagena.edu.co" className="hover:underline hover:text-yellow-600 transition-colors">soporte@unicartagena.edu.co</a></li>
                  <li><a href="mailto:bienestar@unicartagena.edu.co" className="hover:underline hover:text-yellow-600 transition-colors">bienestar@unicartagena.edu.co</a></li>
                </ul>
              </div>

            </div>
            
            <div className="pt-6 border-t border-gray-200 flex flex-col xl:flex-row justify-between items-center text-xs text-gray-500 space-y-4 xl:space-y-0">
              <div className="text-center xl:text-left">
                <p>© 2026 Universidad de Cartagena. Todos los Derechos Reservados - NIT: 890480123-5</p>
                <p className="mt-1">Institución de Educación Superior sujeta a inspección y vigilancia por el MEN</p>
                <p className="mt-3 text-gray-400">Sus datos personales están protegidos conforme a la Ley 1581 de 2012 y la Ley 1266 de 2008 (Habeas Data).</p>
              </div>
              <div className="flex space-x-3 md:space-x-4 font-medium">
                <a href="#" className="hover:text-[#1B2631] transition-colors">Acerca de</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-[#1B2631] transition-colors">Política de Privacidad</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-[#1B2631] transition-colors">Términos y Condiciones</a>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default MainLayout;