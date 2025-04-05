export const login = (credentials) => {
    // In a real app, this would call your authentication API
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('token', 'mock-token');
        resolve({ success: true });
      }, 1000);
    });
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };