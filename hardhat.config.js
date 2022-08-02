require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-gas-reporter");
require("solidity-coverage");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
      },
    ],
  },
  networks: {
    bscscan: {
      url:  process.env.BINANCE_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.ETHERSCAN_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    matic: {
      url: process.env.POLYGON_URL,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.RINKEBY_API,
      bscTestnet:process.env.BINANCE_API ,
      polygonMumbai: process.env.POLYGON_API
    }
  }
};
