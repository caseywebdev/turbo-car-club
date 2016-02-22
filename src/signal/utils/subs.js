import app from '..';

const SUBS = {};

export const add = (socket, event) => {
  (socket.events || (socket.events = {}))[event] = true;
  (SUBS[event] || (SUBS[event] = {}))[socket.id] = true;
};

export const remove = (socket, event) => {
  const {events} = socket;

  if (!events) return;

  if (!event) {
    for (let e in events) remove(socket, e);
    return;
  }

  delete events[event];
  delete SUBS[event][socket.id];
};

export const trigger = (event, data) => {
  const {sockets} = app.live;
  for (let id in SUBS[event]) sockets[id].send(event, data);
};
