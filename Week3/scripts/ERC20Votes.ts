import { ethers } from 'hardhat';
import { MyToken__factory } from '../typechain-types';

const MINT_VALUE = ethers.parseEther("1");

async function main() {
    const [deployer, acc1, acc2, acc3] = await ethers.getSigners();
    const contractFactory = new MyToken__factory(deployer);
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`Token contract deployed at ${contractAddress}\n`);

// Mint some tokens
  const mintTx = await contract.mint(acc1.address, MINT_VALUE);
  await mintTx.wait();
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${
      acc1.address
    }\n`
  );
  const balanceBN = await contract.balanceOf(acc1.address);
  console.log(
    `Account 1 has ${balanceBN.toString()} decimal units of MyToken\n`
  );

  // Check the voting power
  const votes = await contract.getVotes(acc1.address);
  console.log(
    `Account 1 has ${votes.toString()} units of voting power before self delegating\n`
  );


  // Self delegate
  const delegateTx = await contract.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();
  
  // Check the voting power
  const votesAfter = await contract.getVotes(acc1.address);
  console.log(
    `Account 1 has ${votesAfter.toString()} units of voting power after self delegating\n`
  );

  
  console.log("Transfering Tokens to Account 2...")
  // Transfer tokens
  const transferTx = await contract
    .connect(acc1)
    .transfer(acc2.address, MINT_VALUE / 2n);
  await transferTx.wait();

  // Check the voting power
  const votes1AfterTransfer = await contract.getVotes(acc1.address);
  console.log(
    `Account 1 has ${votes1AfterTransfer.toString()} units of voting power after transfering\n`
  );


  // Self delegate
  // const delegate2Tx = await contract.connect(acc2).delegate(acc2.address);
  // await delegate2Tx.wait();

  const votes2AfterTransfer = await contract.getVotes(acc2.address);
  console.log(
    `Account 2 has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
  );

  //Checking past Votes 
  const latestBlock = await ethers.provider.getBlock("latest");
  const blockNumber = latestBlock?.number ?? 0
  console.log("Current block is:", blockNumber)
  const pastVotes = await contract.getPastVotes(acc1.address, blockNumber - 1)
  console.log(
    `Account 1 had ${pastVotes.toString()} units of voting power in block ${blockNumber - 1}\n`
  );


  console.log("Current block is:", blockNumber - 1)
  const pastVotes2 = await contract.getPastVotes(acc1.address, blockNumber - 2)
  console.log(
    `Account 1 had ${pastVotes2.toString()} units of voting power in block ${blockNumber - 2}\n`
  );
  return



  // Transfer tokens to acc3
  const transfer2Tx = await contract
    .connect(acc2)
    .transfer(acc3.address, MINT_VALUE / 4n);
  await transfer2Tx.wait();


  // Self delegate
  const delegate3Tx = await contract.connect(acc3).delegate(acc3.address);
  await delegate3Tx.wait();

  // Check the voting power
  const votes3AfterTransfer = await contract.getVotes(acc2.address);
  console.log(
    `Account 2 has ${votes3AfterTransfer.toString()} units of voting power after transfering\n`
  );
  const votes4AfterTransfer = await contract.getVotes(acc3.address);
  console.log(
    `Account 3 has ${votes4AfterTransfer.toString()} units of voting power after receiving a transfer\n`
  );

  


}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });