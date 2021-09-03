const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'calculator.proto');
const calculatorProtoDefination = protoLoader.loadSync(PROTO_PATH, {});

const calculatorPackageDefination = grpc.loadPackageDefinition(calculatorProtoDefination).calculator; 

const server = new grpc.Server();
server.addService(calculatorPackageDefination.CalculatorService.service, {
  computeAverage: computeAverage
});

server.bindAsync("127.0.0.1:4000", grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log({server: 'running @127.0.0.1:4000'})
});

function computeAverage(call, callback){
  let sum =0, count = 0;
  call.on('error', error => {
    console.log({error: error.details});
  });
  call.on('status', status => {
    console.log({status: status.details})
  });
  call.on('data', request => {
    sum += request.number;
    count++;
  });
  call.on('end', () => {
    console.log('All number received\n sending response ...')
    callback(null, { result: sum/count })
  });
};