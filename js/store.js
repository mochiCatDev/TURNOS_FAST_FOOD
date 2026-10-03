// store.js — Capa de datos (localStorage)
const Store = (() => {
  const K = {
    MENU: 'sft_menu',
    PEDIDOS: 'sft_pedidos',
    CONFIG: 'sft_config',
    USUARIOS: 'sft_usuarios'
  };

  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // ── MENÚ ──────────────────────────────────────────
  const getMenu = () => get(K.MENU) || [];
  const saveMenu = items => set(K.MENU, items);
  const getProducto = id => getMenu().find(p => p.id === id);

  const agregarProducto = p => {
    const menu = getMenu();
    p.id = Date.now().toString();
    menu.push(p);
    saveMenu(menu);
    return p;
  };

  const actualizarProducto = (id, datos) => {
    saveMenu(getMenu().map(p => p.id === id ? { ...p, ...datos } : p));
  };

  const eliminarProducto = id => saveMenu(getMenu().filter(p => p.id !== id));

  const actualizarStock = (id, delta) => {
    saveMenu(getMenu().map(p => {
      if (p.id !== id) return p;
      const stock = Math.max(0, p.stock + delta);
      return { ...p, stock, disponible: stock > 0 };
    }));
  };

  // ── PEDIDOS ───────────────────────────────────────
  const getPedidos = () => get(K.PEDIDOS) || [];

  const savePedido = pedido => {
    const pedidos = getPedidos();
    pedido.id = Date.now().toString();
    pedido.turno = _generarTurno();
    pedido.creadoEn = new Date().toISOString();
    pedido.estado = 'pendiente';
    pedidos.push(pedido);
    set(K.PEDIDOS, pedidos);
    return pedido;
  };

  const actualizarEstadoPedido = (id, estado) => {
    set(K.PEDIDOS, getPedidos().map(p =>
      p.id === id ? { ...p, estado, actualizadoEn: new Date().toISOString() } : p
    ));
  };

  // ── TURNOS ────────────────────────────────────────
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

  // ── USUARIOS ──────────────────────────────────────
  const getUsuarios = () => get(K.USUARIOS) || [];

  const validarCredenciales = (usuario, password) =>
    getUsuarios().find(u => u.usuario === usuario && u.password === password) || null;

  // Busca si un usuario ya existe por su nombre de usuario
  const existeUsuario = usuario =>
    getUsuarios().some(u => u.usuario.toLowerCase() === usuario.toLowerCase());

  // Guarda un nuevo usuario en la lista
  const registrarUsuario = (nombre, usuario, password, rol = 'kiosco') => {
    const usuarios = getUsuarios();
    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre,
      usuario,
      password,
      rol
    };
    usuarios.push(nuevoUsuario);
    set(K.USUARIOS, usuarios);
    return nuevoUsuario;
  };

  // ── SEED ──────────────────────────────────────────
  const seedInicial = () => {
    if (!get(K.USUARIOS)) {
      set(K.USUARIOS, [
        { id: '1', nombre: 'Administrador', usuario: 'admin', password: 'admin123', rol: 'admin' },
        { id: '2', nombre: 'Kiosco 1',      usuario: 'kiosco', password: 'kiosco123', rol: 'kiosco' }
      ]);
    }
    if (!get(K.MENU)) {
      set(K.MENU, [
        { id: '101', nombre: 'Combo Clásico',      descripcion: 'Hamburguesa + papas + bebida',      precio: 1200, categoria: 'combos',          tiempoEntrega: 10, stock: 20, disponible: true, emoji: '🍔' },
        { id: '102', nombre: 'Combo BBQ',           descripcion: 'Hamburguesa BBQ + papas + bebida',  precio: 1450, categoria: 'combos',          tiempoEntrega: 12, stock: 15, disponible: true, emoji: '🥩' },
        { id: '103', nombre: 'Combo Pollo',         descripcion: 'Sándwich de pollo + papas + bebida',precio: 1300, categoria: 'combos',          tiempoEntrega: 11, stock: 10, disponible: true, emoji: '🍗' },
        { id: '104', nombre: 'Hamburguesa Simple',  descripcion: 'Hamburguesa clásica con todo',      precio: 750,  categoria: 'hamburguesas',    tiempoEntrega: 8,  stock: 25, disponible: true, emoji: '🍔' },
        { id: '105', nombre: 'Hamburguesa Doble',   descripcion: 'Doble medallón + queso + lechuga',  precio: 950,  categoria: 'hamburguesas',    tiempoEntrega: 9,  stock: 20, disponible: true, emoji: '🍔' },
        { id: '106', nombre: 'Papas Grandes',       descripcion: 'Porción grande de papas fritas',    precio: 400,  categoria: 'acompañamientos', tiempoEntrega: 5,  stock: 30, disponible: true, emoji: '🍟' },
        { id: '107', nombre: 'Papas Chicas',        descripcion: 'Porción chica de papas fritas',     precio: 280,  categoria: 'acompañamientos', tiempoEntrega: 4,  stock: 30, disponible: true, emoji: '🍟' },
        { id: '108', nombre: 'Coca-Cola 500ml',     descripcion: 'Bebida cola 500ml',                 precio: 350,  categoria: 'bebidas',         tiempoEntrega: 1,  stock: 50, disponible: true, emoji: '🥤' },
        { id: '109', nombre: 'Agua 500ml',          descripcion: 'Agua mineral 500ml',                precio: 200,  categoria: 'bebidas',         tiempoEntrega: 1,  stock: 40, disponible: true, emoji: '💧' },
        { id: '110', nombre: 'Postre del día',      descripcion: 'Consulte disponibilidad',           precio: 500,  categoria: 'postres',         tiempoEntrega: 3,  stock: 8,  disponible: true, emoji: '🍰' }
      ]);
    }
    if (!get(K.CONFIG))  set(K.CONFIG,  { contador: 0, prefijo: 'A' });
    if (!get(K.PEDIDOS)) set(K.PEDIDOS, []);
  };

  return {
    getMenu, saveMenu, getProducto,
    agregarProducto, actualizarProducto, eliminarProducto, actualizarStock,
    getPedidos, savePedido, actualizarEstadoPedido,
    getConfig, resetTurnos,
    getUsuarios, validarCredenciales, existeUsuario, registrarUsuario,
    seedInicial
  };
})();
