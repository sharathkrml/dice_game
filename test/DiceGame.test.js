const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DiceGame", function () {
  let DiceGame;
  let PredictionToken;
  let owner;
  let accounts;
  beforeEach(async () => {
    const PredictionTokenFactory = await ethers.getContractFactory(
      "PredictionToken"
    );
    PredictionToken = await PredictionTokenFactory.deploy();
    await PredictionToken.deployed();
    const DiceGameFactory = await ethers.getContractFactory("DiceGame");
    DiceGame = await DiceGameFactory.deploy(PredictionToken.address);
    await DiceGame.deployed();
    [owner, ...accounts] = await ethers.getSigners();
    for (let i = 0; i < 6; i++) {
      await PredictionToken.connect(accounts[i]).mint();
    }
  });
  describe("Add predictions", () => {
    it("Add Prediction", async function () {
      for (let i = 0; i < 6; i++) {
        await PredictionToken.connect(accounts[i]).approve(DiceGame.address, 1);
        expect(await DiceGame.connect(accounts[i]).predict(i + 1)).to.emit(
          DiceGame,
          "NewPrediction"
        );
      }
      // console.log(await PredictionToken.balanceOf(DiceGame.address));
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
        await PredictionToken.connect(accounts[i]).approve(DiceGame.address, 1);

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
  describe("Actual results", () => {
    it("try distinct prediction", async () => {
      let pred = [3, 2, 1, 5, 4, 6];
      let res = 3;
      let txn;
      for (let i = 0; i < pred.length; i++) {
        await PredictionToken.connect(accounts[i]).approve(DiceGame.address, 1);

        txn = await DiceGame.connect(accounts[i]).predict(pred[i]);
        await txn.wait();
      }
      txn = await DiceGame.getRankList(res);
      await txn.wait();
      let a = await DiceGame.predictions(0);
      //   1st
      expect(a.from).to.equal(accounts[0].address);
      a = await DiceGame.predictions(1);
      //   2nd
      expect(a.from).to.equal(accounts[1].address);
      //   3rd
      a = await DiceGame.predictions(2);
      expect(a.from).to.equal(accounts[4].address);
      //   4th
      a = await DiceGame.predictions(3);
      expect(a.from).to.equal(accounts[2].address);
      //   5th
      a = await DiceGame.predictions(4);
      expect(a.from).to.equal(accounts[3].address);
      //   6th
      a = await DiceGame.predictions(5);
      expect(a.from).to.equal(accounts[5].address);
    });

    it("try repeated prediction", async () => {
      let pred = [1, 1, 2, 2, 3, 3];
      let res = 2;
      let txn;
      for (let i = 0; i < pred.length; i++) {
        await PredictionToken.connect(accounts[i]).approve(DiceGame.address, 1);

        txn = await DiceGame.connect(accounts[i]).predict(pred[i]);
        await txn.wait();
      }

      console.log(await PredictionToken.balanceOf(DiceGame.address));
      console.log(await PredictionToken.balanceOf(accounts[2].address));
      txn = await DiceGame.getRankList(res);
      await txn.wait();
      //   1st
      let a = await DiceGame.predictions(0);
      expect(a.from).to.equal(accounts[2].address);
      console.log(await PredictionToken.balanceOf(DiceGame.address));
      console.log(await PredictionToken.balanceOf(accounts[2].address));
      a = await DiceGame.predictions(1);
      //   2nd
      expect(a.from).to.equal(accounts[3].address);
      //   3rd
      a = await DiceGame.predictions(2);
      expect(a.from).to.equal(accounts[0].address);
      //   4th
      a = await DiceGame.predictions(3);
      expect(a.from).to.equal(accounts[1].address);
      //   5th
      a = await DiceGame.predictions(4);
      expect(a.from).to.equal(accounts[4].address);
      //   6th
      a = await DiceGame.predictions(5);
      expect(a.from).to.equal(accounts[5].address);
    });
  });
  describe("Reset Predictions", () => {
    it("delete all predictions", async () => {
      let txn;
      let res;
      for (let i = 0; i < 6; i++) {
        await PredictionToken.connect(accounts[i]).approve(DiceGame.address, 1);

        txn = await DiceGame.connect(accounts[i]).predict(i);
        txn.wait();
        expect(await DiceGame.count()).to.equal(i + 1);
      }
      res = await DiceGame.predictions(5);
      expect(res.value).to.equals(5);
      expect(await DiceGame.count()).to.equal(6);

      txn = await DiceGame.resetPredictions();
      txn.wait();
      // after
      res = await DiceGame.predictions(5);
      expect(res.value).to.equals(0);
      expect(await DiceGame.count()).to.equal(0);
    });
  });
});
