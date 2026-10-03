/* ============================================================
   FastTurno — Store (Gestión de Persistencia Local)
   ============================================================ */

const STORE_KEYS = {
  MENU: 'fastturno_menu',
  PEDIDOS: 'fastturno_pedidos',
  USUARIOS: 'fastturno_usuarios',
  SESION: 'fastturno_sesion',
};

const Store = {
  seedInicial() {
    // Forzar actualización borrando menú anterior si es necesario probar cambios
    localStorage.removeItem(STORE_KEYS.MENU);

    if (!localStorage.getItem(STORE_KEYS.MENU)) {
      const menuInicial = [
        { id: 1, nombre: "Combo Fast Deluxe", categoria: "combos", precio: 8.50, stock: 30, descripcion: "Doble carne, cheddar, bacon, papas grandes y gaseosa a elección." },
        { id: 2, nombre: "Combo Clásico", categoria: "combos", precio: 6.50, stock: 45, descripcion: "Hamburguesa clásica con queso, papas medianas y bebida." },
        { id: 3, nombre: "Combo Crispy Chicken", categoria: "combos", precio: 7.20, stock: 25, descripcion: "Pollo crocante, lechuga, mayo especial, papas y bebida." },
        { id: 4, nombre: "Hamburguesa Deluxe Doble", categoria: "hamburguesas", precio: 5.50, stock: 50, descripcion: "Doble medalla de carne, cheddar fundido y bacon crocante." },
        { id: 5, nombre: "Hamburguesa Clásica", categoria: "hamburguesas", precio: 3.80, stock: 60, descripcion: "Carne 100% vacuna, queso cheddar, lechuga y tomate." },
        { id: 6, nombre: "Crispy Chicken Sándwich", categoria: "hamburguesas", precio: 4.50, stock: 35, descripcion: "Medalla de pollo rebozada súper crocante con aderezo casero." },
        { id: 7, nombre: "Papas Fritas Medianas", categoria: "acompañamientos", precio: 1.80, stock: 80, descripcion: "Papas bastón doradas y crujientes." },
        { id: 8, nombre: "Papas con Cheddar y Bacon", categoria: "acompañamientos", precio: 2.80, stock: 40, descripcion: "Porción de papas cubierta con cheddar derretido y panceta." },
        { id: 9, nombre: "Nuggets de Pollo (6 u.)", categoria: "acompañamientos", precio: 2.50, stock: 50, descripcion: "Bocadillos de pollo empanados acompañados con salsa barbacoa." },
        { id: 10, nombre: "Gaseosa 500ml", categoria: "bebidas", precio: 1.50, stock: 100, descripcion: "Línea Coca-Cola / Sprite / Fanta bien fría." },
        { id: 11, nombre: "Agua Mineral 500ml", categoria: "bebidas", precio: 1.00, stock: 60, descripcion: "Agua mineral sin gas." },
        { id: 12, nombre: "Helado Sundae Chocolatoso", categoria: "postres", precio: 1.80, stock: 30, descripcion: "Helado cremoso de vainilla con salsa de chocolate caliente." }
      ];
      this.guardarMenu(menuInicial);
    }

    // Usuario Administrador por defecto
    if (!localStorage.getItem(STORE_KEYS.USUARIOS)) {
      const usuariosIniciales = [
        { id: 1, nombre: "Administrador", usuario: "admin", pass: "admin123", rol: "admin" }
      ];
      this.guardarUsuarios(usuariosIniciales);
    }
  },

  /* --- MÉTODOS DEL MENÚ --- */
  getMenu() {
    try { return JSON.parse(localStorage.getItem(STORE_KEYS.MENU)) || []; } catch (e) { return []; }
  },

  guardarMenu(menu) {
    localStorage.setItem(STORE_KEYS.MENU, JSON.stringify(menu));
  },

  actualizarStock(idProducto, cantidadAjuste) {
    const menu = this.getMenu();
    const prod = menu.find(p => p.id === idProducto);
    if (prod) {
      prod.stock = Math.max(0, (prod.stock || 0) + cantidadAjuste);
      this.guardarMenu(menu);
    }
  },

  /* --- MÉTODOS DE PEDIDOS --- */
  getPedidos() {
    try { return JSON.parse(localStorage.getItem(STORE_KEYS.PEDIDOS)) || []; } catch (e) { return []; }
  },

  guardarPedidos(pedidos) {
    localStorage.setItem(STORE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  },

  savePedido(datosPedido) {
    const pedidos = this.getPedidos();
    const ultimoTurno = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.turno || 0)) : 100;
    
    const nuevoPedido = {
      id: Date.now(),
      turno: ultimoTurno + 1,
      fecha: new Date().toISOString(),
      estado: datosPedido.estado || 'pendiente',
      items: datosPedido.items || [],
      total: datosPedido.total || 0,
    };

    pedidos.push(nuevoPedido);
    this.guardarPedidos(pedidos);
    return nuevoPedido;
  },

  /* --- MÉTODOS DE USUARIOS --- */
  getUsuarios() {
    try { return JSON.parse(localStorage.getItem(STORE_KEYS.USUARIOS)) || []; } catch (e) { return []; }
  },

  guardarUsuarios(usuarios) {
    localStorage.setItem(STORE_KEYS.USUARIOS, JSON.stringify(usuarios));
  },

  existeUsuario(nombreUsuario) {
    const usuarios = this.getUsuarios();
    return usuarios.some(u => u.usuario.toLowerCase() === nombreUsuario.toLowerCase());
  },

  validarCredenciales(usuario, password) {
    const usuarios = this.getUsuarios();
    return usuarios.find(u => u.usuario.toLowerCase() === usuario.toLowerCase() && u.pass === password) || null;
  },

  registrarUsuario(nombre, usuario, password, rol = 'cliente') {
    const usuarios = this.getUsuarios();
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      usuario,
      pass: password,
      rol
    };
    usuarios.push(nuevoUsuario);
    this.guardarUsuarios(usuarios);
    return nuevoUsuario;
  }
};