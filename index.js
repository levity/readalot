const Web3 = require('web3');
const { padLeft, numberToHex } = Web3.utils;

const contractAddress = '0x26305b94e99148570b261819a60731c9540a4285';
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
        .map(v => (v ? strip0x(v) : null))
        .filter(v => v)
    );
  }, []);

  components.unshift(strip0x(padLeft(totalReturnsLength, 64)));
  return keepAsArray ? components : '0x' + components.join('');
}

async function multicall(options) {
  const { calls, provider } = options;
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  const calldata = makeMulticallData(calls, false, web3.eth);
  const result = await contract.methods.aggregate(calldata).call();
  const blockNum = web3.eth.abi.decodeParameter('uint256', result.slice(0, 66));
  const parsedVals = web3.eth.abi.decodeParameters(
    calls.map(ele => ele.returns[0][1]),
    '0x' + result.slice(67)
  );
  const retObj = { blockNum };
  for (let i = 0; i < calls.length; i++) {
    retObj[calls[i].returns[0][0]] = parsedVals[i];
  }
  console.log(retObj);
}

module.exports = { makeMulticallData, multicall };
