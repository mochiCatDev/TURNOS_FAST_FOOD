// auth.js — Autenticación y protección de rutas
const Auth = (() => {
  const KEY = 'sft_sesion';

  const login = (usuario, password) => {
    const user = Store.validarCredenciales(usuario, password);
    if (!user) return null;
    sessionStorage.setItem(KEY, JSON.stringify(user));
    return user;
  };

  const logout = () => {
    sessionStorage.removeItem(KEY);
    window.location.href = 'index.html';
  };

  const getSesion = () => {
    try { return JSON.parse(sessionStorage.getItem(KEY)); }
    catch { return null; }
  };

  const getNombre = () => {
    const s = getSesion();
    return s ? s.nombre : '';
  };

  // Redirige si el rol no coincide
  const proteger = rolRequerido => {
    const s = getSesion();
    if (!s || s.rol !== rolRequerido) {
      window.location.href = 'index.html';
    }
  };

  return { login, logout, getSesion, getNombre, proteger };
})();
