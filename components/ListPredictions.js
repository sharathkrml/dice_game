import React from "react";
import PredictionCard from "./PredictionCard";

function ListPredictions() {
  return (
    <div className="border-2">
      <h2>Predictions</h2>
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
