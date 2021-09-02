const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefination = protoLoader.loadSync(PROTO_PATH, {});

const greetPackageDefination = grpc.loadPackageDefinition(greetProtoDefination).greet; 

function greet(call, callback){
    const greetResponse = {result: `hello ${call.request.greeting.firstName} ${call.request.greeting.lastName}`}
    callback(null, greetResponse);
} 

function greetManyTimes(call, callback){
    let count = 0, intervalId = setInterval(()=>{
      const greetManyTimesResponse = {result: `hello ${call.request.greeting.firstName} ${call.request.greeting.lastName}`}
      call.write(greetManyTimesResponse);
      
      if(++count > 9) {
        clearInterval(intervalId);
        call.end();
      }
      // callback(null, greetManyTimeResponse);
    }, 1000) 
} 

function main(){
    const server = new grpc.Server();
    server.addService(greetPackageDefination.GreetService.service, {
        greet: greet,
        greetManyTimes: greetManyTimes
    })
    server.bind("127.0.0.1:4000", grpc.ServerCredentials.createInsecure());
    server.start();
    console.log({server: 'running @127.0.0.1:4000'})
}
main()

/**
 * * In streaming we dont need to call "callback(null, response);"
 * * instead we keep writing on "call" by "call.write(xyz)"
 * * and when done we "end" it by "call.end()"
 */