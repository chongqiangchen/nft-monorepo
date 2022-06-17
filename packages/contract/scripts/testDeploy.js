const hre = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  const TestToken = await ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy();
  await token.deployed();

  const tMintTx = await token.mint(owner.address, ethers.utils.parseUnits("5000", 18));
  await tMintTx.wait();
  console.log('finish token mint: ', tMintTx.hash);

  const NFT = await ethers.getContractFactory("BabyLaeebMesNFT");
  const cost = ethers.utils.parseUnits('500', 18);

  const nft = await NFT.deploy(cost, token.address);
  await nft.deployed();
  console.log("BabyLaeebMesNFT deployed to:", nft.address);

  const approveTx = await token.approve(nft.address, ethers.constants.MaxUint256);
  console.log('finish token approve: ', approveTx.hash);

  const pauseTx = await nft.setPauseStatus(false);
  await pauseTx.wait();
  console.log('finish nft pause: ', pauseTx.hash);
  const gas = await nft.estimateGas.mint(3);
  console.log(`gas: ${gas}`);
  const tx = await nft.mint(3, {
    gasLimit: gas
  });
  console.log('finish nft mint: ', tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
