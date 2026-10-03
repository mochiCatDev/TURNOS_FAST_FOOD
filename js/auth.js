const Auth = (() => {
  const KEY = STORE_KEYS ? STORE_KEYS.SESION : 'fastturno_sesion';

  const getSesion = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || null;
    } catch (e) {
      return null;
    }
  };

  const getUsuario = () => getSesion();

  const guardarSesion = (usuario) => {
    localStorage.setItem(KEY, JSON.stringify(usuario));
  };

  const cerrarSesion = () => {
    localStorage.removeItem(KEY);
  };

  /**
   * Protege una página según el rol permitido.
   * @param {string|Array} rolesPermitidos - Rol o lista de roles (ej: 'admin' o ['kiosco', 'cliente'])
   */
  const proteger = (rolesPermitidos) => {
    const sesion = getSesion();

    // Si no hay sesión iniciada, redirige al login
    if (!sesion) {
      window.location.href = 'index.html';
      return;
    }

    const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

    // Si el usuario no tiene ninguno de los roles permitidos, redirige
    if (!roles.includes(sesion.rol)) {
      if (sesion.rol === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'kiosco.html';
      }
    }
  };

  return {
    getSesion,
    getUsuario,
    guardarSesion,
    cerrarSesion,
    proteger
  };
})();