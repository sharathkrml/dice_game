import React from "react";
import { Line } from "rc-progress";
function MainComponent({ count, predict }) {
  const btnStyle = "px-10 py-8  rounded-lg bg-red-500 text-2xl text-white m-2";
  return (
    <div className=" flex flex-col h-[100%] items-center">
      <h1 className="text-4xl text-[#7E22CE]">Dice Game 🎲 </h1>
      <div className="text-white mt-5">{count}/6</div>
      <div className="w-60">
        <Line percent={(count * 100) / 6} strokeWidth="4" strokeColor="red" />
      </div>
      <div className="text-white mt-3">Predict</div>
      <div className="grid grid-cols-3 mt-5">
        <button onClick={() => predict(1)} className={btnStyle}>
          1
        </button>
        <button onClick={() => predict(2)} className={btnStyle}>
          2
        </button>
        <button onClick={() => predict(3)} className={btnStyle}>
          3
        </button>
        <button onClick={() => predict(4)} className={btnStyle}>
          4
        </button>
        <button onClick={() => predict(5)} className={btnStyle}>
          5
        </button>
        <button onClick={() => predict(6)} className={btnStyle}>
          6
        </button>
      </div>
    </div>
  );
}

export default MainComponent;
