import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; 
import bgImage from './assets/universidad-de-cartagena-banner.jpg';
import logoUdc from './assets/logo-udc.png';
import MainLayout from './components/MainLayout.jsx';

function App() {
  // 1. Extraemos las funciones de nuestro contexto, incluyendo el estado global de carga
  const { user, login, loading } = useContext(AuthContext);

  // 2. Creamos estados locales para los inputs, errores y carga del formulario de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);

  // --- ESTADOS PARA LA ZONA PÚBLICA (DESCARGA DE CERTIFICADOS) ---
  const [cedulaCertificado, setCedulaCertificado] = useState('');
  const [cargandoCertificado, setCargandoCertificado] = useState(false);
  const [mensajeCertificado, setMensajeCertificado] = useState({ tipo: '', texto: '' });

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

    // Llamamos al AuthContext (Que ahora se conecta a Spring Boot)
    const result = await login(email, password);

    if (!result.success) {
      setErrorLogin(result.message);
      setEstaCargando(false);
    } else {
      // Pequeño retardo visual
      setTimeout(() => {
        setEstaCargando(false);
      }, 500);
    }
  };

  // --- FUNCIÓN PARA LA ZONA PÚBLICA (CONEXIÓN REAL A SPRING BOOT) ---
  const handleDescargarCertificado = async (e) => {
    e.preventDefault();
    if (!cedulaCertificado) return;

    setCargandoCertificado(true);
    setMensajeCertificado({ tipo: '', texto: '' });

    try {
      // Hacemos la petición a la puerta que creamos en Java
      const response = await fetch(`http://localhost:8080/api/certificados/${cedulaCertificado}`);

      if (!response.ok) {
        throw new Error('Certificado no encontrado. Verifique el número de documento.');
      }

      // Convertimos la respuesta en un archivo binario (Blob)
      const blob = await response.blob();
      
      // Creamos un enlace temporal en el navegador para forzar la descarga
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Certificado_Tutor_${cedulaCertificado}.pdf`; 
      
      document.body.appendChild(link);
      link.click();
      
      // Limpiamos el enlace temporal
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setMensajeCertificado({ tipo: 'exito', texto: '¡Certificado descargado con éxito!' });
      setCedulaCertificado('');

    } catch (error) {
      setMensajeCertificado({ tipo: 'error', texto: error.message });
    } finally {
      setCargandoCertificado(false);
      // Limpiamos el mensaje después de 5 segundos
      setTimeout(() => setMensajeCertificado({ tipo: '', texto: '' }), 5000);
    }
  };

  // --- VISTA DE CARGA INICIAL ---
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

  // --- VISTA DE LOGIN Y ZONA PÚBLICA ---
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
      <div className="w-full lg:w-1/3 flex flex-col justify-center p-8 relative overflow-y-auto">
        
        {/* Spinner superpuesto durante el inicio de sesión */}
        {estaCargando && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <svg className="animate-spin h-10 w-10 text-[#1B2631] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-[#1B2631] font-bold animate-pulse">Verificando credenciales...</p>
          </div>
        )}

        <div className="w-full max-w-md mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
          <p className="text-gray-500 mb-8">Inicie sesión en su cuenta administrativa</p>

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
              className={`w-full text-white py-3 rounded-lg font-bold tracking-wide transition-colors mt-4 ${estaCargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1B2631] hover:bg-gray-800'}`}
            >
              INICIAR SESIÓN
            </button>
          </form>

          {/*  NUEVA ZONA PÚBLICA DE CERTIFICADOS */}
          <div className="mt-10">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className="h-px w-full bg-gray-200"></span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest whitespace-nowrap uppercase">ZONA PÚBLICA (ESTUDIANTES)</span>
              <span className="h-px w-full bg-gray-200"></span>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm border-t-4 border-t-[#EBB700]">
              <h3 className="text-sm font-bold text-[#1B2631] mb-1">Descarga tu Certificado</h3>
              <p className="text-xs text-gray-500 mb-4">Si fuiste Tutor Par y culminaste el proceso exitosamente, ingresa tu documento.</p>
              
              <form onSubmit={handleDescargarCertificado} className="flex gap-2">
                <input 
                  type="number" 
                  value={cedulaCertificado}
                  onChange={(e) => setCedulaCertificado(e.target.value)}
                  placeholder="No. de Documento" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#EBB700] transition-colors bg-white font-medium"
                  required
                />
                <button 
                  type="submit" 
                  disabled={cargandoCertificado}
                  className="bg-[#EBB700] text-[#1B2631] px-5 py-2 rounded-lg font-bold text-sm shadow hover:bg-yellow-500 transition-colors whitespace-nowrap flex items-center disabled:opacity-70"
                >
                  {cargandoCertificado ? (
                    <svg className="animate-spin h-4 w-4 text-[#1B2631]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : 'Descargar'}
                </button>
              </form>
              
              {mensajeCertificado.texto && (
                <p className={`mt-3 text-xs font-bold text-center p-2 rounded ${mensajeCertificado.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {mensajeCertificado.texto}
                </p>
              )}
            </div>
          </div>

          <p className="mt-10 text-xs text-gray-400 text-center font-medium">
            © 2026 Universidad de Cartagena. Todos los derechos reservados.<br/>
            Sistema de Gestión de Tutoría entre Pares (SGTP)
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;