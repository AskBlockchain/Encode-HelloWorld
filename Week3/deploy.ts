require("dotenv").config();
import { ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import { MyToken__factory } from "../typechain-types";

function setupProvider() {
  const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
  return new ethers.JsonRpcProvider(providerUrl);
}

async function main() {
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  console.log("deploying contract");

  // to deploy the MyToken and get address to deploy the tokenized ballot cotnract
  const MyTokenContractFactory = new MyToken__factory(wallet);
  const MyTokenContract = await MyTokenContractFactory.deploy();
  await MyTokenContract.waitForDeployment();
  const MyTokenContractAddress = await MyTokenContract.getAddress();

  // script to implement in another file for check past voting power
  const lastBlock = await provider.getBlock("latest");
  const lastBlockNumber = lastBlock?.number ?? 0;

  // proposals need to be formatted to bytes32 to deploy TokenizedBallot contract
  const proposals = ["propsal1", "proposal2"];
  let proposalsBytes32 = [];
  for (let i = 0; i < proposals.length; i++) {
    proposalsBytes32.push(ethers.encodeBytes32String(proposals[i]));
  }

  // deploys TokenizedBallot contract
  const TKBallotContractFactory = new TokenizedBallot__factory(wallet);
  const TKBallotContract = await TKBallotContractFactory.deploy(
    proposalsBytes32,
    MyTokenContractAddress,
    lastBlockNumber
  );
  await TKBallotContract.waitForDeployment();
  const TKBallotContractAddress = await TKBallotContract.getAddress();

  // print address of the deployed contracts
  console.log(
    `address of MyToken contract: ${MyTokenContractAddress} and the address of the TokenizedBallot contract ${TKBallotContractAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
