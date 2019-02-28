const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

http.createServer(function (req, res) {
	if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		var form = new formidable.IncomingForm();

		form.parse(req, function (err, fields, files) {
			if (err) throw err;
			res.writeHead(200, { 'content-type': 'text/plain' });
			res.end('received upload: ' + files.upload.type + '\n\n');
			// console.log(files.upload.type);
			if (files.upload.type == 'application/pdf') {
				fs.rename(files.upload.path, path.join('/home/pi/pi_file_server/pdf', files.upload.name), function (err) {
					if (err) throw err;
				});
			} else {
				fs.rename(files.upload.path, path.join('/home/pi/pi_file_server/doc', files.upload.name), function (err) {
					if (err) throw err;
				});
			}
			// res.end(util.inspect({ fields: fields, files: files }));
		});

		return;
	}

	// show a file upload form
	res.writeHead(200, { 'content-type': 'text/html' });
	res.end(
		'<form action="/upload" enctype="multipart/form-data" method="post">' +
		// '<input type="text" name="title"><br>' +
		'<input type="file" name="upload"><br>' +
		// '<input type="file" name="upload" multiple="multiple"><br>' +
		'<input type="submit" value="Upload">' +
		'</form>'
	);
}).listen(8080);
