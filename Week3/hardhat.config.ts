import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: { tests: "tests" },
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.INFURA_API_KEY,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
};

export default config;
