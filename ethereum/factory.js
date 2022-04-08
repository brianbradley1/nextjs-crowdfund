import web3 from "./web3";
const { abi } = require('./build/CampaignFactory.json');


//console.log(process.env.DEPLOYED_CONTRACT_ADDRESS);

// web3 provider config
const instance = new web3.eth.Contract(
  abi,
  '0x2b2B2e28BcFFf2F772393DF8da46919eB1AC039C'
);

export default instance;
