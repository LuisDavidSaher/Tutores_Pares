import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import bgImage from './assets/universidad-de-cartagena-banner.jpg';
import logoUdc from './assets/logo-udc.png';
import MainLayout from './components/MainLayout.jsx';

function App() {
  const { user, login, loading } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);

  const [cedulaCertificado, setCedulaCertificado] = useState('');
  const [cargandoCertificado, setCargandoCertificado] = useState(false);
  const [mensajeCertificado, setMensajeCertificado] = useState({ tipo: '', texto: '' });

  // SERVICIO DE AUTENTICACIÓN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@unicartagena.edu.co')) {
      setErrorLogin('Debe usar un correo institucional válido (@unicartagena.edu.co).');
      return;
    }

    setEstaCargando(true);
    setErrorLogin('');

    const result = await login(email, password);

    if (!result.success) {
      setErrorLogin(result.message);
      setEstaCargando(false);
    } else {
      setTimeout(() => {
        setEstaCargando(false);
      }, 500); 
    }
  };

  // SERVICIO DE DESCARGA PÚBLICA DE CERTIFICADOS
  const handleDescargarCertificado = async (e) => {
    e.preventDefault();
    if (!cedulaCertificado) return;

    setCargandoCertificado(true);
    setMensajeCertificado({ tipo: '', texto: '' });

    try {
      const response = await fetch(`http://localhost:8080/api/certificados/${cedulaCertificado}`);

      if (!response.ok) {
        throw new Error('Certificado no encontrado. Verifique el número de documento.');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Certificado_Tutor_${cedulaCertificado}.pdf`; 
      
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setMensajeCertificado({ tipo: 'exito', texto: 'Certificado descargado con éxito.' });
      setCedulaCertificado('');

    } catch (error) {
      setMensajeCertificado({ tipo: 'error', texto: error.message });
    } finally {
      setCargandoCertificado(false);
      setTimeout(() => setMensajeCertificado({ tipo: '', texto: '' }), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-udc-primary"></div>
      </div>
    );
  }

  if (user) {
    return <MainLayout />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      
      {/* PANEL VISUAL IZQUIERDO */}
      <div className="hidden lg:flex w-[60%] relative flex-col justify-center items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative z-10 text-center px-10">
          <img src={logoUdc} alt="Universidad de Cartagena" className="h-36 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="text-4xl xl:text-5xl font-black text-white drop-shadow-lg tracking-tight leading-tight uppercase">
            GESTOR DE TUTORES PARES
          </h1>
        </div>
      </div>

      {/* PANEL DE FORMULARIOS DERECHO */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center bg-white px-10 xl:px-16 relative overflow-y-auto">
        
        {estaCargando && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-udc-secondary mb-3"></div>
            <p className="text-sm font-bold text-udc-primary animate-pulse">Verificando credenciales...</p>
          </div>
        )}

        <div className="w-full max-w-md mt-10">
          <h2 className="text-3xl font-black text-udc-primary mb-2 tracking-tight">Inicio de Sesión</h2>
          <p className="text-gray-500 mb-8 text-sm">Acceso exclusivo para personal administrativo</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Correo electrónico institucional</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="usuario@unicartagena.edu.co"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-udc-primary focus:ring-1 focus:ring-udc-primary outline-none transition-all text-sm bg-gray-50 focus:bg-white" 
                required 
              />
            </div>
            
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-700">Contraseña</label>
              </div>
              <input 
                type={mostrarPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-udc-primary focus:ring-1 focus:ring-udc-primary outline-none transition-all text-sm bg-gray-50 focus:bg-white pr-12" 
                required 
              />
              <button 
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-[30px] text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {mostrarPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            {errorLogin && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errorLogin}
              </div>
            )}

            <button 
              type="submit" 
              disabled={estaCargando} 
              className={`w-full text-white py-3 rounded-lg font-bold tracking-wide transition-colors mt-4 ${estaCargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-udc-primary hover:bg-gray-800 shadow-md'}`}
            >
              INICIAR SESIÓN
            </button>
          </form>

          {/* SEPARADOR ZONA PÚBLICA */}
          <div className="mt-10 mb-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white px-4 text-gray-400">ZONA PÚBLICA (ESTUDIANTES)</span>
            </div>
          </div>

          {/* MÓDULO DE DESCARGA DE CERTIFICADOS */}
          <div className="bg-gray-50 border border-gray-200 border-t-4 border-t-udc-secondary p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-udc-primary mb-1">Descarga de Certificado</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Ingrese su número de documento para descargar el certificado de participación.</p>
            
            <div className="flex gap-2">
              <input 
                type="number" 
                value={cedulaCertificado}
                onChange={(e) => setCedulaCertificado(e.target.value)}
                placeholder="No. de Documento" 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-udc-secondary bg-white"
                disabled={cargandoCertificado}
              />
              <button 
                onClick={handleDescargarCertificado}
                disabled={cargandoCertificado || !cedulaCertificado}
                className={`px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors whitespace-nowrap ${cargandoCertificado || !cedulaCertificado ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-udc-secondary text-udc-primary hover:bg-yellow-500'}`}
              >
                {cargandoCertificado ? 'Buscando...' : 'Descargar'}
              </button>
            </div>
            
            {mensajeCertificado.texto && (
              <p className={`text-xs font-semibold mt-3 ${mensajeCertificado.tipo === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {mensajeCertificado.texto}
              </p>
            )}
          </div>

        </div>

        <div className="absolute bottom-6 text-center w-full px-10">
          <p className="text-[10px] text-gray-400 font-medium">© {new Date().getFullYear()} Universidad de Cartagena. Todos los derechos reservados.</p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">Sistema de Gestión de Tutoría entre Pares (SGTP)</p>
        </div>
      </div>
    </div>
  );
}

export default App;