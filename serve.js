/* Servidor estatico para ver la app en local.
   Node puro, sin instalar nada: npx tardaba o no arrancaba. */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const RAIZ  = __dirname;
const PUERTO = Number(process.argv[2]) || 4321;

const TIPOS = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',   '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon'
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if(rel === '/') rel = '/index.html';

  /* que nadie salga de la carpeta con ../ */
  const destino = path.join(RAIZ, path.normalize(rel));
  if(!destino.startsWith(RAIZ)){ res.writeHead(403).end('Fuera de la carpeta'); return; }

  fs.readFile(destino, (err, buf) => {
    if(err){ res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}).end('No existe: ' + rel); return; }
    res.writeHead(200, {
      'Content-Type': TIPOS[path.extname(destino).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'      // en local siempre la ultima version
    });
    res.end(buf);
  });
}).listen(PUERTO, () => console.log(`Call of Sales en http://localhost:${PUERTO}`));
