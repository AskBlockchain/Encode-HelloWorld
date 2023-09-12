import { expect } from "chai";
import { ethers } from "hardhat";
import { SomeFile } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Test...", async () => {
  let myContract: SomeFile;
  let accounts: HardhatEthersSigner[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const myContractFactory = await ethers.getContractFactory(
      "SomeFile"
    );
    myContract = await myContractFactory.deploy();
    await myContract.waitForDeployment();
  });

  it("should ...", async () => {
    expect(0).to.eq(0);
  });

  
});