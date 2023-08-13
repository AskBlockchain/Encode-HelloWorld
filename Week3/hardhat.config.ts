import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: { tests: "tests" },
  networks: {
    hardhat: {
      chainId: 1337, // Sepolia chainId
    },
    sepolia: {
      url: "https://sepolia.ledgerium.net/rpc", // Sepolia RPC URL
      chainId: 1729, // Sepolia chainId
      accounts: {
        mnemonic: "your-mnemonic-here", // Add your mnemonic for the Sepolia account
      },
    },
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default config;
