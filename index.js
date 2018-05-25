const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const { http_port, https_port } = require('./config');
const trim_path = require('./utils/trim_path');
const router = require('./routes');
const http_server = http.createServer((req, res) => unified_server(req, res));
const https_server = https.createServer({
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}, (req, res) => unified_server(req, res));

console.log('\n\n\n')

http_server.listen(http_port, () => console.log('server up on', http_port));
https_server.listen(https_port, () => console.log('server up on', https_port));

function unified_server (req, res) {
  const parsed_url = url.parse(req.url, true);
  const trimmed_path = trim_path(parsed_url.pathname);
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();
    res.send = function (data) {
      res.end(JSON.stringify(data));
      return res;
    }
    res.status = function (status_code) {
      res.writeHead(status_code);
      return res;
    }
    res.setHeader('Content-Type', 'application/json');

    const route_handler = router[trimmed_path] ? router[trimmed_path] : router.notfound;

    route_handler({
      trimmed_path,
      query: parsed_url.query,
      method: req.method,
      headers: req.headers,
      body: buffer ? JSON.parse(buffer) : {},
    }, res);

  });
}
