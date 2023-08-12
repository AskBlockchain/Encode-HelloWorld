// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @title IMyToken
 * @notice Interface to interact with the MyToken contract.
 */
interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

/**
 * @title Tokenized Ballot
 * @notice A contract for tokenized voting using past token balances.
 */
contract TokenizedBallot {
    
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    Proposal[] public proposals;
    IMyToken public tokenContract;
    uint256 public targetBlockNumber;

    // Keeps track of how many votes an address has spent
    mapping(address => uint256) public votingPowerSpent;

    /**
     * @notice Constructor to initialize the TokenizedBallot.
     * @param proposalNames Names of the proposals to be voted on.
     * @param _tokenContract Address of the token contract.
     * @param _targetBlockNumber Block number at which to check token balances.
     */
    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    /**
     * @notice Allows a user to vote for a proposal.
     * @param proposal ia the proposal to vote for.
     * @param amount Amount of tokens to vote with.
     * @dev function works by allowing one to vote based on the voting power
     */
    function vote(uint proposal, uint256 amount) external {

        //require the voting power higher than the amount
        require(votingPower(msg.sender) >= amount, "TokenizedBallot: trying to vote more than allowed");

        //update proposal vote count
        votingPowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    /**
     * @notice Checks the voting power of an account at the target block number.
     * @param account Address of the account.
     * @return The voting power of the account.
     */
    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getPastVotes(account, targetBlockNumber);
    }

    /**
     * @notice Finds the proposal with the most votes.
     */
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }
}