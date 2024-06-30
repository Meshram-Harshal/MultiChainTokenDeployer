require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/1ddbb82b063942009c1576e47bf3590a",
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/1ddbb82b063942009c1576e47bf3590a",
    },
    optimism: {
      url: "https://optimism-mainnet.infura.io/v3/1ddbb82b063942009c1576e47bf3590a",
    },
    arbitrum: {
      url: "https://arbitrum-mainnet.infura.io/v3/1ddbb82b063942009c1576e47bf3590a",
    },
    base: {
      url: "https://base-mainnet.g.alchemy.com/v2/gFNkHFHNlcusrvA5T3wxaDguE-8wzy81",
    },
    baseSepolia: {
      url: "https://base-sepolia.g.alchemy.com/v2/gFNkHFHNlcusrvA5T3wxaDguE-8wzy81",
    },
  },
};