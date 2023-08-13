import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from '../typechain-types';  //Note: Change this to the solidity file (i.e fileName__factory) you have compiled

import * as dotenv from 'dotenv';
dotenv.config();

const MINT_VALUE = ethers.parseEther("1");

const ballotContractAddress = "0x895E11033225Dd644cbca8E1DD319bBcd6538208"
// const ballotContractAddress = "0x0f9Db5Ab81282Ca66B9FC1e259814d498E82415E" //rashi's contract

const ballotContractAbi  = [{"inputs":[{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"},{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_targetBlockNumber","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposal","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Vote","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"targetBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenContract","outputs":[{"internalType":"contract IVoteToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposal","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"votingPower","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"votingPowerSpent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winnerName","outputs":[{"internalType":"bytes32","name":"winnerName_","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winningProposal","outputs":[{"internalType":"uint256","name":"winningProposal_","type":"uint256"}],"stateMutability":"view","type":"function"}]


function setupProvider() {
    const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`

    return new ethers.JsonRpcProvider(providerUrl);
}

async function main() {
  
    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_2 ?? "", provider)

    console.log("Current address:",wallet.address)

    const ballotContract = new ethers.Contract(ballotContractAddress, ballotContractAbi, wallet);

    const cAddress = await ballotContract.getAddress()
    console.log(`Deployed contract at ${cAddress}`);

    // const blockNum = await ballotContract.targetBlockNumber()
    // console.log(blockNum);

    // return

    //17904178n
    //4079346

    // calling votingPower 
    const checkVotingPower = await ballotContract.connect(wallet).votingPower(wallet.address)
    // await checkVotingPower.wait();
    console.log("Current voting power:",checkVotingPower)

    return

    const castingVote = await ballotContract.connect(wallet).vote(0, MINT_VALUE/2n)
    // await checkVotingPower.wait();
    const proposal = await ballotContract.connect(wallet).proposals(0)
    console.log("Vote counts of proposal 1:", proposal.voteCount)





}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

