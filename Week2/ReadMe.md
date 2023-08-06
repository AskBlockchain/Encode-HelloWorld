# Contract Deployment Report

This report provides a summary of the contract deployment process, including the addresses, state differences, and storage changes before and after the deployment.

## Contract Addresses

### 1. Address: `0x87D51f...DC69729B`
- Balance Before: 1.998624464012412051 Eth
- Nonce Before: 1
- Balance After: 1.997228313945038693 Eth
- Nonce After: 2
- State Difference: 0.001396150067373358 Eth

### 2. Address: `0xf24A01...EFc392cDMiner`
- Balance Before: 2,236.355886335932854041 Eth
- Balance After: 2,236.357040356932854041 Eth
- State Difference: 0.001154021 Eth

### 3. Address: `0xf6eC3f...a51F6EFe`
- Balance Before: 0 Eth
- Nonce Before: 1
- Balance After: 0 Eth
- Nonce After: 1

## Storage Changes

### Storage Address: `0x0000000000000000000000000000000000000000000000000000000000000000`
- Before: 0x0
- After: 0x00000000000000000000000087d51f8ab6c2cad50d377a3f95320bc5dc69729b

### Storage Address: `0x0000000000000000000000000000000000000000000000000000000000000002`
- Before: 0x0
- After: 0x0000000000000000000000000000000000000000000000000000000000000004

### Storage Address: `0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace`
- Before: 0x0
- After: 0x43616b6500000000000000000000000000000000000000000000000000000000

### Storage Address: `0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad0`
- Before: 0x0
- After: 0x50697a7a61000000000000000000000000000000000000000000000000000000

### Storage Address: `0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad2`
- Before: 0x0
- After: 0x4d696c6b205368616b6500000000000000000000000000000000000000000000

### Storage Address: `0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad4`
- Before: 0x0
- After: 0x49636520437265616d0000000000000000000000000000000000000000000000

### Storage Address: `0x54f47b815dad634f6f88cf62c696c485c9ffe4ebd53fad1c8856b9c76ded1e71`
- Before: 0x0
- After: 0x0000000000000000000000000000000000000000000000000000000000000001

The above report provides detailed information about the contract deployment. It includes the addresses of the contracts before and after deployment, along with the state differences. Additionally, the changes in storage are listed for each storage address. This report helps to track the changes and state of the contracts during the deployment process.


```javascript
import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();
//import { Ballot } from "../typechain-types";


function setProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.PORTAL_ENDPOINT_URL ?? "sepolia");
  return provider;
}




async function main() {
   const proposals = process.argv.slice(2); //PROPOSALS ARRAY
  // console.log("Deploying Ballot contract");
  // console.log("Proposals: ");
  // proposals.forEach((element, index) => {
  // console.log(`Proposal N. ${index + 1}: ${element}`);
  // });

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
  throw new Error('PRIVATE_KEY environment variable not set');
  }


   
  const provider = setProvider();  
  const wallet = new ethers.Wallet(privateKey, provider);
  const ballotFactory = new Ballot__factory(wallet); 
  const ballotContract = await ballotFactory.deploy( //Contrat Object gets deployed
    proposals.map(ethers.encodeBytes32String) //Args passed in gets converted from String to Bytes32
  );

  //Getting the contract address
  await ballotContract.waitForDeployment(); //wait for contract to be deployed 
  const address = await ballotContract.getAddress(); //get contract address method
  console.log(`Contract deployed to the address ${address}`);


  //Decoding Bytes32 to String
  for (let index = 0; index < proposals.length; index++) {
    const proposal = await ballotContract.proposals(index);
    const name = ethers.decodeBytes32String(proposal.name);
    console.log({ index, name, proposal });
  }
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```



# Delegate Function

