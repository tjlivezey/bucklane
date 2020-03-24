const fs = require('fs');
const httpStatus = require('http-status-codes');
const contentTypes = require('./content-types');

module.exports = {
    getFile: (file, res) => {
        fs.readFile(`${file}`, 'utf8', (error, data) => {
            if (error) {
                res.writeHead(httpStatus.NOT_FOUND, contentTypes.NOT_FOUND);
                res.end();
            }

            res.end(data);
        });
    }
};