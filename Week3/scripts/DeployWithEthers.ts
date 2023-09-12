import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from '../typechain-types';  //Note: Change this to the solidity file (i.e fileName__factory) you have compiled

import * as dotenv from 'dotenv';
dotenv.config();


function setupProvider() {
    const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`

    return new ethers.JsonRpcProvider(providerUrl);
}

async function main() {
  
    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "", provider)

    console.log("Deploying contract...");

    // Define the constructor arguments for your TokenizedBallot contract
    const PROPOSALS = ["proposal1", "proposal2", "proposal3"]
    const proposalBytes32String = PROPOSALS.map(ethers.encodeBytes32String)
    const tokenContract = "0xdBD0c5d9cdA13F876372C5973D1029ec9A241a10"
    const blockNumber = 4079346;
    // console.log("Current block number:", blockNumber);

    const contractFactory = new TokenizedBallot__factory(wallet)    
    const someContract = await contractFactory.deploy(proposalBytes32String, tokenContract, blockNumber);
    
    //Alternatively
    //const someContract = new ethers.Contract(contractAddress, contractABI, wallet);

    await someContract.waitForDeployment();
    const address = await someContract.getAddress();
    
    console.log(`Deployed contract at ${address}`);
    

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});