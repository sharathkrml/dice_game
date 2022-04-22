import React from "react";

function Navbar({ connectWallet, account }) {
  return (
    <div className="flex justify-end">
      <button className="p-2 m-2 rounded-lg bg-red-400 text-white">Mint</button>
      <div className="p-2 m-2 rounded-lg bg-red-400 text-white">
        Balance:100
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
