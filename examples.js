const { multicall } = require('./index');

async function example1() {
  await multicall({
    provider: 'https://mainnet.infura.io',
    calls: [
      // get the hat from ds-chief
      {
        to: '0x8e2a84d6ade1e7fffee039a35ef5f19f13057152',
        method: 'hat()',
        returns: [['hat', 'address']]
      },
      // get dai's liquidation penalty
      {
        to: '0x448a5065aebb8e423f0896e6c5d525c040f59af3',
        method: 'axe()',
        returns: [['liquidationPenalty', 'uint256']]
      },
      // get dai's liquidation ratio
      {
        to: '0x448a5065aebb8e423f0896e6c5d525c040f59af3',
        method: 'mat()',
        returns: [['liquidationRatio', 'uint256']]
      },
      // get dai's debt ceiling
      {
        to: '0x448a5065aebb8e423f0896e6c5d525c040f59af3',
        method: 'cap()',
        returns: [['debtCeiling', 'uint256']]
      }
    ]
  });
}

example1();
