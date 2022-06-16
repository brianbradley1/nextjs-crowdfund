import web3 from "./web3";
const { abi } = require("./build/CampaignFactory.json");
const contractAddress = require("./constants/contractAddresses.json");

//console.log(process.env.DEPLOYED_CONTRACT_ADDRESS);

// console.log("Contract Address from file = " + typeof contractAddress[4]);
// const addressHC = "0xcAD1F59e13Cd09340a12ce3C835C27243895C401";
// console.log("Contract Address hardcoded  = " + typeof addressHC);

// web3 provider config
const instance = new web3.eth.Contract(abi, contractAddress[4].toString());

export default instance;
