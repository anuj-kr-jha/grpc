const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

function greet(call, callback) {
  const greetResponse = new greets.GreetResponse();
  greetResponse.setResult(`Hello ${call.request.getGreeting().getFirstName()} ${call.request.getGreeting().getLastName()}`);
  callback(null, greetResponse);
}

function main() {
  const server = new grpc.Server();
  server.addService(service.GreetServiceService, {
    greet: greet,
  });
  server.bind('127.0.0.1:4000', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server is running on 127.0.0.1:4000');
}

main();