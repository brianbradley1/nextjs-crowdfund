const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./build/CampaignFactory.json");
const fs = require("fs");

const FRONT_END_ADDRESSES_FILE = "constants/contractAddresses.json";

// dotenv config - needed to specify custom path to find .env file
const dotenv = require("dotenv").config({ path: "../.env" });

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.INFURA_API
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "2000000", from: accounts[0] });

  const address = result.options.address;
  const chainId = await web3.eth.getChainId();
  console.log(`Contract deployed to network ${chainId}, address = ${address}`);
  updateContractAddresses(address, chainId);

  provider.engine.stop();
};
deploy();

async function updateContractAddresses(address, chainId) {
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  );
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(address)) {
      currentAddresses[chainId].push(address);
    }
  } else {
    currentAddresses[chainId] = [address];
  }
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
  console.log("Updated contract address in constants folder");
}
