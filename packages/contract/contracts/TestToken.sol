// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    constructor() public ERC20("Test", "TEST"){
    }

    function mint(address to, uint256 _amount) public onlyOwner {
        _mint(to, _amount);
    }
}