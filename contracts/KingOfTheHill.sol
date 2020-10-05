pragma solidity ^0.6.0;

import "./Ownable.sol";
import "./Helpers.sol";

contract KingOfTheHill is Ownable, Helpers {

    event NewKing(address king, uint fee, uint sinceOf);

    address payable serviceAddress = 0x42d6bC6f05F8429e585314DfD8f0BA4a7dc230DD;
    address payable king = serviceAddress;
    uint sinceOf = now;
    uint startFee = 0.001 ether;
    uint fee = startFee;
    uint ownerFee = 5;
    uint coef = 30;
    uint timeLimit = 1 days;

    function getKing() view external returns (address, uint, uint) {
        return (king, fee, sinceOf);
    }

    function newKing() external payable {
        if (_timeIsOver()) {
            _restart();
        }
        require(msg.value >= fee);

        uint _ownerFee = msg.value * ownerFee / 100;
        uint reward = msg.value - _ownerFee;
        king.transfer(reward);

        king = msg.sender;
        sinceOf = now;

        uint newFee = msg.value + msg.value * coef / 100; // fee + fee * coef / 100;
        _setFee(newFee);

        emit NewKing(king, fee, sinceOf);
    }

    function _restart() private {
        king = serviceAddress;
        _setFee(startFee);
        sinceOf = now;
    }

    function _timeIsOver() view private returns (bool) {
        return (sinceOf + timeLimit) <= now;
    }

    function _setFee(uint _fee) private {
        fee = _fee;
    }

    function setCoef(uint _coef) external onlyOwner {
        require(_coef > 0 && _coef <= 100);
        coef = _coef;
    }

    function setOwnerFee(uint _fee) external onlyOwner {
        ownerFee = _fee;
    }

    function withdraw(uint amount) external onlyOwner returns(bool) {
        require(amount <= address(this).balance);
        serviceAddress.transfer(amount);
        return true;
    }

}
