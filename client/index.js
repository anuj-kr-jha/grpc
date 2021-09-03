const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = require('path').join(__dirname, '..', 'protos', 'calculator.proto');
const calculatorProtoDefination = protoLoader.loadSync(PROTO_PATH, {});

const calculatorPackageDefination = grpc.loadPackageDefinition(calculatorProtoDefination).calculator; 
  
const client = new calculatorPackageDefination.CalculatorService('localhost:4000', grpc.credentials.createInsecure());

function callComputeAverage(){
    const call = client.computeAverage({}, (error, response)=>{
        if (error) return console.log({error: error.details});
        console.log({result: response.result})
    });
    for(let num = 1; num < process.argv[2]; num ++) call.write({number: num}); // matching proto schema for req
    call.end();
}

(function main(){
    callComputeAverage();
})()

// node client/index.js 5