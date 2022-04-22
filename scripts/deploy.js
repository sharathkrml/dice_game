const hre = require("hardhat");

async function main() {

  const PredictionTokenFactory = await hre.ethers.getContractFactory(
    "PredictionToken"
  );
  const PredictionToken = await PredictionTokenFactory.deploy();
  await PredictionToken.deployed();
  const DiceGameFactory = await hre.ethers.getContractFactory("DiceGame");
  const DiceGame = await DiceGameFactory.deploy(PredictionToken.address);
  await DiceGame.deployed();


  console.log("PredictionToken deployed to:", PredictionToken.address);
  console.log("DiceGame deployed to:", DiceGame.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
