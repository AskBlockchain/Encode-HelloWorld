// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";

/**
@title MyAuction.sol
@author Bhasker
@notice You can use this contract for running an auction

The logic of this contract is that fist the contract is deployed and then it can be reused many times.  The current time can be
found out at any time by calling the currentTime function to set the current time variable, and then caliing the variable. For an auction to occur
 the owner of the contract must:
 1) A user creates an auction (setting the timestamp and starting amount to bid)
 2) Another user can bid, if the auction is live, in the given time. And if his bid amount is more the starting amount and maxBid so far then will proceed otherwise revert.
 3) If the bid transaction succeeds, maxBid is updated. 
 4) When the time is up for the auction and some amount is earned, owner of the auction closes it, updating the ownership to the higest bidder.
 5) Auction owner gets the money after subtracting a fee which is set by the contract owner.
 6) Contract Owner can call "ownerFundsWithdraw" function to recieve the fees.

*/
contract MyAuction is Ownable {

    event AuctionStarted();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed owner, uint amount);
    event AuctionEnded(address highestBidder, uint amount);

    uint256 private fee = 2 ether;

    mapping(uint256 => address) public auctionOwners; //a separate mapping for ownership of each auction.

    struct Auction {
        address owner; //Current owner of the auction item
        string title;
        string image;
        uint256 timestamp;
        uint256 startingPrice;
        uint256 maxBid;
        address[] bidders;
        uint256[] bids;
        bool openForAuction;
    }

    Auction[] public auctions;

    function createAuction(string calldata _title, string calldata _image, uint256 _startingPrice, uint256 _timestamp) public {
        uint256 endTimestamp = block.timestamp + (_timestamp * 1 minutes);
        Auction memory auction = Auction({
            owner: msg.sender,  // Initially, the creator is the owner
            title: _title,
            image: _image,
            timestamp: endTimestamp,  
            startingPrice: _startingPrice * 1 ether,
            maxBid: 0 * 1 ether,
            bidders: new address[](0),
            bids: new uint256[](0),
            openForAuction: true
        });

        auctions.push(auction);
        auctionOwners[auctions.length - 1] = msg.sender; // Record the initial owner

        emit AuctionStarted();
    }

    function closeAuction(uint256 auctionId) public {
        Auction storage auction = auctions[auctionId];
        require(msg.sender == auction.owner, "Not The Owner!");
        require(auction.openForAuction, "Auction Closed!");
        require(block.timestamp >= auction.timestamp, "There is still some time left!");

        auction.openForAuction = false;
        uint256 amount = auction.maxBid - getFees();  // Subtract the fee

        uint256 lastBidderIndex = auction.bidders.length - 1;
        address newOwner = auction.bidders[lastBidderIndex];
        auctionOwners[auctionId] = newOwner; // Update the ownership


        for (uint256 i = 0; i < lastBidderIndex; i++) {
            address tempBidder = auction.bidders[i];
            uint256 tempBid = auction.bids[i];

            (bool ok, ) = tempBidder.call{value: tempBid}("");
            require(ok, "Transaction Failed");
        }

        auction.bidders = new address[](0); // Clear the bidders array after processing
        auction.bids = new uint256[](0);     // Clear the bids array after processing

        // removeAuction(auctionId);

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transaction Failed");

        emit AuctionEnded(newOwner, auction.maxBid);
    }


    function bid(uint256 auctionId) public payable {
        Auction storage auction = auctions[auctionId];
        require(auction.openForAuction, "Auction Closed!");
        require(auction.timestamp > block.timestamp, "Time's Up");
        require(msg.value > auction.startingPrice && msg.value > auction.maxBid, "You didn't send enough!");

        auction.maxBid = msg.value;
        auction.bids.push(msg.value);
        auction.bidders.push(msg.sender);

        emit Bid(msg.sender, msg.value);
    }


    function setFees(uint256 _fee) public {
        fee = _fee;
    }

    function getFees() public view returns (uint256) {
        return fee;
    }
    
    
    // Function to retrieve the owner of a specific auction.
    function getAuctionOwner(uint256 auctionId) public view returns (address) {
        return auctionOwners[auctionId];
    }


    function ownerFundsWithdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transaction Failed");

        emit Withdraw(msg.sender, address(this).balance);
    }
}
