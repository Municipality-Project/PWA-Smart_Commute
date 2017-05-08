// todo:

"use strict";

const DATA_HANDLER = require('./node/DataHandler');

class app {
     constructor() {
          this.ejsData = null;
          this.user = null;
          this.loadServer();
     }

     loadServer() {
          const HTTP = require('http');
          const PORT = process.env.PORT || 8443;
          const EJS = require('ejs');

          HTTP.createServer((request, response) => {

               let httpHandler = (error, string, contentType) => {
                    if (error) {
                         response.writeHead(500, {'Content-Type': 'text/plain'});
                         response.end('An error has occurred: ' + error.message);
                    } else if (contentType.indexOf('css') >= 0 || contentType.indexOf('js') >= 0) {
                         response.writeHead(200, {'Content-Type': contentType});
                         response.end(string, 'utf-8');
                    } else if (contentType.indexOf('html') >= 0) {
                         response.writeHead(200, {'Content-Type': contentType});
                         response.end(EJS.render(string, {
                              data: this.ejsData,
                              filename: 'index.ejs'
                         }));
                    } else {
                         response.writeHead(200, {'Content-Type': contentType});
                         response.end(string, 'binary');
                    }
               };

               if (request.method === 'POST') {
                    let whichAjax = request.headers['x-requested-with'];
                    if (whichAjax === 'XMLHttpRequest0') {
                         request.on('data', (data) => {
                              DATA_HANDLER.handleUserData(0, data.toString('utf8'), (user) => {
                                   if (user !== 'false') {
                                        response.writeHead(200, {'content-type': 'application/json'});
                                        response.end(user);
                                   } else {
                                        response.writeHead(200, {'content-type': 'text/plain'});
                                        response.end('false');
                                   }
                              });
                         });
                    } else if (whichAjax === 'XMLHttpRequest1') {
                         const FORMIDABLE = require('formidable');
                         let formData = {};
                         new FORMIDABLE.IncomingForm().parse(request).on('field', (field, name) => {
                              formData[field] = name;
                         }).on('error', (err) => {
                              next(err);
                         }).on('end', () => {
                              formData = JSON.stringify(formData);
                              DATA_HANDLER.handleUserData(1, formData, (user) => {
                                   if (user !== 'false') {
                                        response.writeHead(200, {'content-type': 'application/json'});
                                        response.end(user);
                                   } else {
                                        response.writeHead(200, {'content-type': 'text/plain'});
                                        response.end('false');
                                   }
                              });
                         });
                    } else if (whichAjax === 'XMLHttpRequest2') {
                         const FORMIDABLE = require('formidable');
                         let formData = {};
                         new FORMIDABLE.IncomingForm().parse(request).on('field', (field, name) => {
                              formData[field] = name;
                         }).on('error', (err) => {
                              next(err);
                         }).on('end', () => {
                              DATA_HANDLER.addData(formData);
                              formData = JSON.stringify(formData);
                              response.writeHead(200, {'content-type': 'application/json'});
                              response.end(formData);
                         });
                    } else {
                         response.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
                         response.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
                    }
               } else if (request.url.indexOf('.css') >= 0) {
                    DATA_HANDLER.renderDom(request.url.slice(1), 'text/css', httpHandler, 'utf-8');
               } else if (request.url.indexOf('.js') >= 0) {
                    DATA_HANDLER.renderDom(request.url.slice(1), 'application/javascript', httpHandler, 'utf-8');
               } else if (request.url.indexOf('.png') >= 0) {
                    DATA_HANDLER.renderDom(request.url.slice(1), 'image/png', httpHandler, 'binary');
               } else if (request.url.indexOf('/') >= 0) {
                    DATA_HANDLER.renderDom('public/views/index.ejs', 'text/html', httpHandler, 'utf-8');
               } else {
                    DATA_HANDLER.renderDom(`HEY! What you're looking for: It's not here!`, 'text/html', httpHandler, 'utf-8');
               }
          }).listen(PORT);
     }
}

module.exports = app;