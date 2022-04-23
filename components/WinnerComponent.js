import React from "react";

function WinnerComponent({ diceResult, predictionslist, standBy }) {
  return (
    <>
      <h1 className="text-4xl text-center text-[#7E22CE]">Dice Game 🎲 </h1>
      <div className="flex flex-col my-[4rem] h-[80%] items-center justify-center">
        <h3 className="text-white text-3xl">Result</h3>
        {diceResult && (
          <h1 className="text-[#7E22CE] text-[5rem]">{diceResult}</h1>
        )}
        {predictionslist.length && (
          <h5 className="text-white text-xl">
            Winner: {predictionslist[0].from.substring(0, 15)}...
          </h5>
        )}
        <h5 className="text-white text-xl">Won 6 Token</h5>
        <h1 className="text-white text-sm">next game : {standBy}</h1>
      </div>
    </>
  );
}

export default WinnerComponent;
