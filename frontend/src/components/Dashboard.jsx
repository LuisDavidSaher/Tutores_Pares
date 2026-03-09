import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Datos: Programas académicos con la mayor cantidad de tutores
  const datosProgramas = [
    { nombre: 'Ing. Sistemas', tutores: 45 },
    { nombre: 'Medicina', tutores: 30 },
    { nombre: 'Derecho', tutores: 25 },
    { nombre: 'Económicas', tutores: 35 },
    { nombre: 'Odontología', tutores: 20 },
  ];

  // Datos: Asignaturas en las que más se recibe acompañamiento
  const datosAsignaturas = [
    { nombre: 'Cálculo Diferencial', tutorias: 120 },
    { nombre: 'Física Mecánica', tutorias: 98 },
    { nombre: 'Programación I', tutorias: 85 },
    { nombre: 'Química General', tutorias: 60 },
    { nombre: 'Biometría', tutorias: 45 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* --- NUEVO: Encabezado Institucional del Módulo --- */}
      <div className="bg-[#1B2631] p-6 rounded-xl shadow-sm border border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Análisis y Tendencias del Programa</h2>
          <p className="text-sm text-gray-300 mt-1">Métricas de rendimiento, distribución de tutores y demanda académica (Ciclo 2026-I).</p>
        </div>
        <div className="hidden md:block">
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600">
            Exportar Reporte PDF
          </button>
        </div>
      </div>

      {/* Fila superior: Tarjetas de resumen (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Tutores Activos</p>
            <p className="text-2xl font-bold text-gray-900">155</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tutorías Realizadas</p>
            <p className="text-2xl font-bold text-gray-900">1,240</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-[#EBB700] rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Certificados Emitidos</p>
            <p className="text-2xl font-bold text-gray-900">89</p>
          </div>
        </div>
      </div>

      {/* Fila inferior: Gráficos interactivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Tutores por Programa Académico</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosProgramas} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="tutores" fill="#1B2631" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Asignaturas de Mayor Demanda</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosAsignaturas} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis dataKey="nombre" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} width={110} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="tutorias" fill="#EBB700" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;