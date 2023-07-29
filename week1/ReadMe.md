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

- `onlyOwner`: This modifier restricts the `setText` and `transferOwnership` functions to be called only by the owner of the contract.

## Deployment

The contract was submitted for verification at Etherscan.io on 2023-07-27.

## License

The contract is licensed under the GNU General Public License v3.0.

