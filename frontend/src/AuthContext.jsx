/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- REVISIÓN DE SESIÓN LOCAL ---
  useEffect(() => {
    const checkSession = async () => {
      const sessionGuardada = localStorage.getItem('sgtp_session');
      const tokenGuardado = localStorage.getItem('sgtp_token'); // Rescatamos el Token JWT

      if (sessionGuardada && tokenGuardado) {
        const userData = JSON.parse(sessionGuardada);
        userData.token = tokenGuardado; // Reinyectamos el token en memoria
        setUser(userData);
      }
      setLoading(false);
    };
    
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- LOGIN CONECTADO A SPRING BOOT (JWT) ---
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password: password })
      });

      if (!response.ok) {
        // Leemos el JSON de error que configuramos en AuthController.java
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Credenciales incorrectas o usuario no registrado.");
      }

      const data = await response.json();

      const nombreFormateado = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Armamos el objeto de sesión incluyendo el Token JWT
      const userData = {
        name: nombreFormateado,
        email: email,
        role: data.rol,
        programa: data.programa || null,
        token: data.token // CAPTURA DEL TOKEN CRIPTOGRÁFICO
      };

      setUser(userData);
      
      // Persistencia en el navegador (Separamos datos públicos del token de seguridad)
      localStorage.setItem('sgtp_session', JSON.stringify({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        programa: userData.programa
      }));
      localStorage.setItem('sgtp_token', data.token); 

      return { success: true };

    } catch (error) {
      console.error("Error de Login:", error.message);
      return { success: false, message: error.message };
    }
  };

  // --- LOGOUT LOCAL ---
  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('sgtp_session');
    localStorage.removeItem('sgtp_token'); // DESTRUCCIÓN DEL TOKEN JWT
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};