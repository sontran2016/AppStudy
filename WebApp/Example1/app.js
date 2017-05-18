var express = require('express')
var app = express()

var path = require("path");
//app.use(express.static('public'))
//app.use(express.static(path.join(__dirname, 'public')))
app.use('/static', express.static(path.join(__dirname, 'public')))

var birds = require('./birds')
app.use('/birds', birds)

app.get('/', function (req, res) {
    //res.send('Hello World!')
    res.sendFile(path.join(__dirname,'/index.html'))
})
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})