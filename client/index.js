const grpc = require('grpc');
const calculator = require('../server/protos/calculator_pb');
const service = require('../server/protos/calculator_grpc_pb');

function main() {
  const client = new service.CalculatorServiceService(
    'localhost:4000',
    grpc.credentials.createInsecure()
  );

  const calculationRequest = new calculator.CalculationRequest();
  calculationRequest.setNum1(10)
  calculationRequest.setNum1(20)
  calculationRequest.oP('+')

  client.calculate(calculationRequest, (err, res) => {
    if (err) return console.log({ error: err });
    console.log({ result: res.getResult() });
  });
}

main();
