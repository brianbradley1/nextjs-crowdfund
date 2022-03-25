import web3 from "./web3";
const { abi } = require('./build/Campaign.json');

export default (address) => {
  return new web3.eth.Contract(abi, address);
};
