/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- REVISIÓN DE SESIÓN LOCAL  ---
  useEffect(() => {
    const checkSession = async () => {
      // Leemos si hay una sesión guardada en la memoria del navegador
      const sessionGuardada = localStorage.getItem('sgtp_session');
      if (sessionGuardada) {
        setUser(JSON.parse(sessionGuardada));
      }
      setLoading(false);
    };
    
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- LOGIN CONECTADO A SPRING BOOT ---
  const login = async (email, password) => {
    try {
      // Apuntamos al AuthController.java que creamos en Spring Boot
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password: password })
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Credenciales incorrectas o usuario no registrado.");
      }

      // Si las credenciales son correctas, Java nos devuelve los datos
      const data = await response.json();

      const nombreFormateado = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Armamos el objeto de sesión exactamente como lo esperaba el resto de su App
      const userData = {
        name: nombreFormateado,
        email: email,
        role: data.rol, // Mapeamos "rol" de Java a "role" en React
        programa: data.programa || null 
      };

      // Guardamos en estado y en el navegador para que no se cierre al recargar
      setUser(userData);
      localStorage.setItem('sgtp_session', JSON.stringify(userData));

      return { success: true };

    } catch (error) {
      console.error("Error de Login:", error.message);
      return { success: false, message: error.message };
    }
  };

  // --- LOGOUT LOCAL ---
  const logout = async () => {
    setLoading(true);
    // Eliminamos la sesión de la memoria del navegador
    localStorage.removeItem('sgtp_session');
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};