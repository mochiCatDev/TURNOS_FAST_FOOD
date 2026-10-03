// auth.js — Autenticación y protección de rutas
const Auth = (() => {
  const KEY = 'sft_sesion';

  const login = (usuario, password) => {
    const user = Store.validarCredenciales(usuario, password);
    if (!user) return null;
    sessionStorage.setItem(KEY, JSON.stringify(user));
    return user;
  };

  const registrar = (nombre, usuario, password, rol = 'kiosco') => {
    // Si ya existe el usuario, no permitimos registrarlo
    if (Store.existeUsuario(usuario)) {
      return { ok: false, msg: 'El usuario ya existe, intente iniciar sesión.' };
    }

    const nuevoUser = Store.registrarUsuario(nombre, usuario, password, rol);
    // Inicia sesión automáticamente tras el registro exitoso
    sessionStorage.setItem(KEY, JSON.stringify(nuevoUser));
    return { ok: true, user: nuevoUser };
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

  const proteger = rolRequerido => {
    const s = getSesion();
    if (!s || s.rol !== rolRequerido) {
      window.location.href = 'index.html';
    }
  };

  return { login, registrar, logout, getSesion, getNombre, proteger };
})();
