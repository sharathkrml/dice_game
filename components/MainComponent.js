import React from "react";
import { Line } from "rc-progress";
function MainComponent() {
  return (
    <div className="border-2 flex flex-col h-[100%] items-center">
      <h1 className="text-4xl text-[#7E22CE]">Dice Game 🎲 </h1>
      <div className="w-60">
        <Line percent="10" strokeWidth="4" strokeColor="red" />
      </div>
      <div className="grid grid-cols-3">
        <button className="p-3 bg-red-500 text-white m-2">1</button>
        <button className="p-3 bg-red-500 text-white m-2">2</button>
        <button className="p-3 bg-red-500 text-white m-2">3</button>
        <button className="p-3 bg-red-500 text-white m-2">4</button>
        <button className="p-3 bg-red-500 text-white m-2">5</button>
        <button className="p-3 bg-red-500 text-white m-2">6</button>
      </div>
    </div>
  );
}

export default MainComponent;
