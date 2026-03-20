/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarDatosUsuario = async (email) => {
    try {
      const { data, error } = await supabase
        .from('roles_usuarios')
        .select('rol')
        .eq('correo', email)
        .single();

      if (error) throw error;

      const nombreFormateado = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

      setUser({
        name: nombreFormateado,
        email: email,
        role: data.rol
      });
    } catch (error) {
      console.error("Error al cargar el rol:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await cargarDatosUsuario(session.user.email);
      } else {
        setLoading(false);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        cargarDatosUsuario(session.user.email);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    try {
      // CORRECCIÓN: Quitamos 'data' para evitar el error de variable sin usar
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await cargarDatosUsuario(email);
      return { success: true };

    } catch (error) {
      console.error("Error de Login:", error.message);
      return { success: false, message: "Credenciales incorrectas o usuario no registrado." };
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};