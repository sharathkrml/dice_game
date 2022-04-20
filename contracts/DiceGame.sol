// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DiceGame {
    struct Prediction {
        uint256 value;
        uint256 time;
        address from;
    }
    uint256 count;
    Prediction[6] public predictions;
    event NewPrediction(Prediction);
    event RankList(Prediction[]);

    function predict(uint256 _value) external {
        require(count<6,"Cannot add more");
        Prediction memory newPrediction = Prediction(
            _value,
            block.timestamp,
            msg.sender
        );
        predictions[count] = newPrediction;
        count++;
        emit NewPrediction(newPrediction);
    }
}
