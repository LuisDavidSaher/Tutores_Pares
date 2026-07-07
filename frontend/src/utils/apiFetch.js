// src/utils/apiFetch.js

const API_BASE_URL = 'http://localhost:8080';

export const apiFetch = async (endpoint, options = {}) => {
  // 1. Rescatamos el Token Criptográfico de la memoria segura del navegador
  const token = localStorage.getItem('sgtp_token');

  // 2. Preparamos las cabeceras estándar
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 3. Si el usuario está logueado y tiene token, inyectamos el Pase VIP
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 4. Ejecutamos la petición nativa de Javascript, pero blindada
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};