// VARIÁVEIS DE INICIALIZAÇÃO DE MÓDULOS
var http = require('http');
var fs = require('fs')
var path = require('path');
const mime = require('mime');
var cache = {};
// ERRO 404
function send404(response){
  response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
  response.write('404: Recurso não encontrado')
  response.end();
}
// ENVIO DE ARQUIVOS DO SERVIDOR
function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {"content-type": mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}
// CACHE DE ENVIOS
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}
// CRIA O SERVIDOR
var server = http.createServer(function(request, response) {
  var filePath = false;
  if(request.url == '/'){
    filePath = 'public/index.html'
  }else {
    filePath = 'public' + request.url;
  }
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
})
// INICIA O SERVIDOR
server.listen(3000, function(){
  console.log('Servidor rodando na porta 3000.');
})
