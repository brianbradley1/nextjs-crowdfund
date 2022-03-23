import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

//console.log(process.env.DEPLOYED_CONTRACT_ADDRESS);

// web3 provider config
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x2816153e7491A6cDC0289Fc497dFA8634b7df0bD'
);

export default instance;
