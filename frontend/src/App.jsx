import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; 
import bgImage from './assets/universidad-de-cartagena-banner.jpg';
import logoUdc from './assets/logo-udc.png';
import MainLayout from './components/MainLayout.jsx';

function App() {
  // 1. Extraemos las funciones de nuestro contexto, incluyendo el estado global de carga
  const { user, login, loading } = useContext(AuthContext);

  // 2. Creamos estados locales para los inputs, errores y carga del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);

  // 3. Función asíncrona que se ejecuta al darle clic a "INICIAR SESIÓN"
  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    // Validación de negocio (Correo institucional)
    if (!email.endsWith('@unicartagena.edu.co')) {
      setErrorLogin('Debe usar un correo institucional válido (@unicartagena.edu.co).');
      return;
    }

    setEstaCargando(true);
    setErrorLogin(''); 

    // Llamamos a Supabase a través del AuthContext
    const result = await login(email, password);

    if (!result.success) {
      setErrorLogin(result.message);
      setEstaCargando(false);
    }
  };

  // --- VISTA DE CARGA INICIAL (Mientras Supabase revisa la sesión) ---
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1B2631]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EBB700]"></div>
      </div>
    );
  }

  // --- VISTA DE ÉXITO (Si ya inició sesión) ---
  if (user) {
    return <MainLayout />;
  }

  // --- VISTA DE LOGIN (El diseño original impecable) ---
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
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 relative">
        
        {/* Spinner superpuesto durante el inicio de sesión */}
        {estaCargando && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <svg className="animate-spin h-10 w-10 text-[#1B2631] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-[#1B2631] font-bold animate-pulse">Verificando credenciales...</p>
          </div>
        )}

        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
          <p className="text-gray-500 mb-8">Inicie sesión en su cuenta</p>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
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
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B2631] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Mensaje de error visual */}
            {errorLogin && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
                {errorLogin}
              </div>
            )}

            <button 
              type="submit" 
              disabled={estaCargando}
              className={`w-full text-white py-3 rounded-lg font-semibold transition-colors mt-4 ${estaCargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1B2631] hover:bg-gray-800'}`}
            >
              INICIAR SESIÓN
            </button>
          </form>

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