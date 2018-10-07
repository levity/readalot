const Web3 = require('web3');
const { makeMulticallData } = require('../index');

test('basic example without return value info', () => {
  const calls = [
    {
      to: '0xbbf289d846208c16edc8474705c748aff07732db',
      method: 'what()',
      args: [],
      returns: [['foo', 'uint256']]
    }
  ];
  const expected = [
    '000000000000000000000000bbf289d846208c16edc8474705c748aff07732db',
    '0000000000000000000000000000000000000000000000000000000000000001',
    'b24bb84500000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000'
  ];
  expect(makeMulticallData(calls, true)).toEqual(expected);
});

test('bigger example', () => {
  const calls = [
    {
      to: '0xbeefed1bedded2dabbed3defaced4decade5dead',
      method: 'fess(guy)',
      args: [['0xbeefed1bedded2dabbed3defaced4decade5bead', 'address']],
      returns: [['kay', 'uint256'], ['jewelers', 'address']]
    },
    {
      to: '0xbeefed1bedded2dabbed3defaced4decade5face',
      method: 'flog()',
      args: [],
      returns: [['deBeers', 'bytes32']]
    }
  ];
  const actual = makeMulticallData(calls, true);
  const expected = [
    '000000000000000000000000beefed1bedded2dabbed3defaced4decade5dead',
    '0000000000000000000000000000000000000000000000000000000000000002',
    '7db9331700000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000001',
    '000000000000000000000000beefed1bedded2dabbed3defaced4decade5bead',
    '000000000000000000000000beefed1bedded2dabbed3defaced4decade5face',
    '0000000000000000000000000000000000000000000000000000000000000001',
    'a7c795fa00000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000'
  ];
  expect(actual).toEqual(expected);
});
