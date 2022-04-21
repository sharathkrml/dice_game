// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract DiceGame is KeeperCompatibleInterface {
    struct Prediction {
        uint256 value;
        uint256 time;
        address from;
    }
    uint256 public count;
    uint256 public diceResult;
    uint256 public standby;
    Prediction[6] public predictions;
    event NewPrediction(Prediction);

    function predict(uint256 _value) external {
        require(count < 6, "Cannot add more");
        Prediction memory newPrediction = Prediction(
            _value,
            block.timestamp,
            msg.sender
        );
        predictions[count] = newPrediction;
        count++;
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
    }

    function resetPredictions() internal {
        diceResult = 0;
        count = 0;
        delete predictions;
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
            (diceResult == 0 && count == 6) ||
            (diceResult != 0 && block.timestamp > standby);
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        if (diceResult == 0 && count == 6) {
            diceResult = ((block.timestamp + block.difficulty) % 6) + 1;
            getRankList(diceResult);
            standby = block.timestamp + 3 minutes;
        }
        if (diceResult != 0 && block.timestamp > standby) {
            resetPredictions();
        }
    }
}
