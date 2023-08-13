import { ethers } from "hardhat";
import { MyToken__factory } from '../typechain-types';  //Note: Change this to the solidity file (i.e fileName__factory) you have compiled


async function main() {
    const [deployer, account2] = await ethers.getSigners();

    const contractFactory = new MyToken__factory(deployer) //for hardhat
    //Or
    // const contractFactory = await ethers.getContractFactory("MyToken")


    const someContract = await contractFactory.deploy();

    await someContract.waitForDeployment();

    const tokenContractAddress = await someContract.getAddress();
    console.log(tokenContractAddress);


}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
