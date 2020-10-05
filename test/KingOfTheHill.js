const KingOfTheHill = artifacts.require("KingOfTheHill");
const time = require("./helpers/time");

contract("KingOfTheHill", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await KingOfTheHill.new();
  });

  it("should be able to become king of the hill", async () => {
    const result = await contractInstance.newKing({from: alice, value: web3.utils.toWei('0.001', 'ether')});
    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.king, alice);
    let newFee = 0.001 + 0.001 * 30 / 100;
    newFee = web3.utils.toWei(newFee.toString(), 'ether');
    assert.equal(Number(result.logs[0].args.fee), newFee);
  })

  it("the time of the king's reign must expire in a day", async () => {
    await contractInstance.newKing({from: alice, value: web3.utils.toWei('0.001', 'ether')});
    await time.increase(time.duration.days(1));
    const result = await contractInstance.newKing({from: bob, value: web3.utils.toWei('0.001', 'ether')});
    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.king, bob);
    let expectedFee = 0.001 + 0.001 * 30 / 100;
    expectedFee = web3.utils.toWei(expectedFee.toString(), 'ether');
    assert.equal(result.logs[0].args.fee.toNumber(), expectedFee);
  })

  it("must be the correct amount of the reward", async () => {
    let balance = await web3.eth.getBalance(contractInstance.address);
    await contractInstance.newKing({from: alice, value: web3.utils.toWei('0.001', 'ether')});
    const result = await contractInstance.newKing({from: bob, value: web3.utils.toWei('0.0013', 'ether')});
    let newBalance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(result.receipt.status, true);
    let expectedBalance = Number(balance) + 0.001 * 5 / 100 + 0.0013 * 5 / 100;
    expectedBalance = web3.utils.toWei(expectedBalance.toString(), 'ether');
    assert.equal(newBalance, expectedBalance);
  })
})