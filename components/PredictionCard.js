import React from "react";

function PredictionCard({ prediction }) {
  return (
    <div className="py-2">
      <div className="text-sm text-white">From: {prediction.from.substring(0,10)}...</div>
      <div className="text-sm text-white">Value: {prediction.value}</div>
      <div className="text-sm text-white">Time: {prediction.date}</div>
    </div>
  );
}

export default PredictionCard;
