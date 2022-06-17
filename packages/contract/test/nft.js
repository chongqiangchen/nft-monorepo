const { expect } = require("chai");
const { ethers } = require("hardhat");

const cost = ethers.utils.parseUnits('500', 18);
const mintTokenCount = cost.mul(10);

const deployTestToke = async () => {
  const TestToken = await ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy();
  await token.deployed();
  return token;
}

const deployNft = async (costTokenAddress) => {
  const NFT = await ethers.getContractFactory("BabyLaeebMesNFT");
  const nft = await NFT.deploy(cost, costTokenAddress);
  await nft.deployed();
  return nft;
}

const mintAllNft = async (nft, to) => {
  for (let i = 0; i < 10; i++) {
    await nft.reserveToken(to, 99);
  }
  await nft.reserveToken(to, 9);
}

describe("BabyLaeebMesNFT", function () {
  it("Should minting a specified amount of money", async function () {
    const token = await deployTestToke();

    const [owner, account1] = await ethers.getSigners();
    await token.mint(account1.address, 10 * 10 ** 18 + '');
    
    expect(await token.balanceOf(account1.address)).to.equal(ethers.BigNumber.from(10 * 10 ** 18 + ''));
  });

  it("should happy pass", async function() {
    const token = await deployTestToke();
    const nft = await deployNft(token.address);
    const [owner, account1] = await ethers.getSigners();

    // 发送测试代币
    await token.mint(owner.address, mintTokenCount);
    await token.mint(account1.address, mintTokenCount);

    expect(await token.balanceOf(owner.address)).to.equal(mintTokenCount);
    expect(await token.balanceOf(account1.address)).to.equal(mintTokenCount);
    
    // 开启NFT MINT
    nft.setPauseStatus(false);

    // 授权账户的代币可以被NFT合约调用
    await token.approve(nft.address, ethers.constants.MaxUint256);
    await token.connect(account1).approve(nft.address, ethers.constants.MaxUint256);
    
    await nft.mint(3);
    await nft.connect(account1).mint(1);

    expect(await nft.balanceOf(owner.address)).to.equal(3);
    expect(await nft.balanceOf(account1.address)).to.equal(1);
  })

  it("should the initial tokenId is #1", async function() {
    const token = await deployTestToke();
    const nft = await deployNft(token.address);
    const [owner, account1] = await ethers.getSigners();

    // 发送测试代币
    await token.mint(owner.address, mintTokenCount);
    await token.mint(account1.address, mintTokenCount);

    expect(await token.balanceOf(owner.address)).to.equal(mintTokenCount);
    expect(await token.balanceOf(account1.address)).to.equal(mintTokenCount);
    
    // 开启NFT MINT
    nft.setPauseStatus(false);

    // 授权账户的代币可以被NFT合约调用
    await token.approve(nft.address, ethers.constants.MaxUint256);
    await token.connect(account1).approve(nft.address, ethers.constants.MaxUint256);
    
    await nft.mint(3);
    await nft.connect(account1).mint(1);

    expect(await nft.balanceOf(owner.address)).to.equal(3);
    expect(await nft.balanceOf(account1.address)).to.equal(1);
    expect(await nft.tokenOfOwnerByIndex(owner.address, 0)).to.equal(1);
    expect(await nft.tokenOfOwnerByIndex(account1.address, 0)).to.equal(4);
  })

  it("Should throw Mint is paused!", async function () {
    const token = await deployTestToke();
    const [owner] = await ethers.getSigners();

    await token.mint(owner.address, mintTokenCount);
    
    expect(await token.balanceOf(owner.address)).to.equal(mintTokenCount);

    const nft = await deployNft(token.address);

    await expect(nft.mint(1)).to.be.revertedWith("Mint is paused!");
  })

  it("should throw Amount bigger than allowed max mint!", async function() {
    const token = await deployTestToke();
    const [owner] = await ethers.getSigners();

    await token.mint(owner.address, mintTokenCount);
    expect(await token.balanceOf(owner.address)).to.equal(mintTokenCount);

    const nft = await deployNft(token.address);
    await nft.setPauseStatus(false);

    await expect(nft.mint(4)).to.be.revertedWith("Amount bigger than allowed max mint!");
  })

  it("should throw Max supply exceeded!", async function() {
    const token = await deployTestToke();
    const [owner, account1] = await ethers.getSigners();

    await token.mint(owner.address, mintTokenCount);
    expect(await token.balanceOf(owner.address)).to.equal(mintTokenCount);

    const nft = await deployNft(token.address);
    await nft.setPauseStatus(false);
    await mintAllNft(nft, account1.address);

    expect(await nft.balanceOf(account1.address)).to.equal(ethers.BigNumber.from(999));
    await expect(nft.mint(1)).to.be.revertedWith("Max supply exceeded!");
  });

  it("should get tokenURI", async function() {
    const token = await deployTestToke();
    const [owner, account1] = await ethers.getSigners();

    await token.mint(owner.address, mintTokenCount);
    expect(await token.balanceOf(owner.address)).to.equal(mintTokenCount);

    const nft = await deployNft(token.address);
    await nft.setPauseStatus(false);
    await token.approve(nft.address, ethers.constants.MaxUint256);

    await nft.mint(3);
    await nft.setBaseURI("ipfs://test/");
    expect(await nft.tokenURI(1)).to.equal("ipfs://test/1.json");
  })
});
