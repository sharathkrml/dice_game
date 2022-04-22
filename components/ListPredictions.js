import React from "react";
import PredictionCard from "./PredictionCard";

function ListPredictions() {
  return (
    <div className="border-2 flex flex-col items-center">
      <h2 className="text-white">Predictions</h2>
      <PredictionCard/>
      <PredictionCard/>
      <PredictionCard/>
      <PredictionCard/>
      <PredictionCard/>
      <PredictionCard/>
    </div>
  );
}

export default ListPredictions;
