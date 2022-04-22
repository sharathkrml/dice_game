import React from "react";
import { Line } from "rc-progress";
function MainComponent() {
  const btnStyle = "px-10 py-8  rounded-lg bg-red-500 text-2xl text-white m-2";
  return (
    <div className="border-2 flex flex-col h-[100%] items-center">
      <h1 className="text-4xl text-[#7E22CE]">Dice Game 🎲 </h1>
      <div className="text-white mt-5">0/6</div>
      <div className="w-60">
        <Line percent="10" strokeWidth="4" strokeColor="red" />
      </div>
      <div className="text-white mt-5">Predict</div>
      <div className="grid grid-cols-3 mt-5">
        <button className={btnStyle}>1</button>
        <button className={btnStyle}>2</button>
        <button className={btnStyle}>3</button>
        <button className={btnStyle}>4</button>
        <button className={btnStyle}>5</button>
        <button className={btnStyle}>6</button>
      </div>
    </div>
  );
}

export default MainComponent;
