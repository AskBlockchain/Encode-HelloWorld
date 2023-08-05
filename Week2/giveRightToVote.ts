import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * @title giveRightToVote
 * @dev this script can only be executed by the deployer of the contract, known as the the chairperson.
 * @dev this script will give voting rights to the address that is given as an input.
 * @dev to run script with npx: npx ts-node --files scripts/giveRightToVote.ts @param address
 * @dev to run script with yarn: yarn ts-node --files scripts/giveRightToVote.ts @param address
 */

function setupProvider() {
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  return provider;
}

const [address] = process.argv.slice(2);

// Contract ABI
const contractABI = [
  {
    inputs: [
      { internalType: "bytes32[]", name: "proposalNames", type: "bytes32[]" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "chairperson",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "voter", type: "address" }],
    name: "giveRightToVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "proposals",
    outputs: [
      { internalType: "bytes32", name: "name", type: "bytes32" },
      { internalType: "uint256", name: "voteCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "proposal", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "voters",
    outputs: [
      { internalType: "uint256", name: "weight", type: "uint256" },
      { internalType: "bool", name: "voted", type: "bool" },
      { internalType: "address", name: "delegate", type: "address" },
      { internalType: "uint256", name: "vote", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winnerName",
    outputs: [
      { internalType: "bytes32", name: "winnerName_", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winningProposal",
    outputs: [
      { internalType: "uint256", name: "winningProposal_", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Address of the deployed contract.
const contractAddress = "0x9F6AB5a344D5d737eE92B8D790ba564C6FAb7f3a";

/** @notice main function to take an address and give it voting rights */
async function giveVotingRights(newVoter: string) {
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  const ballotContract = new ethers.Contract(
    contractAddress,
    contractABI,
    wallet
  );

  /** @dev the giveRightToVote function in the contract Ballot.sol can only be called by the chairperson  */
  await ballotContract.giveRightToVote(newVoter);
  console.log(`Address ${newVoter} has been submitted.`);
}

giveVotingRights(address)
  .then(() => {
    console.log("Voting rights granted successfully.");
    process.exitCode = 0;
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

/**
 * @notice REPORT FOR THIS SCRIPT
 * REVERTED:  Error: execution reverted: "Only chairperson can give right to vote."
 * In this ocntract only the address that is the deployer of the contract,
 * or the chairperson can give the right to vote and call this function.
 * As I am not the deployer of the contract, I am unable to add an address
 * to give it the right to vote, unless the contract changed ownership to me.
 *  
 * The script can only be called by the owner of the contract and uses a function called giveRightToVote which
 * takes a string as an input and using the instance of the Ballot.sol
 * contract, makes a call to the giveRightToVote function in the contract
 * with the string, and updates the state of the contract.
 *
 * EXAMPLE SCRIPT CALL WITH NPX: npx ts-node --files scripts/giveRightToVote.ts "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4" 
 * EXAMPLE SCRIPT CALL WITH YARN: yarn ts-node --files scripts/giveRightToVote.ts "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4" 

 */
