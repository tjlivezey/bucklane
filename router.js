const httpStatus = require('http-status-codes');
const contentTypes = require('./content-types');
const utils = require('./utils');

const routes = {
    'GET': {},
    'POST': {}
};

exports.handle = (req, res) => {
    try {
        if (req.url.indexOf('/public/') == 0) {
            routes[req.method]['/public'](req, res);
        }
        else if (req.url.indexOf('/content.html') > -1) {
            routes[req.method]['/content'](req, res);
        }
        else {
            routes[req.method][req.url](req, res);
        }
    }
    catch (e) {
        res.writeHead(httpStatus.NOT_FOUND, contentTypes.NOT_FOUND);
        res.end();
        //utils.getFile('views/error.html', res);
    }
};

exports.get = (url, action) => {
    routes['GET'][url] = action;
};

exports.post = (url, action) => {
    routes['POST'][url] = action;
};