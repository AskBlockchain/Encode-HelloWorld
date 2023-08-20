import { Injectable } from '@nestjs/common';
import {ethers} from "ethers"
import * as tokenJson from "./assets/token.json"
const CONTRACT_ADDRESS = "0x275747A17ccb975C68F7708927D71Bb440B16fF8"



@Injectable()
export class AppService {
  contract :ethers.Contract;
  provider :ethers.Provider;
  wallet: ethers.Wallet;
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_ENDPOINT_URL ?? "",);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "",this.provider)
    this.contract = new ethers.Contract(CONTRACT_ADDRESS,tokenJson.abi,this.wallet);


  }
getContractAddress(): {address:string}{
  return {address :CONTRACT_ADDRESS};
}

  getHello(): string {
    return 'Hello mf!';
  }

  getAnotherThing(): string{
    return "sup";
  }
  getTotalSupply(){

    return this.contract.totalSupply();
  }
  
  getTokenBalance(address:string){
    return this.contract.balanceOf(address);
  }
  
  async mintTokens(address:string) {
    try{
    const MINT_VALUE = ethers.parseUnits("1");
    const mintTx = await this.contract.mint(address, MINT_VALUE);
    await mintTx.wait();
    console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${
        address
    }`);
    const balanceBN = await this.contract.balanceOf(address);
    console.log(
        `Account ${
            address
        } has ${balanceBN.toString()} decimals units of MyToken
        `);
      const txHash = mintTx.hash
    console.log(mintTx.hash)
  
    return {result:txHash};
      }
      catch(error){
        console.log(error);
        return {result:error};
      }
  }

  async castVote(proposal: number, amount: string) {
    console.log(`Voting to proposal ${proposal}...`);

    const voteTx = await this.contract.vote(proposal, ethers.parseEther(amount));

    const receipt = await voteTx.wait();
    console.log(
      `Voted to proposal ${proposal}! Transaction hash: ${receipt.hash}`,
    );

    return { result: true, txHash: receipt.hash };
  }

}
