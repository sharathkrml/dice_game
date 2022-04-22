import Head from "next/head";
import ListPredictions from "../components/ListPredictions";
import MainComponent from "../components/MainComponent";
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
  const [account, setAccount] = useState("");
  const [predictionCount, setPredictionCount] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [minting, setMinting] = useState(false);
  const [notification, setNotification] = useState("");
  const Web3Ref = useRef();
  useEffect(() => {
    if (predictionCount == 6) {
      getDiceResult();
    }
  }, [predictionCount]);

  useEffect(() => {
    if (!account) {
      Web3Ref.current = new Web3Modal({
        network: "rinkeby",
        disableInjectedProvider: false,
        providerOptions: {},
      });
    }
    connectWallet();
    if (account) {
      getCount();
      getTokenBalance();
    }
    NewPredictionListener();
  }, [account]);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
    } catch (error) {
      console.log(error);
    }
  };
  const getProviderOrSigner = async (needSigner = false) => {
    const connection = await Web3Ref.current.connect();
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
  const getTokenBalance = async () => {
    const Signer = await getProviderOrSigner(true);
    const address = await Signer.getAddress();
    const TokenContract = getContract(Signer);
    let balance = await TokenContract.balanceOf(address);
    console.log("got balance", balance.toString());
    setTokenBalance(balance.toString());
  };
  const getCount = async () => {
    const Provider = await getProviderOrSigner();
    const DiceContract = await getContract(Provider, true);
    let count = await DiceContract.count();
    console.log("got count:", count.toString());
    setPredictionCount(count.toString());
  };
  const getDiceResult = async () => {
    const Provider = await getProviderOrSigner();
    const DiceContract = await getContract(Provider, true);
    let count = await DiceContract.diceResult();
    let standby = await DiceContract.standby();
    console.log("got diceresult:", count.toString());
    console.log("got standby:", standby.toString());
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
  const mintToken = async () => {
    const Signer = await getProviderOrSigner(true);
    const TokenContract = getContract(Signer);
    try {
      let txn = await TokenContract.mint();
      setMinting(true);
      await txn.wait();
      setMinting(false);
      console.log("txn completed....");
      getTokenBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const predict = async (x) => {
    const Signer = await getProviderOrSigner(true);
    const TokenContract = await getContract(Signer);
    const DiceContract = await getContract(Signer, true);
    try {
      setNotification("approving Dice Game contract to user Token");
      let txn = await TokenContract.approve(DiceGameAddr, 1);
      await txn.wait();
      setNotification("Approved,Now Prediction is going on");
      txn = await DiceContract.predict(x);
      await txn.wait();
      setNotification("Done");
    } catch (error) {
      console.log(error);
    }
    getCount();
  };

  const NewPredictionListener = async () => {
    try {
      const Signer = await getProviderOrSigner(true);
      const DiceContract = await getContract(Signer, true);
      DiceContract.on("NewPrediction", (value, time, from) => {
        console.log(value, time, from);
      });
    } catch (error) {
      console.log(error);
    }
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
          connectWallet={connectWallet}
          tokenBalance={tokenBalance}
          account={account}
          mintToken={mintToken}
          minting={minting}
        />
      </nav>
      <main className="flex justify-end gap-4 px-10">
        <section className="w-6/12">
          <MainComponent
            notification={notification}
            predictionCount={predictionCount}
            predict={predict}
          />
        </section>
        <aside className="w-3/12">
          <ListPredictions />
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
