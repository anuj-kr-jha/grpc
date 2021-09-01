const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

function main() {
  const client = new service.GreetServiceClient(
    'localhost:4000',
    grpc.credentials.createInsecure()
  );

  const greetRequest = new greets.GreetRequest();
  
  const greeting = new greets.Greeting();
  greeting.setFirstName("Anuj"); 
  greeting.setLastName("Jha"); 

  greetRequest.setGreeting(greeting);

  client.greet(greetRequest, (err, res)=>{
    if (err) return console.log({error: err});
    console.log({result: res.getResult()})
    })
} 

main();