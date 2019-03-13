const http = require('http')

var PORT = process.env.PORT || 6969 

http.createServer(function (req, res){
	res.end('Welcome to RPi 3 test server')
}).listen(PORT)