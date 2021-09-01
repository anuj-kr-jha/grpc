const grpc = require('grpc');
const calculator = require('../server/protos/calculator_pb');
const service = require('../server/protos/calculator_grpc_pb');

function calculate(call, callback) {
  const calculationResponse = new calculator.CalculationResponse();
  
  calculationResponse.setResult(11);
  callback(null, calculationResponse);
}

function main() {
  const server = new grpc.Server();
  server.addService(service.CalculatorServiceService, {
    calculate: calculate,
  });
  server.bind('127.0.0.1:4000', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server is running on 127.0.0.1:4000');
}

main();