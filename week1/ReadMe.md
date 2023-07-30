# HelloWorld Contract

## Overview

The `HelloWorld` contract is a simple Ethereum smart contract written in Solidity. It allows the owner of the contract to set a text string, which can be retrieved by anyone.

## Contract Details
- Contract address: `0xF42070EBFcB1B467D5FEd5A6d3e5957bf263BdE5`
- Network: Sepolia Testnet
- [Contract link](https://sepolia.etherscan.io/address/0xf42070ebfcb1b467d5fed5a6d3e5957bf263bde5)

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

# Storage Details Report

The following report describes the changes in storage that occurred during the execution of a transaction on the Ethereum address `0xF42070EBFcB1B467D5FEd5A6d3e5957bf263BdE5`.

## Ether Balances and Nonce

The Ether balance of the address did not change during the transaction. It remained at `0 Eth`. The nonce of the address also remained the same, at `1`, indicating that no new transactions were sent from this address.

## Nonce
In Ethereum, the nonce is a counter used to ensure each transaction is processed only once and in the correct order. It is also used to prevent replay attacks. When an account creates a transaction, the nonce of that account is incremented.

In the context of this contract creation:
- **Nonce Before Creation: '1'**
- **Nonce After Creation: '2'**
  
This indicates that the account `0x1c0427...1c5ebd2f` had previously sent one transaction (hence the initial nonce of 1). The creation of this contract was the second transaction sent from this account, which is why the nonce increased to 2.


## Storage Changes

Two storage slots were updated during the contract creation transaction:

1. **Storage Address 0x0000000000000000000000000000000000000000000000000000000000000000:** The initial value was empty. After the transaction, it was updated with the string "Hello World".

2. **Storage Address 0x0000000000000000000000000000000000000000000000000000000000000001:** The initial value was `0x0x0`. After the transaction, it was updated with the value `0x1c042700057891c76d2c95b66bb09c441c5ebd2f`, which represents an Ethereum address.


## Conclusion

The address of a new contract is determined by the creator's address and the nonce. Since the nonce of the `0x1c0427...1c5ebd2f` address was 1 before the contract creation, and the contract creation counts as a transaction, the nonce was incremented to 2 after the contract was created. The new contract's address (0xF42070...f263BdE5) is derived from the creator's address and the nonce.

The transaction resulted in the update of two storage slots. These changes represent the initialization of a smart contract, with the storage slots being used to store the contract's state. The Ethereum address `0x1c042700057891c76d2c95b66bb09c441c5ebd2f` is the owner of the contract, and the string "Hello World" is the initial state or message of the contract.



![State Change Contract Creation](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/Contract%20Creation%20State.png)


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
  - `[0]`: `0000000000000000000000000000000000000000000000000000000000000020`. This is an offset to the location of the data part of the first (and only) parameter. The input data is a string that is stored separatley and the argument in the function call is an offset that points to the location of this data. This way of handling complex data types is more efficient and allows the EVM to work with large amounts of data in a more manageable way.
  - `[1]`: `0000000000000000000000000000000000000000000000000000000000000016`. This is the length of the string parameter in bytes.
  - `[2]`: `48656c6c6f20456e636f6465202d2047726f7570203800000000000000000000`. This is the data part of the string parameter, encoded in hexadecimal. When decoded, it reads "Hello Encode - Group 8".

The transaction failed because the `setText(string newText)` function includes a `onlyOwner` modifier, and the transaction was not sent by the owner of the contract. Alternatively, the contract could have run out of gas if the provided gas limit was too low.


![Failed Transaction](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/HelloWorld%20-%20Failed%20Transaction.png)


<br/>


# Transaction Comparison Report

This report compares two transactions that were executed on the `HelloWorld` contract. Both transactions called the `transferOwnership(address newOwner)` function, which transfers the ownership of the contract to a new owner.

## Transaction 1: Transfer to Existing Owner's Address

In the first transaction, the ownership of the contract was transferred to the existing owner's address (`0x1c0427...1c5ebd2f`). 

### State Changes

- The Ether balance of the owner's address decreased slightly due to the gas cost of the transaction.
- The Ether balance of the miner (`0xFf58d7...8837E883`) increased by the same amount, representing the gas fee `0.000060890000267916` that was paid for the transaction.
- No changes were made to the contract's storage, as the owner remained the same.

  ![Transfer Ownership](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/Transfer%20Ownership%20no%20new%20Owner.png)

## Transaction 2: Transfer to New Address

In the second transaction, the ownership of the contract was transferred to a new address (`0x498af4a8a9902e667ee8ffb1d064119eb27f9652`).

### State Changes

- The Ether balance of the original owner's address (`0x1c0427...1c5ebd2f`) decreased slightly due to the gas cost of the transaction.
- The Ether balance of the miner (`0x000000...00000000`) increased by the same amount, representing the gas fee `0.00006792` that was paid for the transaction.
- The contract's storage was updated. The storage address `0x0000000000000000000000000000000000000000000000000000000000000001`, which stores the owner of the contract, was updated with the new owner's address.

![Transfer Ownership newOwner](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/Transfer%20Ownership%20New%20Owner.png)

## Conclusion

While both transactions involved the `transferOwnership(address newOwner)` function, they had different effects. The first transaction did not change the state of the contract, as the ownership was transferred to the existing owner's address. The second transaction, however, did change the state of the contract, as the ownership was transferred to a new address.



<br/>


# Transaction - Function setText 

This report describes a transaction that was executed on the Sepolia Testnet. The transaction sucessfully executed the `setText(string newText)` function of the HelloWorld.sol contract `0xF42070EBFcB1B467D5FEd5A6d3e5957bf263BdE5`.

## Ether Balances and Nonce

The Ether balance of the address `0x498AF4...B27F9652` decreased slightly from `0.49876087929371247 Eth` to `0.498716161292341118 Eth`. This change of `0.000044718001371352 Eth` represents the gas cost of the transaction. The nonce of the address increased from `3` to `4`, indicating that a new transaction was sent from this address.

The Ether balance of the miner (`0x6a7aA9...f12F06a3`) increased by the same amount, representing the gas fee that was paid for the transaction.

## Storage Changes

One storage slot was updated during the transaction:

- **Storage Address 0x0000000000000000000000000000000000000000000000000000000000000000:** The initial value was "Hello World". After the transaction, it was updated with the string "Bonjour!".

  ![Function setText](https://raw.githubusercontent.com/AskBlockchain/Encode-HelloWorld/main/week1/setText.png)

## Conclusion

The transaction resulted in the update of one storage slot. This change likely represents the execution of a function that updates the state of a smart contract. In this case, the function likely updates a text message stored in the contract. The decrease in the Ether balance of the address `0x498AF4...B27F9652` and the corresponding increase in the Ether balance of the miner `0x6a7aA9...f12F06a3` represent the gas cost of the transaction.















