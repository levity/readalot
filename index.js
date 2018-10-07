const Web3 = require('web3');
const { padLeft, padRight, numberToHex } = Web3.utils;

const contractAddress = '0x9d4be2a93c37d5b9f71404811fe9afbc46675be5';
const contractAbi = [
  {
    constant: true,
    inputs: [{ name: 'data', type: 'bytes' }],
    name: 'aggregate',
    outputs: [{ name: '', type: 'bytes' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

function typesLength(types) {
  // only supporting fixed-length types for now
  return types.length;
}

const strip0x = str => str.replace(/^0x/, '');

function makeMulticallData(calls, keepAsArray, eth) {
  let totalReturnsLength = 0;
  const components = calls.reduce((acc, { to, method, args, returns }) => {
    const returnsLength = typesLength(returns.map(r => r[1]));
    totalReturnsLength += returnsLength;
    if (!args) args = [];
    return acc.concat(
      [
        eth.abi.encodeParameter('address', to),
        padLeft(returnsLength, 64),
        padLeft('40', 64),
        padLeft(numberToHex(args.length * 32 + 4), 64),
        eth.abi.encodeFunctionSignature(method),
        eth.abi.encodeParameters(args.map(a => a[1]), args.map(a => a[0]))
      ]
        .map(v => v ? strip0x(v) : null)
        .filter(v => v)
    );
  }, []);

  components.unshift(strip0x(padLeft(totalReturnsLength, 64)));
  return keepAsArray ? components : '0x' + components.join('');
}

async function multicall(options) {
  const address = '0x'; // multicall contract address
  const { calls, provider } = options;
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  const calldata = makeMulticallData(calls, false, web3.eth);
  const result = await contract.methods.aggregate(calldata).call();
  console.log(result);
  // TODO: handle return value
}

module.exports = { makeMulticallData, multicall };
