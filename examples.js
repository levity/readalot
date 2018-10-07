const { multicall } = require('./index');

async function example1() {
  await multicall({
    provider: 'https://mainnet.infura.io',
    calls: [
      {
        to: '0x729D19f657BD0614b4985Cf1D82531c67569197B', // pip (ETH/USD)
        method: 'read()',
        returns: [['price', 'bytes32']]
      },
      {
        to: '0x729D19f657BD0614b4985Cf1D82531c67569197B', // pip (ETH/USD)
        method: 'read()',
        returns: [['price', 'bytes32']]
      },
      // {
      //   to: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // pep (MKR/USD)
      //   method: 'peek()',
      //   returns: [['price', 'bytes32']]
      // }
    ]
  });
}

example1();
