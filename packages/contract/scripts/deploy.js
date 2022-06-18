const hre = require("hardhat");
const args = require("./nftArgs");

async function main() {
  const NFT = await ethers.getContractFactory("BabyLaeebMesNFT");
  const nft = await NFT.deploy(args[0], args[1]);
  await nft.deployed();

  console.log("BabyLaeebMesNFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
