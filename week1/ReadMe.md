# HelloWorld Contract

## Overview

The `HelloWorld` contract is a simple Ethereum smart contract written in Solidity. It allows the owner of the contract to set a text string, which can be retrieved by anyone.

## Contract Details

### State Variables

- `text`: A private string that stores the text set by the owner of the contract.
- `owner`: A public address that stores the owner of the contract.

### Constructor

The constructor sets the `text` state variable to "Hello World" and the `owner` state variable to the address that deployed the contract.

### Functions

- `helloWorld()`: This function returns the current text. It is a `public` function and can be called by anyone.

- `setText(string calldata newText)`: This function sets the `text` state variable to `newText`. It can only be called by the owner of the contract.

- `transferOwnership(address newOwner)`: This function transfers the ownership of the contract to `newOwner`. It can only be called by the current owner.

### Modifiers

- `onlyOwner`: This modifier restricts the `setText` and `transferOwnership` functions to be called only by the owner of the contract. If the caller is not the owner, it reverts the transaction with the message "Caller is not the owner".

- # Storage Details Report

The following report describes the changes in storage that occurred during the execution of a transaction on the Ethereum address `0xCFC9f4...64B27477`.

## Ether Balances and Nonce

The Ether balance of the address did not change during the transaction. It remained at `0 Eth`. The nonce of the address also remained the same, at `1`, indicating that no new transactions were sent from this address.

## Storage Changes

Four storage slots were updated during the transaction:

1. **Storage Address 0x0000000000000000000000000000000000000000000000000000000000000000:** The initial value was empty. After the transaction, it was updated with the string "Hello World".

2. **Storage Address 0x0000000000000000000000000000000000000000000000000000000000000001:** The initial value was `0x0`. After the transaction, it was updated with the value `0x1c042700057891c76d2c95b66bb09c441c5ebd2f`, which represents an Ethereum address.

3. **Storage Address 0x0000000000000000000000000000000000000000000000000000000000000002:** The initial value was `0`. After the transaction, it was updated with the value `1`.

4. **Storage Address 0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace:** The initial value was `0x0`. After the transaction, it was updated with the value `0x1c042700057891c76d2c95b66bb09c441c5ebd2f`, which represents an Ethereum address.

## Conclusion

The transaction resulted in the update of four storage slots. These changes likely represent the initialization of a smart contract, with the storage slots being used to store the contract's state. The Ethereum address `0x1c042700057891c76d2c95b66bb09c441c5ebd2f` is likely the owner of the contract, and the string "Hello World" is likely an initial state or message of the contract.

## Contract Code

Here is the full code of the contract:

```solidity
/**
 *Submitted for verification at Etherscan.io on 2023-07-27
*/

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;
    address public owner;

    constructor() {
        text = "Hello World";
        owner = msg.sender;
    }

    function helloWorld() public view returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public onlyOwner {
        text = newText;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    modifier onlyOwner()
    {
        require (msg.sender == owner, "Caller is not the owner");
        _;
    }
}
````

# Transactions

## Failed Transaction

The transaction failed when trying to execute the `setText(string newText)` function of the contract. This function is designed to update the `text` state variable of the contract.

### Input Data

The input data for the transaction was:

- `MethodID`: `0x5d3a1f9d`. This is the function signature for `setText(string)`.
- `Parameters`:
  - `[0]`: `0000000000000000000000000000000000000000000000000000000000000020`. This is an offset to the location of the data part of the first (and only) parameter.
  - `[1]`: `0000000000000000000000000000000000000000000000000000000000000016`. This is the length of the string parameter in bytes.
  - `[2]`: `48656c6c6f20456e636f6465202d2047726f7570203800000000000000000000`. This is the data part of the string parameter, encoded in hexadecimal. When decoded, it reads "Hello Encode - Group 8".

The transaction likely failed because the `setText(string newText)` function includes a `onlyOwner` modifier, and the transaction was not sent by the owner of the contract. Alternatively, the contract could have run out of gas if the provided gas limit was too low.


![Failed Transaction](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/HelloWorld%20-%20Failed%20Transaction.png)


# Transaction Comparison Report

This report compares two transactions that were executed on the `HelloWorld` contract. Both transactions called the `transferOwnership(address newOwner)` function, which transfers the ownership of the contract to a new owner.

## Transaction 1: Transfer to Existing Owner's Address

In the first transaction, the ownership of the contract was transferred to the existing owner's address (`0x1c0427...1c5ebd2f`). 

### State Changes

- The Ether balance of the owner's address decreased slightly due to the gas cost of the transaction.
- The Ether balance of the miner (`0xFf58d7...8837E883`) increased by the same amount, representing the gas fee that was paid for the transaction.
- No changes were made to the contract's storage, as the owner remained the same.

  ![Transfer Ownership](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/Transfer%20Ownership%20New%20Owner.png)

## Transaction 2: Transfer to New Address

In the second transaction, the ownership of the contract was transferred to a new address (`0x498af4a8a9902e667ee8ffb1d064119eb27f9652`).

### State Changes

- The Ether balance of the original owner's address (`0x1c0427...1c5ebd2f`) decreased slightly due to the gas cost of the transaction.
- The Ether balance of the miner (`0x000000...00000000`) increased by the same amount, representing the gas fee that was paid for the transaction.
- The contract's storage was updated. The storage address `0x0000000000000000000000000000000000000000000000000000000000000001`, which stores the owner of the contract, was updated with the new owner's address.

![Transfer Ownership newOwner](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/Transfer%20Ownership%20New%20Owner.png)

## Conclusion

While both transactions involved the `transferOwnership(address newOwner)` function, they had different effects. The first transaction did not change the state of the contract, as the ownership was transferred to the existing owner's address. The second transaction, however, did change the state of the contract, as the ownership was transferred to a new address.














