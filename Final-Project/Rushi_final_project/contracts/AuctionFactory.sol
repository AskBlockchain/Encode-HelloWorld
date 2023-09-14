// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import '@chainlink/contracts/src/v0.8/AutomationCompatible.sol';
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import './Auction.sol';

contract AuctionFactory is AutomationCompatible{

    using Counters for Counters.Counter;
    Counters.Counter public auctionId;

    mapping (address => address[]) public auctionsByUser;
    mapping (uint256 => address) public auctionById;
    address[] public auctions;

    constructor(){
        auctionId.increment();
    }

    function transferOwnership(uint256 _auctionId, address newOwner) public {
        require(auctionById[_auctionId] != address(0), "Non existent Auction ID");
        Auction auctionContract = Auction(auctionById[_auctionId]);
        auctionContract.transferOwnership(newOwner);
    }

    function getAuctionItem(uint256 _auctionId) public view returns(address) {
        require(auctionById[_auctionId] != address(0), "Non existent Auction ID");
        Auction auctionContract = Auction(auctionById[_auctionId]);
        return auctionContract.getAuctionItem();
    }

    function setNewAuctionStartTime(uint256 _auctionId, uint256 _newStartTime) public{
        require(auctionById[_auctionId] != address(0), "Non existent Auction ID");
        Auction auctionContract = Auction(auctionById[_auctionId]);
        auctionContract.reviseStartAuctionTime(_newStartTime);
    }

    function setNewAuctionEndTime(uint256 _auctionId, uint256 _newEndTime) public{
        require(auctionById[_auctionId] != address(0), "Non existent Auction ID");
        Auction auctionContract = Auction(auctionById[_auctionId]);
        auctionContract.reviseStopAuctionTime(_newEndTime);
    }

    function bidInSpecificAuction(uint256 _auctionId) public payable{
        Auction auctionContract = Auction(auctionById[_auctionId]);
        require(auctionContract.getCurrentBid() < msg.value, "Higher bid is expected");
        auctionContract.bid{value : msg.value}();
    }

    function listAuction(uint256 _startTime, uint256 _endTime, address _auctionItem, uint256 _tokenId) public returns(uint256){
        Auction auction = new Auction( msg.sender, _startTime, _endTime, _auctionItem, _tokenId, auctionId.current());
        auctionsByUser[msg.sender].push(address(auction));
        uint256 id = auctionId.current();
        auctions.push(address(auction));
        auctionById[id] = address(auction);
        auctionId.increment();
        IERC721(_auctionItem).transferFrom(msg.sender, address(this), _tokenId);
        return id;
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = false;
        address[] memory neededFor = new address[](auctions.length);
        uint256 index = 0;
        for(uint256 i = 0; i < auctions.length; i++){
            if(Auction(auctions[i]).getStartTime() < block.timestamp || Auction(auctions[i]).getStopTime() < block.timestamp){
                neededFor[index] = auctions[i];
                index++;
                upkeepNeeded = true;
            }
        }
        performData = abi.encode(neededFor);
        return (upkeepNeeded, performData);
    }

    function performUpkeep(bytes calldata performData) external override {
        (address[] memory neededFor) = abi.decode(performData, (address[]));

        for(uint256 i = 0; i < neededFor.length; i++){
            if(Auction(auctions[i]).getStartTime() < block.timestamp && Auction(auctions[i]).getStatus() == 0){
                Auction(auctions[i]).startAuction();
            }else if(Auction(auctions[i]).getStopTime() < block.timestamp && Auction(auctions[i]).getStatus() == 1){
                Auction(auctions[i]).stopAuction();
                Auction(auctions[i]).withdraw();
                for (uint256 j = 0; j < auctions.length; j++) {
                    if (auctions[j] == neededFor[i]) {
                        auctions[j] = auctions[auctions.length-1];
                        auctions.pop();
                        break;
                    }
                }
            }  
        }
    }

}