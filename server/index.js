const grpc = require('@grpc/grpc-js');
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
  }, 1000) 
} 

function longGreet(call, callback){
  call.on('data', request => {
    const fullName = `hello ${request.greeting.firstName} ${request.greeting.lastName}`;
    console.log(`hello ${fullName}`);
  });
  call.on('error', error => {
    console.log({ error })
  });
  call.on('status', status => {
    console.log({ status })
  })
  call.on('end', () => {
    const longGreetResponse = {result: `server :> Long Greet client streaming`}
    callback(null, longGreetResponse);
  })
} 

function main(){
  const server = new grpc.Server();
  server.addService(greetPackageDefination.GreetService.service, {
      greet: greet,
      greetManyTimes: greetManyTimes,
      longGreet: longGreet
  })
  server.bindAsync("127.0.0.1:4000", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log({server: 'running @127.0.0.1:4000'})
  });
}
main()
