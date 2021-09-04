const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'square.proto');
const squareProtoDefination = protoLoader.loadSync(PROTO_PATH, {});

const squarePackageDefination = grpc.loadPackageDefinition(squareProtoDefination).square; 
  
const client = new squarePackageDefination.SquareService('localhost:4000', grpc.credentials.createInsecure());

function getArea(){
    const areaRequest = { dimension: { length: process.argv[2], width: process.argv[3] }};
    client.area('passing_Wrong_Argumwent', (error, response) => {
        if (error) return console.log({error: error.details});
        console.log({area: response.result});
    })
    // * NOTE : when we pass an invalid request argument the server will recieve empty {}, and not the actual invalid args 'passing_Wrong_Argumwent'.
}
function getPerimeter(){
    const perimeterRequest = { dimension: { length: process.argv[2], width: process.argv[3] }};
    client.perimeter(perimeterRequest, (error, response) => {
        if (error) return console.log({error: error.details});
        console.log({perimeter: response.result});
    })
}

function main(){
    getArea();
    getPerimeter();
}

main();