import web3 from "./web3";
const { abi } = require('./build/CampaignFactory.json');


//console.log(process.env.DEPLOYED_CONTRACT_ADDRESS);

// web3 provider config
const instance = new web3.eth.Contract(
  abi,
  '0x77D21bfa98100618a1BC1eb7f10b850d2253c2b4'
);

export default instance;
