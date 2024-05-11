const fs = require('node:fs');

module.exports = (req, res) => {
    let logString = ([new Date(req.requestTime).toDateString(), new Date(req.requestTime).toLocaleTimeString(), req.method, req.originalUrl, res.statusCode, res.message].join(' | '));
    logString = `${logString}\r\n`;
    fs.appendFile("./api_log.log", logString, (err) => err && console.error(err));
};