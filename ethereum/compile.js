const path = require("path");
const solc = require("solc");

// fs-extra - community module but gives us extra functions
const fs = require("fs-extra");

// 1. - get build folder and delete
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// 2. - Read contracts from folder
const contractPath = path.resolve(__dirname, "contracts");
// 3. - Read contents from directory
const fileNames = fs.readdirSync(contractPath);

const compilerInput = {
  language: "Solidity",
  sources: fileNames.reduce((input, fileName) => {

    const filePath = path.resolve(contractPath, fileName);
    const source = fs.readFileSync(filePath, "utf8");

    return { ...input, [fileName]: { content: source } };
  }, {}),
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

// 4. Compile All contracts
const compiled = JSON.parse(solc.compile(JSON.stringify(compilerInput)));

// 5. - Write output to build dir
fs.ensureDirSync(buildPath); // make sure build path is created

// 6. - loop through compiled out to get individual contracts
fileNames.map((fileName) => {
  const contracts = Object.keys(compiled.contracts[fileName]);
  contracts.map((contract) => {
    fs.outputJsonSync(
      path.resolve(buildPath, contract + ".json"),
      compiled.contracts[fileName][contract]
    );
  });
});



