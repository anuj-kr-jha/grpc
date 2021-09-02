const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefination = protoLoader.loadSync(PROTO_PATH, {});

const greetPackageDefination = grpc.loadPackageDefinition(greetProtoDefination).greet; 

function greet(call, callback){
    const greetResponse = {result: `hello ${call.request.greeting.firstName} ${call.request.greeting.lastName}`}
    callback(null, greetResponse);
} 
function main(){
    const server = new grpc.Server();
    server.addService(greetPackageDefination.GreetService.service, {
        greet: greet
    })
    server.bind("127.0.0.1:4000", grpc.ServerCredentials.createInsecure());
    server.start();
    console.log({server: 'running @127.0.0.1:4000'})
}
main()

/**
 * ! loadSync optional params::
 * protoLoader.loadSync('', {
 *    keepCase: true,
 *    longs: String,
 *    enums: true,
 *    defaults: true,
 *    oneofs: true,
 * })
 */