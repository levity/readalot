const Web3 = require('web3');
const web3 = new Web3('http://localhost:2000');
const { padLeft, padRight } = Web3.utils;
const { abi } = web3.eth;

// const contract = new web3.eth.Contract();

function typesLength(types) {
  // only supporting fixed-length types for now
  return types.length;
}

const strip0x = str => str.replace(/^0x/, '');

function makeMulticallData(calls, keepAsArray) {
  const components = calls.reduce((acc, { to, method, args, returns }) => {
    return acc.concat([
      abi.encodeParameter('address', to),
      padLeft(typesLength(returns.map(r => r[1])), 64),
      padRight(strip0x(abi.encodeFunctionSignature(method)), 64),
      padLeft(typesLength(args.map(a => a[1])), 64),
      abi.encodeParameters(args.map(a => a[1]), args.map(a => a[0]))
    ].map(strip0x).filter(x => x));
  }, []);

  return keepAsArray ? components : '0x' + components.join('');
}

async function multicall(options) {
  const address = '0x'; // multicall contract address
  const { calls } = options;
  const calldata = makeMulticallData(calls);
  console.log(calldata);
  // const { blockNum, kay, jewelers, deBeers } = await contract.methods.multicall(calldata).call()
}

module.exports = {
  makeMulticallData,
  multicall
};
