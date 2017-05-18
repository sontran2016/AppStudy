var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var uploadController = require('./controllers/upload');

module.exports = function(app) {
    app.post('/node/upload', [multipartMiddleware], uploadController.upload);

    //opc groups
    var dataGroup = [];
    app.post('/opc/group', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        dataGroup = req.body;
        //var obj = { 'status': true };
        res.write(JSON.stringify(dataGroup));
        res.end();
    });
    app.get('/opc/group', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(JSON.stringify(dataGroup));
        res.end();
    });

    //opc tags
    var dataTag = [];
    app.post('/opc/tag', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        dataTag = req.body;
        //var obj = { 'status': true };
        res.write(JSON.stringify(dataTag));
        res.end();
    });
    app.get('/opc/tag', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(JSON.stringify(dataTag));
        res.end();
    });
};