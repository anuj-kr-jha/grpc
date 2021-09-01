const grpc = require('grpc');
const calculator = require('../server/protos/calculator_pb');
const service = require('../server/protos/calculator_grpc_pb');

function main() {
  const client = new service.CalculatorServiceClient(
    'localhost:4000',
    grpc.credentials.createInsecure()
  );

  const calculationRequest = new calculator.CalculationRequest();
  calculationRequest.setNum1(10)
  calculationRequest.setNum2(20)
  calculationRequest.setOp('*')

  client.calculate(calculationRequest, (err, res) => {
    if (err) return console.log({ error: err });
    console.log({ result: res.getResult() });
  });
}

main();
