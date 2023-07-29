/**
 *Submitted for verification at Etherscan.io on 2023-07-27
*/

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;
    address public owner;
    address[] public Owners;

    constructor() {
        text = "Hello World";
        owner = msg.sender;
        Owners.push(msg.sender);
    }

    function addOwner(address _newOwner) public {
        Owners.push(_newOwner);
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
        bool isOwner = false;
        for(uint i = 0; i < Owners.length; i++) {
            if (Owners[i] == msg.sender) {
                isOwner = true;  
                break;            
            }                                
        } 
        require (isOwner, "Caller is not the owner");                     
        _;
    }
}
