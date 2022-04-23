// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract DiceGame is KeeperCompatibleInterface {
    IERC20 PredictionToken;
    struct Prediction {
        uint256 value;
        uint256 time;
        address from;
    }
    struct Results {
        uint8 count;
        uint256 diceResult;
        uint256 standby;
    }
    Results public result;
    Prediction[6] public predictions;

    event NewPrediction(Prediction);
    event Published();
    event ResetAll();

    constructor(address _tokenAddress) {
        PredictionToken = IERC20(_tokenAddress);
    }

    function predict(uint256 _value) external {
        require(result.count < 6, "Can't add more");
        PredictionToken.transferFrom(msg.sender, address(this), 1);
        Prediction memory newPrediction = Prediction(
            _value,
            block.timestamp,
            msg.sender
        );
        predictions[result.count] = newPrediction;
        result.count++;
        emit NewPrediction(newPrediction);
    }

    function getRankList(uint256 _actualvalue) internal {
        for (uint256 i = 0; i < predictions.length; i++) {
            if (predictions[i].value >= _actualvalue) {
                predictions[i].value = predictions[i].value - _actualvalue;
            } else {
                predictions[i].value = _actualvalue - predictions[i].value;
            }
        }
        for (uint256 i = 0; i < predictions.length; i++) {
            for (uint256 j = 0; j < predictions.length - i - 1; j++) {
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

    function resetPredictions() internal {
        delete result;
        delete predictions;
        emit ResetAll();
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded =
            (result.diceResult == 0 && result.count == 6) ||
            (result.diceResult != 0 && block.timestamp > result.standby);
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        if (result.diceResult == 0 && result.count == 6) {
            result.diceResult = ((block.timestamp + block.difficulty) % 6) + 1;
            getRankList(result.diceResult);
            result.standby = block.timestamp + 5 minutes;
            emit Published();
        }
        if (result.diceResult != 0 && block.timestamp > result.standby) {
            resetPredictions();
        }
    }
}
