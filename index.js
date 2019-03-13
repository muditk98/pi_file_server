const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

const pdf_path = path.join(__dirname, 'pdf')
const doc_path = path.join(__dirname, 'doc')
const docx_path = path.join(__dirname, 'docx')
const jpg_path = path.join(__dirname, 'jpg')
const html_path = path.join(__dirname, 'html')
const others_path = path.join(__dirname, 'others')
const mime_to_path = {
	'application/pdf': pdf_path,
	'application/msword': doc_path,
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': docx_path,
	'image/jpg': jpg_path,
	'text/html': html_path
}

http.createServer(function (req, res) {
	if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		var form = new formidable.IncomingForm();

		form.parse(req, function (err, fields, files) {
			if (err) throw err;
			res.writeHead(200, { 'content-type': 'text/plain' });
			res.end('received upload: ' + files.upload.type + '\n\n');
			// console.log(files.upload.type);
			if (mime_to_path[files.upload.type]) {
				fs.rename(
					files.upload.path,
					path.join(mime_to_path[files.upload.type], files.upload.name),
					function (err) {
					if (err) throw err;
				});
			} else {
				fs.rename(files.upload.path,
					path.join(others_path, files.upload.name),
					function (err) {
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
