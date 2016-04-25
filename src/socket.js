
export function startSocket(app, store) {
  store.subscribe(
    () => app.io.emit('state', store.getState().toJS())
  );

  app.io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
}