import React from "react";
import { Line } from "rc-progress";
function MainComponent({ predictionCount, predict, notification }) {
  const btnStyle = "px-10 py-8  rounded-lg bg-red-500 text-2xl text-white m-2";
  return (
    <div className=" flex flex-col h-[100%] items-center">
      <h1 className="text-4xl text-[#7E22CE]">Dice Game 🎲 </h1>
      <div className="text-white mt-5">{predictionCount}/6</div>
      <div className="w-60">
        <Line
          percent={(predictionCount * 100) / 6}
          strokeWidth="4"
          strokeColor="red"
        />
      </div>
      {notification && <div className="text-white"> {notification}</div>}
      <div className="text-white mt-5">Predict</div>
      <div className="grid grid-cols-3 mt-5">
        <button className={btnStyle} onClick={() => predict(1)}>
          1
        </button>
        <button className={btnStyle} onClick={() => predict(2)}>
          2
        </button>
        <button className={btnStyle} onClick={() => predict(3)}>
          3
        </button>
        <button className={btnStyle} onClick={() => predict(4)}>
          4
        </button>
        <button className={btnStyle} onClick={() => predict(5)}>
          5
        </button>
        <button className={btnStyle} onClick={() => predict(5)}>
          6
        </button>
      </div>
    </div>
  );
}

export default MainComponent;
