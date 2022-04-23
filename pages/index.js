import Head from "next/head";
import ListPredictions from "../components/ListPredictions";
import MainComponent from "../components/MainComponent";
import WinnerComponent from "../components/WinnerComponent";
import Navbar from "../components/Navbar";
import twitterLogo from "../public/twitter-logo.svg";
import Image from "next/image";
import Web3Modal from "web3modal";
import { useState, useEffect, useRef } from "react";
import { providers, Contract } from "ethers";
import { PredictionTokenAddr, DiceGameAddr } from "../constants";
import PredictionTokenABI from "../artifacts/contracts/PredictionToken.sol/PredictionToken.json";
import DiceGameABI from "../artifacts/contracts/DiceGame.sol/DiceGame.json";
export default function Home() {
  const web3ref = useRef();
  const [published, setPublished] = useState(false);
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [count, setCount] = useState(0);
  const [predictionslist, setPredictionslist] = useState([]);
  const [diceResult, setDiceResult] = useState(0);
  const [standBy, setStandBy] = useState(0);
  const [notification, setNotification] = useState("");
  useEffect(() => {
    if (!account) {
      web3ref.current = new Web3Modal({
        network: "rinkeby",
        disableInjectedProvider: false,
        providerOptions: {},
      });
    } else {
      EventListener();
      getResultAndPredictionlist();
    }
  }, [account]);
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
    } catch (error) {
      console.log(error);
    }
  };
  const EventListener = async () => {
    try {
      const Provider = await getProviderOrSigner();
      const DiceContract = await getContract(Provider, true);
      DiceContract.on("NewPrediction", (value, time, from) => {
        getResultAndPredictionlist();
      });
      DiceContract.on("ResetAll", () => {
        console.log("reset all");
        getResultAndPredictionlist();
      });
      DiceContract.on("Published", () => {
        console.log("Published");
        getResultAndPredictionlist();
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getResultAndPredictionlist = async () => {
    const Signer = await getProviderOrSigner(true);
    const address = await Signer.getAddress();
    const TokenContract = getContract(Signer);
    let balance = await TokenContract.balanceOf(address);
    console.log("Token balance", balance.toString());
    setTokenBalance(balance.toString());
    const DiceContract = await getContract(Signer, true);
    let result = await DiceContract.result();
    if (result.diceResult != 0 && result.standby != 0) {
      setPublished(true);
    }
    if (result.diceResult == 0 && result.standby == 0 && result.count == 0) {
      setPublished(false);
    }
    setDiceResult(result.diceResult.toString());
    let date = new Date(result.standby * 1000).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    console.log(result.standby);
    setStandBy(date);
    setCount(result.count.toString());
    let list = [];
    for (let i = 0; i < parseInt(result.count); i++) {
      let { from, time, value } = await DiceContract.predictions(i);
      let date = new Date(time * 1000).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      value = value.toString();
      list.push({ from, date, value });
    }
    console.log(list);
    setPredictionslist(list);
  };
  const predict = async (x) => {
    const Signer = await getProviderOrSigner(true);
    const TokenContract = await getContract(Signer);
    const DiceContract = await getContract(Signer, true);
    try {
      setNotification("approve to use token");
      let txn = await TokenContract.approve(DiceGameAddr, 1);
      setNotification("loading...");
      await txn.wait();
      setNotification("approved ,confirm prediction");
      txn = await DiceContract.predict(x);
      setNotification("loading...");
      await txn.wait();
      setNotification("Done");
    } catch (error) {
      console.log(error);
    }
    getResultAndPredictionlist();
  };
  const getContract = (ProviderOrSigner, Dice = false) => {
    const TokenContract = new Contract(
      PredictionTokenAddr,
      PredictionTokenABI.abi,
      ProviderOrSigner
    );
    if (Dice) {
      const DiceContract = new Contract(
        DiceGameAddr,
        DiceGameABI.abi,
        ProviderOrSigner
      );
      return DiceContract;
    }
    return TokenContract;
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const connection = await web3ref.current.connect();
    if (!account) {
      setAccount(connection.selectedAddress);
    }

    const provider = new providers.Web3Provider(connection);
    const { chainId } = await provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }
    if (needSigner) {
      const signer = provider.getSigner();
      return signer;
    }
    return provider;
  };
  return (
    <div className="bg-[#0F172A] min-h-[100vh]">
      <Head>
        <title>Dice Game 🎲 </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <Navbar
          account={account}
          connectWallet={connectWallet}
          tokenBalance={tokenBalance}
        />
      </nav>

      <main className="flex justify-end gap-4 px-10">
        <section className="w-6/12">
          {published ? (
            <WinnerComponent
              standBy={standBy}
              diceResult={diceResult}
              predictionslist={predictionslist}
            />
          ) : (
            <MainComponent
              notification={notification}
              predict={predict}
              count={count}
            />
          )}
        </section>
        <aside className="w-3/12">
          {!published && <ListPredictions predictionslist={predictionslist} />}
        </aside>
      </main>

      <footer className=" flex items-center justify-center">
        <div className="w-10">
          <Image alt="Twitter Logo" src={twitterLogo} />
        </div>
        <a
          href={"https://twitter.com/sharathkrml/"}
          target="_blank"
          rel="noreferrer"
          className="text-white"
        >
          built by @sharathkrml
        </a>
      </footer>
    </div>
  );
}
