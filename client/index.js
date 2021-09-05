const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'square.proto');
const squareProtoDefination = protoLoader.loadSync(PROTO_PATH, {});

const squarePackageDefination = grpc.loadPackageDefinition(squareProtoDefination).square; 
  
const client = new squarePackageDefination.SquareService('localhost:4000', grpc.credentials.createInsecure());

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