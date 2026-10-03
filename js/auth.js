// auth.js — Autenticación y protección de rutas
const Auth = (() => {
  const KEY = 'sft_sesion';

  /* ── LOGIN ────────────────────────────────────────────────
     Devuelve el objeto usuario en caso de éxito, null si falla.
     (Compatibilidad con index.html del colega)
  ──────────────────────────────────────────────────────── */
  const login = (usuario, password) => {
    const user = Store.validarCredenciales(usuario, password);
    if (!user) return null;
    sessionStorage.setItem(KEY, JSON.stringify(user));
    return user;
  };

  /* ── REGISTRO ─────────────────────────────────────────── */
  const registrar = (nombre, usuario, password, rol = 'kiosco') => {
    if (Store.existeUsuario(usuario)) {
      return { ok: false, msg: 'El usuario ya existe, intente iniciar sesión.' };
    }
    const nuevoUser = Store.registrarUsuario(nombre, usuario, password, rol);
    sessionStorage.setItem(KEY, JSON.stringify(nuevoUser));
    return { ok: true, user: nuevoUser };
  };

  /* ── SESIÓN ───────────────────────────────────────────── */
  const getSesion  = () => { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; } };
  const getUsuario = () => getSesion();   // alias usado en admin.html y kiosco.html
  const getNombre  = () => { const s = getSesion(); return s ? (s.nombre || s.usuario || '') : ''; };

  /* ── LOGOUT ───────────────────────────────────────────── */
  const logout = () => {
    sessionStorage.removeItem(KEY);
    window.location.href = 'index.html';
  };
  const cerrarSesion = logout;            // alias usado en admin.html y kiosco.html

  /* ── PROTEGER RUTA ────────────────────────────────────── 
     Acepta string único o array de roles válidos.
     Ej: Auth.proteger('admin')
         Auth.proteger(['kiosco', 'cliente'])
  ──────────────────────────────────────────────────────── */
  const proteger = rolRequerido => {
    const s = getSesion();
    const roles = Array.isArray(rolRequerido) ? rolRequerido : [rolRequerido];
    if (!s || !roles.includes(s.rol)) {
      window.location.href = 'index.html';
    }
  };

  return { login, registrar, logout, cerrarSesion, getSesion, getUsuario, getNombre, proteger };
})();
