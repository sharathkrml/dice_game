import React from "react";

function Navbar() {
  return (
    <div className="flex justify-end">
      <button className="p-2 m-2 rounded-lg bg-red-400 text-white">Mint</button>
      <div className="p-2 m-2 rounded-lg bg-red-400 text-white">Balance:10</div>

      <button className="p-2 m-2 rounded-lg bg-red-400 text-white">
        Connect Wallet
      </button>
    </div>
  );
}

export default Navbar;
