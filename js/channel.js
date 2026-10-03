/* ==========================================================
   channel.js — Bus de eventos via BroadcastChannel
   FastTurno — Sin backend, sin framework

   API principal:  Channel.getInstance()  → devuelve el BroadcastChannel
                   channel.postMessage({ evento, datos })
                   channel.addEventListener('message', fn)

   API legacy:     Canal.emitir(tipo, payload)
                   Canal.escuchar(tipo, cb)
   ========================================================== */

/* Constantes de eventos (importadas por todos los módulos) */
const EVENTOS = {
  MENU_ACTUALIZADO:   'MENU_ACTUALIZADO',
  STOCK_ACTUALIZADO:  'STOCK_ACTUALIZADO',
  NUEVO_PEDIDO:       'NUEVO_PEDIDO',
  TURNO_LLAMADO:      'TURNO_LLAMADO',
  TURNO_COMPLETADO:   'TURNO_COMPLETADO',
  TURNO_CANCELADO:    'TURNO_CANCELADO',
  PEDIDO_EN_PREP:     'PEDIDO_EN_PREP',
};

/* Singleton del canal */
const Channel = (() => {
  let _bc = null;

  const getInstance = () => {
    if (!_bc) {
      _bc = new BroadcastChannel('sft_canal_v1');
    }
    return _bc;
  };

  return { getInstance };
})();

/* API legacy: Canal — para compatibilidad con código anterior */
const Canal = (() => {
  const bc = Channel.getInstance();
  const _listeners = {};

  bc.addEventListener('message', ({ data }) => {
    const tipo    = data?.evento || data?.tipo;
    const payload = data?.datos  || data?.payload || data;
    (_listeners[tipo] || []).forEach(cb => cb(payload));
    (_listeners['*']  || []).forEach(cb => cb(data));
  });

  const emitir = (tipo, payload = {}) => {
    bc.postMessage({ evento: tipo, datos: payload, ts: Date.now() });
  };

  const escuchar     = (tipo, cb) => {
    if (!_listeners[tipo]) _listeners[tipo] = [];
    _listeners[tipo].push(cb);
  };
  const escucharTodo = cb => escuchar('*', cb);

  return { emitir, escuchar, escucharTodo };
})();
