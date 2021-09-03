const _ = { delay : ttl => new Promise(resolve => setTimeout(resolve, ttl)) };
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefination = protoLoader.loadSync(PROTO_PATH, {});
const greetPackageDefination = grpc.loadPackageDefinition(greetProtoDefination).greet; 
  
const client = new greetPackageDefination.GreetService('localhost:4000', grpc.credentials.createInsecure());

function callGreet(){
    const greetRequest = { greeting: {firstName: "Anuj", lastName: "Jha"}}
    client.greet(greetRequest, (error, response)=>{
        if (error) return console.log({error: error.details});
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

function callLongGreet(){
    const call = client.longGreet({}, (error, response) => { // notice empty req {} since this requset will be ignored due to stream type, so this will be set later using call.write()
        if (error) return console.log({error: error.details});
        console.log({result: response.result})
    });
    // TODO : wheteher server live or not client keep streaming data on client streaming api
    // TODO : handle this.
    let count = 0, intervalId = setInterval(()=>{
        const longGreetRequest = { greeting: {firstName: "Anuj", lastName: "Jha"}};
        call.write(longGreetRequest);
        console.log('sent message : ', count + 1 )
        if(++count > 9) {
            clearInterval(intervalId);
            call.end(); // we have sent all the msgs
        }
    }, 1000);
}

async function callGreetEveryone() {
    const call = client.greetEveryone({}, (error, response) =>{
        if (error) return console.log({error: error.details});
        console.log({result: response.result})
    });
    call.on('data', response => console.log(`client :> hello ${response.result}`));
    call.on('error', error => { console.log({ error: error.details}) });
    call.on('status', status => { console.log({ status: status.details}) });
    call.on('end', () => { console.log('Client End ...') });
    for(let i = 0; i < 10; i++) { 
        call.write({ greeting: { firstName: 'Anuj', lastName: 'Jha' }}) // mathing greetEveryoneRequest frpm proto schema
        await _.delay(1000);
    }
    call.end();// client finished streaming
  
}
function main(){
    // callGreet(); // unary api
    // callGreetManyTimes(); // server streaming api  
    // callLongGreet(); // client streaming apis 
    callGreetEveryone(); // client streaming apis
}

main();