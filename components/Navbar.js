import React from "react";

function Navbar({ connectWallet, account, tokenBalance, mintToken, minting }) {
  return (
    <div className="flex justify-end">
      {minting ? (
        <button className="p-2 m-2 rounded-lg bg-slate-500 text-white">
          Minting..
        </button>
      ) : (
        <button
          className="p-2 m-2 rounded-lg bg-red-400 text-white"
          onClick={mintToken}
        >
          Mint
        </button>
      )}
      <div className="p-2 m-2 rounded-lg bg-red-400 text-white">
        Balance:{tokenBalance}
      </div>
      {account && (
        <button className="p-2 m-2 rounded-lg bg-red-400 text-white">
          {account.substring(0, 8)}...
        </button>
      )}
      {!account && (
        <button
          className="p-2 m-2 rounded-lg bg-red-400 text-white"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default Navbar;
