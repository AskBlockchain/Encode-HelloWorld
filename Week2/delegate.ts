import { ethers } from "ethers";
import * as dotenv from 'dotenv'
dotenv.config();

function setUpProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

// Contract ABI
const contractABI = [{"inputs":[{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"chairperson","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"giveRightToVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposal","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"uint256","name":"weight","type":"uint256"},{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"address","name":"delegate","type":"address"},{"internalType":"uint256","name":"vote","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winnerName","outputs":[{"internalType":"bytes32","name":"winnerName_","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winningProposal","outputs":[{"internalType":"uint256","name":"winningProposal_","type":"uint256"}],"stateMutability":"view","type":"function"}]

// Address of the deployed contract
const contractAddress = '0xC6f13fE65c32c3F16303DE228ec0474cda27D8E9';

const  provider  = setUpProvider();
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// function for delegating 
async function delegate(delegateToAddress: string) {

    try {
        //First checking if the address we are delegating has the right to vote
        const sender = await contract.voters(delegateToAddress)

        if (sender.weight == 0) {
            console.log("The given address does not have the right to vote!")
            return
        }

        console.log("Delegating....")

        // Calling the delegate function
        const tx = await contract.delegate(delegateToAddress);
        await tx.wait();
        console.log(`Delegated to ${delegateToAddress}`);

    } catch (error: any) {
        console.error("Error:", error.message);
        if (error.data) {
            console.error("Revert Reason:");
        }
    }
}

const walletAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
delegate(walletAddress)
    .catch(console.error);

