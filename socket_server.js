import net from "net";

const server = net.createServer(function (connection) {
  console.log("client connected");

  connection.on("end", function () {
    console.log("client disconnected");
  });
 
    connection.write("Hello World!\r\n");
   
    connection.pipe(connection);

});

server.listen(8082, "192.168.1.68", () =>
  console.log("server listen on http://192.168.1.68:8082/")
);
