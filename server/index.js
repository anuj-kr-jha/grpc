const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'primeNumberDecomposition.proto');

const primeNumberDecompositionProtoDefination = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const primeNumberDecompositionPackageDefination = grpc.loadPackageDefinition(primeNumberDecompositionProtoDefination).primeNumberDecomposition; 


function decomposePrime(call, callback){
  let k = 2, N = call.request.number;
  while (N > 1){
    if(N % k === 0){
      call.write({ result: k });
      N = N / k;
    }
    else
      k++;
  }  
  call.end();
} 

function main(){
  const server = new grpc.Server();
  server.addService(primeNumberDecompositionPackageDefination.DecomposePrimeService.service, {
    decomposePrime: decomposePrime,
  })
  server.bindAsync("127.0.0.1:4000", grpc.ServerCredentials.createInsecure(), ()=>{
    server.start();
    console.log({server: 'running @127.0.0.1:4000'})
  });
}
main()