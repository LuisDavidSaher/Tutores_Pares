import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // <-- Traemos el contexto
import bgImage from './assets/universidad-de-cartagena-banner.jpg';
import logoUdc from './assets/logo-udc.png';
import MainLayout from './components/MainLayout.jsx';

function App() {
  // 1. Extraemos las funciones de nuestro contexto
  const { user, login } = useContext(AuthContext);

  // 2. Creamos estados locales para guardar lo que se escribe en los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Función que se ejecuta al darle clic a "INICIAR SESIÓN"
  const handleLogin = (e) => {
    e.preventDefault(); // Evita que la página recargue automáticamente
    login(email, password);
  };

  // --- VISTA DE ÉXITO (Si ya inició sesión) ---
  if (user) {
    return <MainLayout />;
  }

  // --- VISTA DE LOGIN (Si no ha iniciado sesión) ---
  return (
    <div className="min-h-screen flex bg-white">
      {/* Mitad Izquierda: 60% */}
      <div className="hidden lg:flex lg:w-2/3 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-12">
          <img src={logoUdc} alt="Escudo Universidad de Cartagena" className="w-80 mb-8" />
          <h1 className="text-4xl font-bold tracking-wider text-center">GESTOR DE TUTORES PARES</h1>
        </div>
      </div>

      {/* Mitad Derecha: Formulario 40% */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
          <p className="text-gray-500 mb-8">Inicie sesión en su cuenta</p>

          {/* Agregamos el onSubmit al formulario */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input 
                type="email" 
                value={email} // <-- Conectamos al estado
                onChange={(e) => setEmail(e.target.value)} // <-- Guardamos cada letra que escribe
                placeholder="tu.correo@unicartagena.edu.co"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B2631] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <a href="#" className="text-sm font-medium text-[#EBB700] hover:text-yellow-600">¿Olvidaste tu contraseña?</a>
              </div>
              <input 
                type="password" 
                value={password} // <-- Conectamos al estado
                onChange={(e) => setPassword(e.target.value)} // <-- Guardamos la contraseña
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B2631] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <button type="submit" className="w-full bg-[#1B2631] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-4">
              INICIAR SESIÓN
            </button>
          </form>

          {/* ... Separador y botón de Google igual que antes ... */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className="h-px w-full bg-gray-200"></span>
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">O CONTINUAR CON</span>
            <span className="h-px w-full bg-gray-200"></span>
          </div>
          <button className="w-full mt-6 flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>
          <p className="mt-12 text-xs text-gray-500 text-center">
            © 2026 Universidad de Cartagena. Todos los derechos reservados.<br/>
            Sistema de Gestión de Tutoría entre Pares (SGTP)
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;