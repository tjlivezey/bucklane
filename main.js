const child_process = require('child_process');
const contentTypes = require('./content-types');
const fs = require('fs');
const http = require('http');
const httpStatus = require('http-status-codes');
const net = require('net');
let portrange = 8787;
const router = require('./router');
const url = require('url');
const utils = require('./utils');

getPort((port) => {
    router.get('/', (req, res) => {
        res.writeHead(httpStatus.OK, contentTypes.html);
        utils.getFile(__dirname + '\\views\\index.html', res);
    });
    
    router.get('/references.html', (req, res) => {
        res.writeHead(httpStatus.OK, contentTypes.html);
        utils.getFile(__dirname + '\\views\\references.html', res);
    });
    
    router.get('/content', (req, res) => {
        res.writeHead(httpStatus.OK, contentTypes.html);
        utils.getFile(__dirname + '\\views\\content.html', res);
    });

    router.get('/public2', (req, res) => {
        let type = req.url.substr(req.url.lastIndexOf('.') + 1);

        if (type == 'mp4' || type == 'mp3' || type == 'png' || type == 'pdf') {
            const path = __dirname + decodeURI(req.url.replace(/\//g, '\\'));
            
            fs.statSync(path);

            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] 
                    ? parseInt(parts[1], 10)
                    : fileSize - 1;
                const chunksize = (end-start)+1;
                const file = fs.createReadStream(path, {start, end});
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': contentTypes[type]
                };
                res.writeHead(206, head);
                file.pipe(res);
            } 
            else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': contentTypes[type]
                };
    
                res.writeHead(200, head);
                let downloaded = 0;
                fs.createReadStream(path).pipe(res).on('data', function(chunk){
                    downloaded += chunk.length;
                    if (downloaded == fileSize) {
                        res.end();
                    }
                });
            }
        }
        else {
            res.writeHead(httpStatus.OK, {'Content-Type': contentTypes[type]});
            
            utils.getFile(__dirname + decodeURI(req.url.replace(/\//g, '\\')), res);
        }
    });
    
    http.createServer(router.handle)
        .listen(port);

    launch(port);
});

function launch(port) {
    // Launch the Web Application in the browser.
    var webapp = url.parse("http://localhost:" + port + "/");
    child_process.execFile("explorer.exe", [url.format(webapp)]);
}

function getPort (cb) {
  let port = portrange;
  portrange += 1;

  var server = net.createServer()
  server.listen(port, function (err) {
    server.once('close', function () {
      cb(port);
    });
    server.close();
  });

  server.on('error', function (err) {
    launch(port);
    //getPort(cb);
  });
}
     
    

