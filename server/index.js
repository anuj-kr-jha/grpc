const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');
/**
 * Implements the greet RPC method
 */
function greet(call, callback) {
  const greetResponse = new greets.GreetResponse();
  greetResponse.setResult(`Hello ${call.request.getGreeting().getFirstName()} ${call.request.getGreeting().getLastName()}`);
  callback(null, greetResponse);
}

function main() {
  const server = new grpc.Server();
  server.addService(service.GreetServiceService, {
    greet: greet,
  });
  server.bind('127.0.0.1:4000', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server is running on 127.0.0.1:4000');
}

main();


/*
 call:
  request:proto.greet.GreetRequest {wrappers_: {…}, messageId_: undefined, arrayIndexOffset_: -1, array: Array(1), pivot_: 1.7976931348623157e+308, …}
  metadata:Metadata {_internal_repr: {…}, flags: 0}
  cancelled:false
  call:Call
  _maxListeners:undefined
  _eventsCount:1
  _events:{error: ƒ}
  Symbol(kCapture):false
  __proto__:EventEmitter
*/

/*
 call.request:
  > array:(1) [Array(2)]
      0:(2) ['Anuj', 'Jha']
      length:1
    __proto__:Array(0)
    arrayIndexOffset_:-1
    convertedPrimitiveFields_:{}
    messageId_:undefined
    pivot_:1.7976931348623157e+308
    wrappers_:{1: proto.greet.Greeting}
  > __proto__:jspb.Message
       clearGreeting:ƒ () {\n  return this.setGreeting(undefined);\n}
       constructor:ƒ (opt_data) {\n  jspb.Message.initialize(this, opt_data, 0, -1, null, null);\n}
       getGreeting:ƒ () {\n  return /**@type{?proto.greet.Greeting} // (\n    jspb.Message.getWrapperField(this, proto.greet.Greeting, 1));\n}
       hasGreeting:ƒ () {\n  return jspb.Message.getField(this, 1) != null;\n}
       serializeBinary:ƒ () {\n  var writer = new jspb.BinaryWriter();\n  proto.greet.GreetRequest.serializeBinaryToWriter(this, writer);\n  return writer.getResultBuffer();\n}
       setGreeting:ƒ (value) {\n  return jspb.Message.setWrapperField(this, 1, value);\n}
       toObject:ƒ (opt_includeInstance) {\n  return proto.greet.GreetRequest.toObject(opt_includeInstance, this);\n}
     > __proto__:Object
*/
