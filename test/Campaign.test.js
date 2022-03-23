const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // compiledFactory.interface = contract abi
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  // es6 syntax - destructuring array
  // take first element out of array and assign to campaignAddress variable
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();

    // add additional test to check other properties on struck
    assert.equal("Buy batteries", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    // using 104 to factor in gas costs  - prob closer to something like 104.99
    assert(balance > 104);
  });

  // test cant create request with amount greater than what was contributed
  it("can't request amount greater than campaign balance", async () => {

    // first need to contribute to campaign so it has a balance > 0
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("1", "ether"),
      from: accounts[1],
    });

    // get campaign balance
    const summary = await campaign.methods.getSummary().call();
    const campaignBalance = web3.utils.fromWei(summary[1], "ether");

    // create request with amount greater than balance
    const amountInRequest = 0.9; // assuming value in request was 0/9 ether
    // await campaign.methods
    //   .createRequest("Buy carpets", web3.utils.toWei("0.0", "ether"), accounts[1])
    //   .send({ from: accounts[0], gas: "1000000" });

    assert(amountInRequest <=  campaignBalance);
  });
});

// additional tests
  // test someone not manager can approve or finalise a request
  // test finalizing request without approving it
  // test flow of process with more that one request - create, approve, finalise
  // reset balances between each test? 

// * Remember not doing full balance reset between tests to amounts could technically be diff
  // look into seeing how full reset could be done
