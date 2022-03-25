import web3 from "./web3";
const { abi } = require('./build/CampaignFactory.json');


//console.log(process.env.DEPLOYED_CONTRACT_ADDRESS);

// web3 provider config
const instance = new web3.eth.Contract(
  abi,
  '0x14aaB8E555f9D049A315bA4b8F3392ba4B64e6C6'
);

export default instance;
