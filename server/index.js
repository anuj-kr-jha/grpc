const fs = require('fs');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '..', 'protos', 'square.proto');
const ROOT_CERT_PATH = path.join(__dirname, '..', 'certs', 'ca.crt');
const PRIVATE_KEY_PATH = path.join(__dirname, '..', 'certs', 'server.key');
const CERT_CHAIN_PATH = path.join(__dirname, '..', 'certs', 'server.crt');

// ? grpc.ServerCredentials.createSsl(rootCerts: Buffer, keyCertPairs: grpc.KeyCertPair[], checkClientCertificate?: Boolean)
let credentials = grpc.ServerCredentials.createSsl(
  fs.readFileSync(ROOT_CERT_PATH),
  [
    {
      private_key: fs.readFileSync(PRIVATE_KEY_PATH),
      cert_chain: fs.readFileSync(CERT_CHAIN_PATH)
    }
  ],
  true
);
let unsafeCreds = grpc.ServerCredentials.createInsecure();

const squareProtoDefination = protoLoader.loadSync(PROTO_PATH, {});
const squarePackageDefination = grpc.loadPackageDefinition(squareProtoDefination).square; 

function area(call, callback){
  if(!call.request.dimension) return callback({
    code: grpc.status.INVALID_ARGUMENT,
    message:  `invalid request argument`
  });
  const length = call.request.dimension.length;
  const width = call.request.dimension.width;
  const areaResponse = { result: length * width };
  callback(null, areaResponse);
} 
function perimeter(call, callback){
  if(!call.request.dimension) return callback({
    code: grpc.status.INVALID_ARGUMENT,
    message:  `invalid request argument`
  });
  const length = call.request.dimension.length;
  const width = call.request.dimension.width;
  const perimeterResponse = { result: 2 * ( length + width ) };
  callback(null, perimeterResponse);
} 

function main(){
  const server = new grpc.Server();
  server.addService(squarePackageDefination.SquareService.service, {
      area: area,
      perimeter: perimeter
  })
  server.bindAsync("127.0.0.1:4000", credentials, () => {
    server.start();
    console.log({server: 'running @127.0.0.1:4000'})
  });
}
main()