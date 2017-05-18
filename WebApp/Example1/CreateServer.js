/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 1/2/17
 * Time: 10:11 AM
 * To change this template use File | Settings | File Templates.
 */
const http = require('http');

const hostname = '192.168.0.102';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello World\nxx');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    });
