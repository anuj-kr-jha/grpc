const fs = require('fs');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '..', 'protos', 'square.proto');
const ROOT_CERT_PATH = path.join(__dirname, '..', 'certs', 'ca.crt');
const PRIVATE_KEY_PATH = path.join(__dirname, '..', 'certs', 'client.key');
const CERT_CHAIN_PATH = path.join(__dirname, '..', 'certs', 'client.crt');

// ? grpc.credentials.createSsl(rootCerts?: Buffer, privateKey?: Buffer, certChain?: Buffer, verifyOptions?: VerifyOptions)
let credentials = grpc.credentials.createSsl(
    fs.readFileSync(ROOT_CERT_PATH),
    fs.readFileSync(PRIVATE_KEY_PATH),
    fs.readFileSync(CERT_CHAIN_PATH)
);
let unsafCreds = grpc.credentials.createInsecure();

const squareProtoDefination = protoLoader.loadSync(PROTO_PATH, {});
const squarePackageDefination = grpc.loadPackageDefinition(squareProtoDefination).square; 
  
const client = new squarePackageDefination.SquareService('localhost:4000', unsafCreds); // or pass unsafCreds for unsecure way

function getGrpcDeadline(miliSec){
    if(typeof miliSec != "number" || miliSec < 0){
        console.log(`invalid rpcType using default Timeout`);
        return new Date(Date.now() + 5000);
    }
    return new Date(Date.now() + miliSec)
}

function getArea(){
    const deadline = getGrpcDeadline(Number(process.argv[4]));
    console.log(`deadline for area : ${Number(process.argv[4])} ms`);
    const areaRequest = { dimension: { length: Number(process.argv[2]), width: Number(process.argv[3]) }};
    client.area(areaRequest, { deadline }, (error, response) => {
        if (error) return console.log({ error: error.details });
        console.log({ area: response.result });
    })
}
function getPerimeter(){
    const deadline = getGrpcDeadline(Number(process.argv[4]));
    console.log(`deadline for perimeter : ${Number(process.argv[4])} ms`);
    const perimeterRequest = { dimension: { length: Number(process.argv[2]), width: Number(process.argv[3]) }};
    client.perimeter(perimeterRequest, { deadline }, (error, response) => {
        if (error) return console.log({ error: error.details });
        console.log({ perimeter: response.result });
    })
}

function main(){
    getArea();
    getPerimeter();
}
main();