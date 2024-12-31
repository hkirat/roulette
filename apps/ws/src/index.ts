import { WebSocketServer } from 'ws';
import { UserManager } from './UserManager';

const wss = new WebSocketServer({ port: 8080 });

// 
wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const name = queryParams.get('name');
  UserManager.getInstance().addUser(ws, name || "Anonymous");

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

});