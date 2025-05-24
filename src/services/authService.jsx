// Este servicio se usará más adelante para conectar con el backend real
export const register = async (userData) => {
    // Lógica para registrar usuario 
    return { success: true, data: userData };
  };
  
  export const login = async (credentials) => {
    // Lógica para iniciar sesión 
    return { success: true, data: credentials };
  };
  
  export const logout = () => {
    // Lógica para cerrar sesión
    return { success: true };
  };