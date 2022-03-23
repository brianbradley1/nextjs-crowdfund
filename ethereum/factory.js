import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

//console.log(process.env.DEPLOYED_CONTRACT_ADDRESS);

// web3 provider config
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xb94AEffad0694a79688DDbCdEBf43a8702490204'
);

export default instance;
