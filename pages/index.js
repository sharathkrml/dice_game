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
  const [predictionslist, setPredictionslist] = useState([]);
  const [winner, setWinner] = useState("");
  const [diceResult, setDiceResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const Web3Ref = useRef();
  useEffect(() => {
    if (predictionCount == 6) {
      setLoading(true);
    }
    if (predictionCount != 0) {
      getAllPredictions();
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
    EventListener();
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
    let diceResult = await DiceContract.diceResult();
    let standby = await DiceContract.standby();
    let date = new Date(standby * 1000).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    setDiceResult(diceResult);

    console.log(standby * 1000 - Date.now());
    console.log("got diceresult:", count.toString());
    console.log("got standby:", date);
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
      setNotification("approving Dice Game contract to use Token");
      let txn = await TokenContract.approve(DiceGameAddr, 1);
      await txn.wait();
      setNotification("Approved,Now Confirm the Prediction");
      txn = await DiceContract.predict(x);
      await txn.wait();
      setNotification("Done");
    } catch (error) {
      console.log(error);
    }
    getCount();
    getTokenBalance();
  };

  const EventListener = async () => {
    try {
      const Signer = await getProviderOrSigner(true);
      const DiceContract = await getContract(Signer, true);
      DiceContract.on("NewPrediction", (value, time, from) => {
        console.log(value, time, from);
      });
      DiceContract.on("ResetAll", () => {
        console.log("reset all");
        setPredictionCount(0);
        setPredictionslist([]);
      });
      DiceContract.on("ResultPublished", () => {
        setLoading(false);
        getDiceResult();
        getAllPredictions().then((res) => {
          setWinner(res[0].from);
          console.log(res);
        });
        console.log("ResultPublished");
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getAllPredictions = async () => {
    const Provider = await getProviderOrSigner();
    const DiceContract = await getContract(Provider, true);
    let list = [];
    for (let i = 0; i < parseInt(predictionCount); i++) {
      let { from, time, value } = await DiceContract.predictions(i);
      let date = new Date(time * 1000).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      value = value.toString();
      list.push({ from, date, value });
    }
    setPredictionslist(list);
    return list;
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
      {loading ? (
        <main>
          <h1>Loading</h1>
        </main>
      ) : (
        <main className="flex justify-end gap-4 px-10">
          <section className="w-6/12">
            <MainComponent
              notification={notification}
              predictionCount={predictionCount}
              predict={predict}
            />
          </section>
          <aside className="w-3/12">
            {predictionslist.length !== 0 && (
              <ListPredictions predictionslist={predictionslist} />
            )}
          </aside>
        </main>
      )}

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
        <button onClick={getDiceResult} className="p-2 bg-red-50">
          find standby
        </button>
      </footer>
    </div>
  );
}
