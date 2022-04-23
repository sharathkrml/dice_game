import React from "react";

function WinnerComponent() {
  return (
    <>
      <h1 className="text-4xl text-center text-[#7E22CE]">Dice Game 🎲 </h1>
      <div className="flex flex-col my-[4rem] h-[80%] items-center justify-center">
        <h3 className="text-white text-3xl">Result</h3>
        <h1 className="text-[#7E22CE] text-[5rem]">5</h1>
        <h5 className="text-white text-xl">Winner: 0x8987432898093</h5>
        <h5 className="text-white text-xl">Won 6 Token</h5>
      </div>
    </>
  );
}

export default WinnerComponent;
