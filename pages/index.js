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
  const [published, setPublished] = useState(true);
  return (
    <div className="bg-[#0F172A] min-h-[100vh]">
      <Head>
        <title>Dice Game 🎲 </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <Navbar />
      </nav>

      <main className="flex justify-end gap-4 px-10">
        <section className="w-6/12">
          {published ? <WinnerComponent /> : <MainComponent />}
        </section>
        <aside className="w-3/12">{!published && <ListPredictions />}</aside>
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
