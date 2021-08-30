const grpc = require("grpc");
const services = require("../server/protos/dummy_grpc_pb");

function main() {
  const client = new services.DummyServiceClient(
    "localhost:8080",
    grpc.credentials.createInsecure()
  );
  console.log("client: hello");
  // here we do stuff
  console.log({ client });
}

main();
