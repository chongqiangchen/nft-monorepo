// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BabyLaeebMesNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public maxSupply = 999;
    uint256 public maxMintAmountPerWallet = 3;
    string private _baseTokenURI;
    string private metaExtension = ".json";
    
    uint256 public cost;
    address public costToken;
    
    bool public paused = true;
    mapping(address => uint256) public addressMintCount;
    
    constructor(uint256 _cost, address _costToken) ERC721("BabyLaeeb Mes Test", "BabyLaeebMesTest") {
        cost = _cost;
        costToken = _costToken;
    }

    modifier mintCompliance(uint256 _mintAmount) {
        require(
            _mintAmount > 0 &&
                addressMintCount[msg.sender] + _mintAmount <=
                maxMintAmountPerWallet,
            "Amount bigger than allowed max mint!"
        );
        require(
            totalSupply() + _mintAmount <= maxSupply,
            "Max supply exceeded!"
        );
        _;
    }

    modifier mintCostCompliance() {
        uint costTokenBalance = IERC20(costToken).balanceOf(msg.sender);
        require(costTokenBalance >= cost, "Not enough money!");
        _;
    }

    function mint(uint256 amount) public mintCompliance(amount) mintCostCompliance {
        require(!paused, "Mint is paused!");

        IERC20(costToken).transferFrom(msg.sender, address(0x0000000000000000000000000000000000000001), cost);
        uint total = totalSupply();
        
        addressMintCount[msg.sender] = addressMintCount[msg.sender] + amount;

        for (uint i = 0; i < amount; i++) {
            uint nextId = total + i + 1;
            _safeMint(msg.sender, nextId);
        }
    }

    function reserveToken(address to, uint256 amount) public onlyOwner {
        uint total = totalSupply();
        require(total + amount <= maxSupply, "Max supply exceeded!");
        for (uint256 i = 0; i < amount; i++) {
             uint nextId = total + i + 1;
            _safeMint(to, nextId);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setCostAddress(address _costToken) public onlyOwner {
        costToken = _costToken;
    }

    function setCost(uint _cost) public onlyOwner {
        cost = _cost;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setPauseStatus(bool _pause) public onlyOwner {
        paused = _pause;
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return bytes(_baseTokenURI).length > 0 ?
            string(abi.encodePacked(_baseTokenURI, tokenId.toString(), metaExtension)) : "";
    }
}
