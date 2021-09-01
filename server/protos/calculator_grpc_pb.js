// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protos_calculator_pb = require('../protos/calculator_pb.js');

function serialize_calculator_CalculationRequest(arg) {
  if (!(arg instanceof protos_calculator_pb.CalculationRequest)) {
    throw new Error('Expected argument of type calculator.CalculationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_CalculationRequest(buffer_arg) {
  return protos_calculator_pb.CalculationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_CalculationResponse(arg) {
  if (!(arg instanceof protos_calculator_pb.CalculationResponse)) {
    throw new Error('Expected argument of type calculator.CalculationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_CalculationResponse(buffer_arg) {
  return protos_calculator_pb.CalculationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CalculatorServiceService = exports.CalculatorServiceService = {
  calculate: {
    path: '/calculator.CalculatorService/calculate',
    requestStream: false,
    responseStream: false,
    requestType: protos_calculator_pb.CalculationRequest,
    responseType: protos_calculator_pb.CalculationResponse,
    requestSerialize: serialize_calculator_CalculationRequest,
    requestDeserialize: deserialize_calculator_CalculationRequest,
    responseSerialize: serialize_calculator_CalculationResponse,
    responseDeserialize: deserialize_calculator_CalculationResponse,
  },
};

exports.CalculatorServiceClient = grpc.makeGenericClientConstructor(CalculatorServiceService);
