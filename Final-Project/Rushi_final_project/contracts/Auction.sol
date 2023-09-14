// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


/**
* @title Auction.sol
* @notice This contract is used to create an auction
* @dev 
*    - Set the necessary conditions for the auction
*    - Start the auction
*    - Stop the auction
*    - Bid on the auction
*    - Withdraw funds from the auction
*    - Transfer ownership of the auction
*    - Get the winner of the auction
* @dev
*    Changes made to the Brandon contract
*    ERC721 Importation and Usage:
*
*    The ERC721 interface was imported.
*    The private string 'auctionItem' was replaced with 'IERC721 private auctionItem' and 'uint256 private auctionTokenId' to reference a specific ERC721 token instead of a simple string.
*    setAuctionItem Method:
*
*    The 'setAuctionItem' function now takes an IERC721 contract and a tokenId instead of a simple string.
*    Auction Start and Stop:
*
*    In 'startAuction', the requirement 'bytes(auctionItem).length > 0' was replaced with 'require(address(auctionItem) != address(0))' to check if an item has been set.
*    In 'stopAuction', the line 'auctionItem.transferFrom(address(this), winner, auctionTokenId)' was added to transfer the ERC721 token to the winner when the auction ends.
*    bid Function:
*
*    The refund logic was modified to handle scenarios where a bidder might place multiple bids. Instead of directly overwriting a bidder's bid value, it now accumulates.
*    A 'previousBidder' variable was introduced to keep track of the previous bidder and ensure they are refunded correctly.
*/
contract Auction is IERC721Receiver{
    // STATE VARIABLES
    address private owner;
    address private highestBidder;
    address private winner;
    address private MANAGAER;

    uint256 public deployedTime;
    uint256 public currentTime;
    uint256 public startTime;
    uint256 public stopTime;
    uint256 private currentBid;
    uint256 private auctionTokenId;
    uint256 public funds;
    uint256 public auctionId;

    IERC721 private auctionItem;
    

    enum status {
        LISTED, STARTED, ENDED
    }
    status public auctionStatus;

    // mapping of address to the bids they make 
    mapping(address => uint256) public bids;

    // MODIFIERS
    modifier onlyOwner(){
        require(msg.sender == owner || msg.sender == MANAGAER, "not the owner");
        _;
    }

    // EVENTS
    event AuctionStarted(uint256 officialStart);
    event AuctionEnded(uint officialStop);
    event BidPlaced(uint256 currentBid);
    event Winner(address winner);
    event Withdraw(address account, uint256 amount);

    // CONSTRUCTOR
    constructor(address _owner, uint256 _startTime, uint256 _endTime, address _auctionItem, uint256 _tokenId, uint256 _auctionId) {
        owner = _owner;
        deployedTime = block.timestamp;
        auctionStatus = status.LISTED;
        startTime = _startTime;
        stopTime = _endTime;
        auctionItem = IERC721(_auctionItem);
        auctionTokenId = _tokenId;
        MANAGAER = msg.sender;
        auctionId = _auctionId;
    }

    function reviseStartAuctionTime(uint256 _startTime) public onlyOwner {
        require(_startTime >= block.timestamp);
        startTime = _startTime;
    }

    function reviseStopAuctionTime(uint256 _stopTime) public onlyOwner {
        require(_stopTime >= block.timestamp && _stopTime > startTime);
        stopTime = _stopTime;
    }

    function startAuction() public onlyOwner {
        require(auctionItem.ownerOf(auctionTokenId) == address(this), "Auction contract does not own the NFT");
        require(address(auctionItem) != address(0), "Auction item not set");
        require(startTime <= block.timestamp, "Start time is not after the current time");
        auctionStatus = status.STARTED;
        emit AuctionStarted(block.timestamp);
    }

    function stopAuction() public onlyOwner {
        require(block.timestamp >= stopTime, "Auction is still live");

        winner = highestBidder;
        funds = address(this).balance;
        auctionStatus = status.ENDED;

        auctionItem.transferFrom(address(this), winner, auctionTokenId);
        emit Winner(winner);
        emit AuctionEnded(block.timestamp);
    }

    function getStatus() public view returns(uint256){
        if(auctionStatus == status.LISTED){
            return 0;
        }

        return auctionStatus == status.STARTED ? 1 : 2;
    }

    function getAuctionItem() public view returns(address) {
        return address(auctionItem);
    }
    
    function getStartTime() public view returns(uint256) {
        return startTime;
    }

    function getStopTime() public view returns(uint256) {
        return stopTime;
    }
    
    function bid() public payable {
        require(auctionStatus == status.STARTED, "Auction is not live");
        require(msg.value > currentBid, "Bid not high enough");

        address previousBidder = highestBidder;
        uint256 previousBid = currentBid;
        currentBid = msg.value;
        highestBidder = tx.origin;

        bids[msg.sender] += msg.value;

        if (previousBidder != address(0)) {
            payable(previousBidder).transfer(previousBid);  
        }

        emit BidPlaced(currentBid);
    }

    function getCurrentBid() public view returns(uint256) {
        return currentBid;
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        require(auctionStatus == status.ENDED, "Wait until the auction has ended before withdrawing");

        payable(owner).transfer(address(this).balance);
        emit Withdraw(msg.sender, address(this).balance);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function getWinner() public view onlyOwner returns(address, uint256) {
        require(auctionStatus == status.ENDED, "Auction is still live");
        require(winner != address(0), "Winner is NOT set");
        return (highestBidder, bids[highestBidder]);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public override returns (bytes4) {
        return this.onERC721Received.selector;
    }

}
