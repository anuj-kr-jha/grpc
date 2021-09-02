const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefination = protoLoader.loadSync(PROTO_PATH, {});
const greetPackageDefination = grpc.loadPackageDefinition(greetProtoDefination).greet; 
  
const client = new greetPackageDefination.GreetService('localhost:4000', grpc.credentials.createInsecure());

function callGreet(){
    const greetRequest = { greeting: {firstName: "Anuj", lastName: "Jha"}}
    client.greet(greetRequest, (error, response)=>{
        if (error) return console.log({error});
        console.log({result: response.result})
    })
}

function callGreetManyTimes() {
    const greetManyTimesRequest = { greeting: {firstName: "Anuj", lastName: "Jha"}}
    const call = client.greetManyTimes(greetManyTimesRequest, () => {}); // ? store function call on a variable

    // ? listen to all events on that variable
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
    // callGreet(); // unary api
    callGreetManyTimes(); // server streaming api
}

main(); 