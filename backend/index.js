/*
            Server
*/

var net = require('net');
var server = net.createServer(function(connection) {
   console.log('client connected');

   connection.on('end', function() {
      console.log('client disconnected');
   });

   connection.on('error', function(err) {
      console.log(err)
   });

   connection.on('data', function(res){
      console.log(res.toString())
      connection.write('ayyyy')
   });

   connection.write('Hello World!\r\n');
   //connection.pipe(connection);
});

server.listen(8080, function() {
   console.log('server is listening');
});
