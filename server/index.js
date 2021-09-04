const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'square.proto');
const squareProtoDefination = protoLoader.loadSync(PROTO_PATH, {});

const squarePackageDefination = grpc.loadPackageDefinition(squareProtoDefination).square; 

function area(call, callback){
  if(!call.request.dimension) return callback({
    code: grpc.status.INVALID_ARGUMENT,
    message:  `invalid request argument`
  });
  // * NOTE : We just handle error above that will prevent or grpc server from crash in case of invalid args.

  const length = call.request.dimension.length;
  const width = call.request.dimension.width;
  callback(null, areaResponse);
} 

function perimeter(call, callback){
  if(!call.request.dimension) return callback({
    code: grpc.status.INVALID_ARGUMENT,
    message:  `invalid request argument`
  });
  const length = call.request.dimension.length;
  const width = call.request.dimension.width;
  const perimeterResponse = { result: 2 * ( length + width ) }
  callback(null, perimeterResponse);
} 

function main(){
  const server = new grpc.Server();
  server.addService(squarePackageDefination.SquareService.service, {
      area: area,
      perimeter: perimeter
  })
  server.bindAsync("127.0.0.1:4000", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log({server: 'running @127.0.0.1:4000'})
  });
}
main()
