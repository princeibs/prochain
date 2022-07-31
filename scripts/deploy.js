// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const ProChain = await hre.ethers.getContractFactory("ProChain");
  const prochain = await ProChain.deploy();

  await prochain.deployed();

  console.log("Prochain contract deployed to:", prochain.address);
  storeContractData(prochain);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/Prochain-address.json",
    JSON.stringify({ Prochain: contract.address }, undefined, 2)
  );

  const Prochain = artifacts.readArtifactSync("ProChain");

  fs.writeFileSync(
    contractsDir + "/Prochain.json",
    JSON.stringify(Prochain, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });