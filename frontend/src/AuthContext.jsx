/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';

// 1. Creamos el contexto (la caja fuerte)
export const AuthContext = createContext();

// 2. Creamos el "Proveedor", que es el componente que envolverá nuestra aplicación
export const AuthProvider = ({ children }) => {
  // Estado para guardar la información del usuario
  const [user, setUser] = useState(null);

  // Función para iniciar sesión con los roles reales del proyecto
  const login = (email, password) => {
    
    // 1. Administrador del Sistema / Desarrollador
    if (email === "admin@unicartagena.edu.co" && password === "123456") {
      setUser({ email, role: 'Administrador del Sistema', name: 'Equipo de Desarrollo' });
      return true;
    } 
    // 2. Jefe de Departamento Académico
    else if (email === "jefe@unicartagena.edu.co" && password === "123456") {
      setUser({ email, role: 'Jefe de Departamento Académico', name: 'Dr. Carlos Mendoza' });
      return true;
    } 
    // 3. Centro de Bienestar Estudiantil y Laboral
    else if (email === "bienestar@unicartagena.edu.co" && password === "123456") {
      setUser({ email, role: 'Centro de Bienestar', name: 'Dra. Ana Gómez' });
      return true;
    } 
    // Credenciales incorrectas
    else {
      alert("Credenciales incorrectas. Prueba con admin@, jefe@ o bienestar@ (clave: 123456)");
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};