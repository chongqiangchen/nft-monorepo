const hre = require("hardhat");

async function main() {
  const TestToken = await ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy();
  await token.deployed();

  const NFT = await ethers.getContractFactory("BabyLaeebMesNFT");
  const cost = ethers.utils.parseUnits('500', 18);

  const nft = await NFT.deploy(cost, token.address);
  await nft.deployed();

  console.log("BabyLaeebMesNFT deployed to:", nft.address);
  console.log("TestToken deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
