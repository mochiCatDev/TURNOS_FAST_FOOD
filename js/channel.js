// channel.js — Bus de eventos via BroadcastChannel
const Canal = (() => {
  const bc = new BroadcastChannel('turnos-app');
  const _listeners = {};

  bc.onmessage = ({ data }) => {
    const { tipo, payload } = data;
    (_listeners[tipo]  || []).forEach(cb => cb(payload));
    (_listeners['*']   || []).forEach(cb => cb(data));
  };

  const emitir = (tipo, payload = {}) => {
    bc.postMessage({ tipo, payload, ts: Date.now() });
  };

  const escuchar = (tipo, cb) => {
    if (!_listeners[tipo]) _listeners[tipo] = [];
    _listeners[tipo].push(cb);
  };

  const escucharTodo = cb => escuchar('*', cb);

  return { emitir, escuchar, escucharTodo };
})();

// Tipos de eventos (referencia compartida)
const EVENTOS = {
  MENU_ACTUALIZADO:   'MENU_ACTUALIZADO',
  STOCK_ACTUALIZADO:  'STOCK_ACTUALIZADO',
  NUEVO_PEDIDO:       'NUEVO_PEDIDO',
  TURNO_LLAMADO:      'TURNO_LLAMADO',
  TURNO_COMPLETADO:   'TURNO_COMPLETADO',
  TURNO_CANCELADO:    'TURNO_CANCELADO',
  PEDIDO_EN_PREP:     'PEDIDO_EN_PREP'
};
