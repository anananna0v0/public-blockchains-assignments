require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    notunima: {
      url: "http://134.155.50.136:8506",
      chainId: 1337,
      accounts: [process.env.METAMASK_1_PRIVATE_KEY]
    }
  }
};
