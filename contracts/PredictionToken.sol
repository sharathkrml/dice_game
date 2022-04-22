// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PredictionToken is ERC20 {
    constructor() ERC20("PredictionToken", "PTK") {}

    function mint() public {
        _mint(msg.sender, 10);
    }
}
