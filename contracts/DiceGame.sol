// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DiceGame {
    IERC20 PredictionToken;
    struct Prediction {
        uint256 value;
        uint256 time;
        address from;
    }
    uint256 public count;
    Prediction[6] public predictions;
    event NewPrediction(Prediction);

    constructor(address _tokenAddress) {
        PredictionToken = IERC20(_tokenAddress);
    }

    function predict(uint256 _value) external {
        require(count < 6, "Cannot add more");
        PredictionToken.transferFrom(msg.sender, address(this), 1);
        Prediction memory newPrediction = Prediction(
            _value,
            block.timestamp,
            msg.sender
        );
        predictions[count] = newPrediction;
        count++;
        emit NewPrediction(newPrediction);
    }

    function getRankList(uint256 _actualvalue) external {
        for (uint256 i = 0; i < predictions.length; i++) {
            if (predictions[i].value >= _actualvalue) {
                predictions[i].value = predictions[i].value - _actualvalue;
            } else {
                predictions[i].value = _actualvalue - predictions[i].value;
            }
        }
        for (uint256 i = 0; i < predictions.length; i++) {
            for (uint256 j = 0; j < predictions.length - i - 1; j++) {
                // if current amt > next amt
                if (predictions[j].value > predictions[j + 1].value) {
                    Prediction memory temp = predictions[j];
                    predictions[j] = predictions[j + 1];
                    predictions[j + 1] = temp;
                }
                if (
                    predictions[j].value == predictions[j + 1].value &&
                    predictions[j].time > predictions[j + 1].time
                ) {
                    Prediction memory temp = predictions[j];
                    predictions[j] = predictions[j + 1];
                    predictions[j + 1] = temp;
                }
            }
        }
        PredictionToken.transfer(predictions[0].from, 6);
    }

    function resetPredictions() external {
        count = 0;
        delete predictions;
    }
}
