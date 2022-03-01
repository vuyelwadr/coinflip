// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract coinFlip  {

    address payable public owner;
    event Received(address, uint);
    uint private randNonce = 4;

    constructor() public {
        //initialized when the contract is deployed
        owner = payable(msg.sender);
    }

    function Receive() external payable{
        emit Received(msg.sender, msg.value); 
    }


    function random() view public returns (uint) {
        // increments nonce when random called to make guessing more difficult
        // for more security can use an oracle like chainlink vfr
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % 2;
    }

    function getUserBalance() view public returns(uint256) {  
        return msg.sender.balance;
    }

    function getContractBalance() view public returns(uint256){
        return address(this).balance;
    }
    
    function flip(uint choice) public payable returns(string memory){
        // 1 = heads 0 = tail
        if ( msg.sender == owner) revert();
        // return double the amount
        uint amount = msg.value * 3; 
        // amount = amount + amount; 
        randNonce++; 
        if (choice == random()){
            payable(msg.sender).transfer(amount);
            return "Correct";
        }
        else {
            return "Wrong";
        }
    }  
}
