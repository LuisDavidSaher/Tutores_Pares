import React, { useState } from 'react';
import logoUdc from '../assets/Logo_Corto.png';

const Certificados = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [certificadoVisible, setCertificadoVisible] = useState(false);
  const [error, setError] = useState('');

  // Simulamos la base de datos de tutores que SÍ cumplieron
  const buscarCertificado = (e) => {
    e.preventDefault(); 
    // Simulamos que el tutor con ID 1045234890 es el único registrado por ahora
    if (identificacion === '1045234890') {
      setCertificadoVisible(true);
      setError('');
    } else {
      setCertificadoVisible(false);
      setError('No se encontró un certificado válido para este número de identificación.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl mx-auto">
      
      {/* --- Encabezado Institucional del Módulo --- */}
      <div className="bg-[#1B2631] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Módulo de Certificación Oficial</h2>
          <p className="text-sm text-gray-300 mt-1">Generación y validación de constancias de labor para Tutores Pares.</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="p-8 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row items-end gap-4 justify-center">
        <div className="w-full md:w-1/2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Número de Identificación
          </label>
          <input 
            type="text" 
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            placeholder="Ej: 1045234890" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2631] text-lg text-center font-medium shadow-sm"
            required
          />
        </div>
        <button 
          onClick={buscarCertificado}
          className="w-full md:w-auto bg-[#1B2631] text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
          </svg>
          <span>GENERAR CERTIFICADO</span>
        </button>
      </div>

      {error && (
        <div className="text-center py-4 bg-red-50 border-b border-red-100 text-red-600 font-medium text-sm">
          {error}
        </div>
      )}

      {/* Vista Previa del Certificado (Solo se muestra si la búsqueda es exitosa) */}
      {certificadoVisible && (
        <div className="p-8 bg-gray-50/50">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vista Previa del Documento</span>
          </div>

          {/* El Documento Tipo "Diploma" */}
          <div className="bg-white p-12 shadow-lg border-2 border-[#EBB700] max-w-2xl mx-auto relative">
            
            <img src={logoUdc} alt="Logo UDC" className="w-32 h-auto mx-auto mb-6" />

            <div className="flex flex-col items-center text-center space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-widest">UNIVERSIDAD DE CARTAGENA</h1>
                <p className="text-sm italic text-gray-600">Fundada en 1827</p>
              </div>

              <div className="w-16 h-1 bg-[#EBB700] my-2"></div>

              <h2 className="text-xl font-serif text-gray-800 tracking-wide uppercase">El Centro de Bienestar Estudiantil</h2>
              
              <p className="text-gray-600 leading-relaxed px-8">
                Hace constar que el estudiante debidamente identificado, ha cumplido satisfactoriamente con las horas de servicio y requisitos académicos estipulados por el programa de:
              </p>

              <div>
                <h3 className="text-3xl font-black text-[#1B2631] tracking-tight">TUTOR PAR ACADÉMICO</h3>
                <p className="text-[#EBB700] font-bold mt-1 uppercase tracking-widest text-sm">Ciclo Académico 2026-I</p>
              </div>

              <div className="w-full mt-8 border-b-2 border-dashed border-gray-300 pb-2">
                <p className="text-2xl font-medium text-gray-800 italic">Carlos Andrés Ruiz</p>
              </div>

              <p className="text-xs text-gray-400 mt-4 px-12">
                Expedido en la ciudad de Cartagena de Indias, para los fines que el interesado considere pertinentes. Verificable mediante código QR institucional.
              </p>

              {/* Firmas */}
              <div className="flex justify-between w-full mt-10 pt-8 border-t border-gray-100 px-8">
                <div className="text-center">
                  <div className="w-32 h-px bg-gray-400 mb-2 mx-auto"></div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Dirección de Programa</p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-px bg-gray-400 mb-2 mx-auto"></div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Secretaría General</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button className="bg-white border-2 border-[#1B2631] text-[#1B2631] px-6 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center space-x-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Descargar PDF Oficial</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificados;