/* ==========================================================
   store.js — Capa de acceso a datos (localStorage)
   FastTurno — Sin backend, sin framework
   ========================================================== */
const Store = (() => {
  const K = {
    MENU:     'sft_menu',
    PEDIDOS:  'sft_pedidos',
    CONFIG:   'sft_config',
    USUARIOS: 'sft_usuarios',
  };

  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  /* ── MENÚ ─────────────────────────────────────────── */
  const getMenu   = ()  => get(K.MENU) || [];
  const saveMenu  = m   => set(K.MENU, m);
  const guardarMenu = m => set(K.MENU, m);   // alias usado en admin.html

  const getProducto = id => getMenu().find(p => p.id == id);

  const agregarProducto = p => {
    const menu = getMenu();
    if (!p.id) p.id = Date.now();
    menu.push(p);
    saveMenu(menu);
    return p;
  };

  const actualizarProducto = (id, datos) => {
    saveMenu(getMenu().map(p => p.id == id ? { ...p, ...datos } : p));
  };

  const eliminarProducto = id => saveMenu(getMenu().filter(p => p.id != id));

  const actualizarStock = (id, delta) => {
    saveMenu(getMenu().map(p => {
      if (p.id != id) return p;
      const stock = Math.max(0, (p.stock || 0) + delta);
      return { ...p, stock, disponible: stock > 0 };
    }));
  };

  /* ── PEDIDOS ──────────────────────────────────────── */
  const getPedidos    = ()  => get(K.PEDIDOS) || [];
  const guardarPedidos = lista => set(K.PEDIDOS, lista);

  const savePedido = pedido => {
    const pedidos = getPedidos();
    pedido.id     = Date.now();
    pedido.turno  = _generarTurno();
    pedido.fecha  = new Date().toISOString();
    pedido.estado = 'pendiente';
    pedidos.push(pedido);
    set(K.PEDIDOS, pedidos);
    return pedido;
  };

  const actualizarEstadoPedido = (id, estado) => {
    set(K.PEDIDOS, getPedidos().map(p =>
      p.id == id ? { ...p, estado, actualizadoEn: new Date().toISOString() } : p
    ));
  };

  /* ── TURNOS ───────────────────────────────────────── */
  const getConfig = () => get(K.CONFIG) || { contador: 0, prefijo: 'A' };

  const _generarTurno = () => {
    const cfg = getConfig();
    cfg.contador++;
    set(K.CONFIG, cfg);
    return `${cfg.prefijo}-${String(cfg.contador).padStart(3, '0')}`;
  };

  const resetTurnos = () => {
    const cfg = getConfig();
    cfg.contador = 0;
    set(K.CONFIG, cfg);
  };

  /* ── USUARIOS ─────────────────────────────────────── */
  const getUsuarios = () => get(K.USUARIOS) || [];
  const validarCredenciales = (usuario, password) =>
    getUsuarios().find(u => u.usuario === usuario && u.password === password) || null;

  // Verifica si un nombre de usuario ya existe (usado en Auth.registrar)
  const existeUsuario = usuario =>
    getUsuarios().some(u => u.usuario.toLowerCase() === usuario.toLowerCase());

  // Crea y persiste un nuevo usuario (usado en Auth.registrar)
  const registrarUsuario = (nombre, usuario, password, rol = 'kiosco') => {
    const usuarios = getUsuarios();
    const nuevoUsuario = { id: Date.now(), nombre, usuario, password, rol };
    usuarios.push(nuevoUsuario);
    set(K.USUARIOS, usuarios);
    return nuevoUsuario;
  };

  /* ── SEED de datos iniciales ──────────────────────── */
  const seedInicial = () => {
    if (!get(K.USUARIOS)) {
      set(K.USUARIOS, [
        { id: 1, nombre: 'Administrador', usuario: 'admin',  password: 'admin123',  rol: 'admin' },
        { id: 2, nombre: 'Kiosco 1',      usuario: 'kiosco', password: 'kiosco123', rol: 'kiosco' },
      ]);
    }
    if (!get(K.MENU)) {
      set(K.MENU, [
        { id: 101, nombre: 'Combo Clasico',     descripcion: 'Hamburguesa + papas + bebida',       precio: 1200, categoria: 'combos',          stock: 20 },
        { id: 102, nombre: 'Combo BBQ',          descripcion: 'Hamburguesa BBQ + papas + bebida',   precio: 1450, categoria: 'combos',          stock: 15 },
        { id: 103, nombre: 'Combo Pollo',        descripcion: 'Sandwich de pollo + papas + bebida', precio: 1300, categoria: 'combos',          stock: 10 },
        { id: 104, nombre: 'Hamburguesa Simple', descripcion: 'Hamburguesa clasica con todo',       precio: 750,  categoria: 'hamburguesas',    stock: 25 },
        { id: 105, nombre: 'Hamburguesa Doble',  descripcion: 'Doble medallon + queso + lechuga',   precio: 950,  categoria: 'hamburguesas',    stock: 20 },
        { id: 106, nombre: 'Papas Grandes',      descripcion: 'Porcion grande de papas fritas',     precio: 400,  categoria: 'acompañamientos', stock: 30 },
        { id: 107, nombre: 'Papas Chicas',       descripcion: 'Porcion chica de papas fritas',      precio: 280,  categoria: 'acompañamientos', stock: 30 },
        { id: 108, nombre: 'Coca-Cola 500ml',    descripcion: 'Bebida cola 500ml',                  precio: 350,  categoria: 'bebidas',         stock: 50 },
        { id: 109, nombre: 'Agua 500ml',         descripcion: 'Agua mineral 500ml',                 precio: 200,  categoria: 'bebidas',         stock: 40 },
        { id: 110, nombre: 'Postre del dia',     descripcion: 'Consulte disponibilidad',            precio: 500,  categoria: 'postres',         stock: 8  },
      ]);
    }
    if (!get(K.CONFIG))  set(K.CONFIG,  { contador: 0, prefijo: 'A' });
    if (!get(K.PEDIDOS)) set(K.PEDIDOS, []);
  };

  /* ── API pública ──────────────────────────────────── */
  return {
    // Menú
    getMenu, saveMenu, guardarMenu,
    getProducto, agregarProducto, actualizarProducto, eliminarProducto, actualizarStock,
    // Pedidos
    getPedidos, savePedido, guardarPedidos, actualizarEstadoPedido,
    // Config / turnos
    getConfig, resetTurnos,
    // Usuarios
    getUsuarios, validarCredenciales, existeUsuario, registrarUsuario,
    // Inicialización
    seedInicial,
  };
})();

// Ejecutar seed al cargar (solo si no hay datos previos)
Store.seedInicial();
