import React from "react";
import PredictionCard from "./PredictionCard";

function ListPredictions({ predictionslist }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-white">Predictions</h2>
      {predictionslist.map((prediction, i) => (
        <PredictionCard key={i} prediction={prediction} />
      ))}
    </div>
  );
}

export default ListPredictions;
