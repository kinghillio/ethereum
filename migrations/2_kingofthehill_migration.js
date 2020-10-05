const Migrations = artifacts.require("KingOfTheHill");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Migrations, {from: accounts[0]});
};
