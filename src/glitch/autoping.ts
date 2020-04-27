import http from 'http';

export default function autoping() {
  const server = http.createServer((_, res) => {
    res.writeHead(200);
    res.end();
  });

  server.listen(process.env.PORT || 3333);

  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 280000);
}