## Posibility of loop in Delegation chain

  - In case of a loop/cycle in delegation chain, the function should revert the execution.
  
  - We provided right to vote for demonstrating the loop/cycle condition to this following three addresses :-
    * 0xdACdf692842ae754a040D9D0F1D86aEEEEF9BDF6 [Address 1]
    * 0x251b187103823180E27b2052EFc11EB344C72E2B [Address 2]
    * 0x66C52277289Bb354DE5C9c1b3cB8Df793BdD2bce [Address 3]

  - After providing right to vote these address can now vote or add a delegate to vote on their behalf.

  - ### First transaction - Address 1 adds Address 2 as delegate
    <img width="950" alt="image" src="https://github.com/AskBlockchain/Encode-HelloWorld/assets/85375791/4c792740-263f-4c13-a0a0-3f63458bca7b">

  - ### Second transaction - Address 2 adds Address 3 as delegate
    <img width="947" alt="image" src="https://github.com/AskBlockchain/Encode-HelloWorld/assets/85375791/47dce764-551f-4016-990b-8ee4c4261e0f">

  - ### Third transaction - Reverts When Address 3 tries to add Address 1 as delegate
    Revert message in remix terminal -
     > transact to Ballot.delegate errored: Returned error: {"jsonrpc":"2.0","error":`__"execution reverted: Found loop in delegation."__`,"id":7942531669002302}

## Posibility of revoting through delegate - Should revert the attempt

  ### Address - 0x251b187103823180E27b2052EFc11EB344C72E2B has already voted. When tried voting through delegate it reverts.
   > transact to Ballot.delegate errored: Returned error: {"jsonrpc":"2.0","error":`__"execution reverted: You already voted__.`","id":7942531669002897}

## Self delegation is another case that is handled inside this function

  ### When tried to add delegate vote by passing own address as delegate address in function parameter it reverts with following message.
   > transact to Ballot.delegate errored: Returned error: {"jsonrpc":"2.0","error":`__"execution reverted: Self-delegation is disallowed."__`,"id":7942531669005039}
> 


# Delegate Vote

This report provides details about a transaction involving two addresses and changes in state and storage.

## Address: `0x87D51f...DC69729B`
- Balance Before: 1.997228313945038693 Eth
- Nonce: 2
- Balance After: 1.997174744230992923 Eth
- Nonce: 3
- State Difference: 0.00005356971404577 Eth

## Address: `0xf24A01...EFc392cDMiner`
- Balance Before: 2,239.076096185185265627 Eth
- Balance After: 2,239.076144830185265627 Eth
- State Difference: 0.000048645 Eth

## Address: `0xf6eC3f...a51F6EFe`
- No balance change observed in this transaction

## Storage Changes

### Storage Address: `0x9121ca3a096a885350731140cce934de1b2997d62529e834bf6c096416b324f0`
- Before: 0x0000000000000000000000000000000000000000000000000000000000000000
- After: 0x0000000000000000000000000000000000000000000000000000000000000001

The above report outlines the changes that occurred during the transaction. It includes the changes in balances and nonces for two addresses. Additionally, the report indicates that there were no balance changes for the address `0xf6eC3f...a51F6EFe`. Furthermore, the storage change at the specified address has been recorded.

Please note that this report is based on the provided information and is specific to the transaction described above.

```javascript
import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// Assuming that the Ballot.json file is in the same directory as this script
import path from 'path';
const ABI_FILE_PATH = require(path.resolve(__dirname, 'Ballot.json'));

const delegatedTo = "0x1c042700057891c76d2c95b66bb09C441c5ebd2f";

function setProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.PORTAL_ENDPOINT_URL ?? "sepolia");
  return provider;
}

//Sender Private Key
const privateKey = process.env.VOTER_PRIVATE_KEY;
if (!privateKey) {
throw new Error('PRIVATE_KEY environment variable not set');
}

// Create a wallet instance with the private key and connect it to the provider
const wallet = new ethers.Wallet(privateKey);
const provider = setProvider();
const signer = wallet.connect(provider);


async function main() {
    const DEPLOYED_CONTRACT_ADDRESS = "0xf6eC3f13AFd908D3EFd3B8048e2aEe1da51F6EFe";
    const provider = setProvider();
    const ballot = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, ABI_FILE_PATH.abi, signer);
    const tx = await ballot.delegate(delegatedTo);
    await tx.wait();
    console.log("Delegated my vote to Jake: ", delegatedTo);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
```

  

  


  
  
  
