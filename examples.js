const { multicall } = require('./index');

async function example1() {
  const output = await multicall({
    provider: 'https://mainnet.infura.io',
    calls: [
      // get the hat from ds-chief
      {
        to: '0x8e2a84d6ade1e7fffee039a35ef5f19f13057152',
        method: 'hat()',
        returns: [['hat', 'address']]
      },
      // mkr balance of the dev multisig
      {
        to: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        method: 'balanceOf(address)',
        args: [['0x7bb0b08587b8a6b8945e09f1baca426558b0f06a', 'address']],
        returns: [['mkrBalance', 'uint256']]
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
  console.log(output);
}

example1();
