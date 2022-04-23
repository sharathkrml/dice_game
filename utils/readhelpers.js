const [account, setAccount] = useState("");
const [predictionCount, setPredictionCount] = useState(0);
const [tokenBalance, setTokenBalance] = useState(0);
const [minting, setMinting] = useState(false);
const [notification, setNotification] = useState("");
const [predictionslist, setPredictionslist] = useState([]);
const [winner, setWinner] = useState("");
const [diceResult, setDiceResult] = useState(0);
const [nextTime, setNextTime] = useState("");
const Web3Ref = useRef();
useEffect(() => {
  if (predictionCount == 6) {
    getDiceResult();
  }
  if (predictionCount != 0) {
    getAllPredictions().then((res) => console.log("allpredictions ", res));
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
  let count = await DiceContract.result();
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
  console.log(standby);
  console.log(diceResult);
  setDiceResult(diceResult.toString());
  setNextTime(date);
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
  console.log("minting");
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
    setNotification("Approving Dice Game contract to use Token");
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
      getCount();
      getTokenBalance();
    });
    DiceContract.on("ResetAll", () => {
      console.log("reset all");
      setPredictionCount(0);
      setPredictionslist([]);
      setWinner("");
    });
    DiceContract.on("Published", () => {
      getDiceResult();
      getAllPredictions().then((res) => {
        // setWinner(res[0].from);
        console.log("Result of eventListener", res);
        setWinner(predictionslist[0].from);
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
