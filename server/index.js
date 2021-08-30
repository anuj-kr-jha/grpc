const grpc = require("grpc");
function main() {
  const server = new grpc.Server();
  server.bind("127.0.0.1:4000", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("server is running on 127.0.0.1:4000");
}

main();
