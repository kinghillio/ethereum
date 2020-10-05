pragma solidity ^0.6.0;

contract Helpers {
    modifier ownerOf(address _address) {
        require(msg.sender == _address);
        _;
    }
}
