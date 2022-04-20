const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DiceGame", function () {
  let DiceGame;
  let owner;
  let accounts;
  beforeEach(async () => {
    const DiceGameFactory = await ethers.getContractFactory("DiceGame");
    DiceGame = await DiceGameFactory.deploy();
    await DiceGame.deployed();
    [owner, ...accounts] = await ethers.getSigners();
  });
  describe("Add predictions", () => {
    it("Add Prediction", async function () {
      for (let i = 0; i < 6; i++) {
        expect(await DiceGame.connect(accounts[i]).predict(i + 1)).to.emit(
          DiceGame,
          "NewPrediction"
        );
      }
      //   for (let i = 0; i < 6; i++) {
      //     let res = await DiceGame.predictions(i);
      //     let value = res.value.toString();
      //     let date = new Date(res.time * 1000).toLocaleString("en-US", {
      //       timeZone: "Asia/Kolkata",
      //     });
      //     console.log({
      //       value,
      //       date: date,
      //       from: res.from,
      //     });
      //   }
    });
    it("Cannot add more than 6", async () => {
      for (let i = 0; i < 6; i++) {
        expect(await DiceGame.connect(accounts[i]).predict(i + 1)).to.emit(
          DiceGame,
          "NewPrediction"
        );
      }

      await expect(DiceGame.connect(accounts[6]).predict(6)).to.be.revertedWith(
        "Cannot add more"
      );
    });
  });
});
