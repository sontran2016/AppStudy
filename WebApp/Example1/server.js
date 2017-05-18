/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 1/2/17
 * Time: 3:43 PM
 * To change this template use File | Settings | File Templates.
 */
var http_IP = '127.0.0.1';
var http_port = 8899;
var http = require('http');
var server = http.createServer(function(req, res) {
    require('./router').get(req, res);
}); // end server()
server.listen(http_port, http_IP);
console.log('listening to http://' + http_IP + ':' + http_port);
