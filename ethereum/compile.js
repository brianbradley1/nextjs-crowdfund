const path = require("path");
const solc = require("solc");

// fs-extra - community module but gives us extra functions
const fs = require("fs-extra");

// 1. - get build folder and delete
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// 2. - Read campaign.sol from contracts folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// 3. - Compile both contracts
const output = solc.compile(source, 1).contracts;

// 4. - Write output to build dir
fs.ensureDirSync(buildPath); // make sure build path is created

// 5. - loop through compiled out to get individual contracts
  // should have 2 seperate properties - Campaign and CampaignFactory
for (let contract in output) {
  fs.outputJsonSync(
    // append output to build path
    // need to replace : as its added at end of compiled property
    path.resolve(buildPath, contract.replace(':', '') + ".json"),
    // pull off contract from output
    output[contract]
  );
}
