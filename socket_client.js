import net from "net";

var client = net.connect({ port: 8082, host: "192.168.1.68" }, function () {
  console.log("connected to server!");
  console.log(client.remoteAddress);
});

client.on("data", function (data) {
  console.log(data.toString());
  console.log(client.bytesRead);
  console.log(client.writableLength);
  //   client.end();
});

client.on("end", function () {
  console.log("disconnected from server");
});
