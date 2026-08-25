// Decodifica un JWT sin verificar la firma (client-side)
// La verificación real ocurre en el servidor
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

// Verifica si el token está expirado
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp está en segundos, convertir a milisegundos
  return decoded.exp * 1000 < Date.now();
};

// Obtiene un token válido del localStorage
export const getValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    return null;
  }
  return token;
};

// Limpia el token del localStorage
export const clearToken = () => {
  localStorage.removeItem('token');
};

// Guarda el token en localStorage
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};
