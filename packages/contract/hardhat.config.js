require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.4",
  networks: {
    bsctestnet: {
      url: "https://speedy-nodes-nyc.moralis.io/4e935d167635022c5e50f604/bsc/testnet",
      accounts: [process.env.PRIVATE_KEY],
    },
    bsc: {
      url: "http://34.202.86.197:8545",
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: 'F92WF6RKY7D77W79YKZ1EFUCIVKRTD3WAK',
  }
};