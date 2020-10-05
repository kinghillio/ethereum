// Library Imports
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "4225c6da5c8f4bfa978a6fdd0e8cccdb";

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

const json = require('./build/contracts/KingOfTheHill.json');

// Connection Initialization
const rpcURL = new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraKey}`);
const web3 = new Web3(rpcURL);

// Data set up
let abi = json.abi;
let bytecode = json.bytecode;

//Contract object and account info
let deploy_contract = new web3.eth.Contract(abi);
let account = '0x871a6ae89853E12905054ede224BFED87BC82D0C';

// Function Parameter
let payload = {
  data: bytecode
}

let parameter = {
  //nonce: web3.utils.toHex(0),
  from: account,
  gas: web3.utils.toHex(800000),
  gasPrice: web3.utils.toHex(web3.utils.toWei('90', 'gwei'))
}

// Function Call
deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
  console.log('Transaction Hash :', transactionHash);
}).on('confirmation', () => {}).then((newContractInstance) => {
  console.log('Deployed Contract Address : ', newContractInstance.options.address);
})