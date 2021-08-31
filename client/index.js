const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

function main() {
  const client = new service.GreetServiceClient(
    'localhost:4000',
    grpc.credentials.createInsecure()
  );

  const greetRequest = new greets.GreetRequest(); // //created protobuffs greetRequest 
  
  const greeting = new greets.Greeting();// //created actual greeting object as specified in schema
  greeting.setFirstName("Anuj"); // //setting field value
  greeting.setLastName("Jha"); 

  greetRequest.setGreeting(greeting); // // set Greeting

  // // making RPC call for function greet() on server from client
  client.greet(greetRequest, (err, res)=>{
    if (err) return console.log({error: err});
    console.log({result: res.getResult()})
    /* RES ::
          array:(1) ['Hello Anuj']
          arrayIndexOffset_:-1
        > convertedPrimitiveFields_:{}
          messageId_:undefined
          pivot_:1.7976931348623157e+308
          wrappers_:null
        > __proto__:jspb.Message 
                constructor:ƒ (opt_data) {\n  jspb.Message.initialize(this, opt_data, 0, -1, null, null);\n}
                getResult:ƒ () {\n  return  (jspb.Message.getFieldWithDefault(this, 1, ""));\n}
                serializeBinary:ƒ () {\n  var writer = new jspb.BinaryWriter();\n  proto.greet.GreetResponse.serializeBinaryToWriter(this, writer);\n  return writer.getResultBuffer();\n}
                setResult:ƒ (value) {\n  return jspb.Message.setProto3StringField(this, 1, value);\n}
                toObject:ƒ (opt_includeInstance) {\n  return proto.greet.GreetResponse.toObject(opt_includeInstance, this);\n}
                __proto__:Object
    */
    })
} 

main();