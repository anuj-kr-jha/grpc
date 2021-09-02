const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'primeNumberDecomposition.proto');
const primeNumberDecompositionProtoDefination = protoLoader.loadSync(PROTO_PATH, {});
const primeNumberDecompositionPackageDefination = grpc.loadPackageDefinition(primeNumberDecompositionProtoDefination).primeNumberDecomposition; 
  
const client = new primeNumberDecompositionPackageDefination.DecomposePrimeService('localhost:4000', grpc.credentials.createInsecure());

function callDecomposePrime() {
    const decomposePrimeRequest = { number: process.argv[2] || 0 }
    const call = client.decomposePrime(decomposePrimeRequest, () => {});
    call.on("data", (response) => {
      console.log({ result: response.result});
    });
    call.on("status", (status) => {
        console.log({status: status.details});
    });
    call.on("error", (error) => {
        console.log({error: error.details});
    });
    call.on("end", () => console.log("server streaming ended"));
}

function main(){
    callDecomposePrime(); // server streaming api
}

main(); 