const http = require('http');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>DevOps Assignment</title></head>
      <body>
        <h1>DevOps Assignment - IPS</h1>
        <p>Environment: <strong>${ENV}</strong></p>
        <p>Server running on port: <strong>${PORT}</strong></p>
        <p>Status: <strong>OK</strong></p>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Server running in ${ENV} mode on port ${PORT}`);
});
