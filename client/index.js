const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefination = protoLoader.loadSync(PROTO_PATH, {});
const greetPackageDefination = grpc.loadPackageDefinition(greetProtoDefination).greet; 
  
const client = new greetPackageDefination.GreetService('localhost:4000', grpc.credentials.createInsecure());
const greetRequest = { greeting: {firstName: "Anuj", lastName: "Jha"}}
client.greet(greetRequest, (error, response)=>{
    if (error) return console.log({error});
    console.log({result: response.result})
})

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