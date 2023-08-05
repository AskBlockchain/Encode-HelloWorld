import { ethers } from "ethers";
import * as dotenv from 'dotenv'
dotenv.config();

/**
 * @title vote 
 * @dev The script is made to cast a vote for a wallet that has permissions granted or is the chairperson.
 * @dev the script will return a success on voting or a message of error if the wallet already voted
 * @dev to run the script with npx: npx ts-node --files scripts/vote.ts
 * @dev to run script with yarn: yarn ts-node --files scripts/vote.ts
 * 
 */


//this function creates to instances, one for the provider and one for the wallet, returns an object that can be utilized after
function setUpProvider(){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    return { provider, wallet };
}


// Contract ABI
const contractABI = [{"inputs":[{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"chairperson","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"giveRightToVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposal","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"uint256","name":"weight","type":"uint256"},{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"address","name":"delegate","type":"address"},{"internalType":"uint256","name":"vote","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winnerName","outputs":[{"internalType":"bytes32","name":"winnerName_","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winningProposal","outputs":[{"internalType":"uint256","name":"winningProposal_","type":"uint256"}],"stateMutability":"view","type":"function"}]

// Address of the deployed contract
const contractAddress = '0x9F6AB5a344D5d737eE92B8D790ba564C6FAb7f3a';

//Initialize variable with the setUpProviderFunction
const  wallet  = setUpProvider();

//Initialize the contract variable calling ethers and passing the addres of the contract, the ABI, and the object with the wallet and the provider
const contract = new ethers.Contract(contractAddress, contractABI, wallet);


// function for casting a vote, takes a number that is passed trough the fuction and is the proposal to be voted, returns a message with the voted proposal
async function vote(proposalIndex: number) {
    const tx = await contract.vote(proposalIndex);
    await tx.wait();
    console.log(`Voted for proposal ${proposalIndex}`);
}


// calling the async function
vote(2).catch(console.error);


/**
 *  @notice REPORT FOR THIS SCRIPT
 * Succesful voted for the proposal as the chairperson is the deployer of the contract and the one casting the vote
 * The script would reverted if the wallet contract has no right to vote or has already voted
 * When the wallet interacts casting a vote the contract record that wallet to Voted in the voter struct
 * so it is unnable to vote again or change his vote
 * 
 * The function is called by a wallet with voting rights or the chairperson, and uses the function vote 
 * wich takes a number to represent the proposal to vote for.
 * 
 * 
 */