// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract CashbackContract is ERC20{
    address public addressContract;
    address public ownerContract;
    address public parther;
    address public ownerDash;
    uint public oooo;
    uint8 public partPartner;
    uint256 public cashback = 50*10**18;
    event TransferSent(address _from, address _destAddr, uint _amount);

    constructor() ERC20("CashbackContract", "CASH") {
        _mint(address(this), 21000000 * 10 ** 18);
        addressContract = address(this);
        ownerContract = msg.sender;
        ownerDash = 0x3B85D38c3A7AEabABA8B7DEb7a73177688270abC;
        parther = 0x873351e707257C28eC6fAB1ADbc850480f6e0633;
        partPartner = 10;
    }

    function editOwnerDash(address _owner) public {
        require(ownerContract == msg.sender || ownerDash == msg.sender, "I'm sorry you're not the owner");
        ownerDash = _owner;
    }
    function editPartner(address _partner) public {
        require(ownerContract == msg.sender || ownerDash == msg.sender, "I'm sorry you're not the owner");
        parther = _partner;
    }
    function editCashback(uint256 _cashback) public {
        require(ownerContract == msg.sender || ownerDash == msg.sender, "I'm sorry you're not the owner");
        cashback = _cashback * 10 ** 18;
    }
    function editPartPartner(uint8 _partPartner) public {
        require(ownerContract == msg.sender || ownerDash == msg.sender, "I'm sorry you're not the owner");
        partPartner = _partPartner;
    }
    
    function transferErc20(IERC20 token, address to) public payable {
        if (token.balanceOf(address(this)) >= cashback) {
            token.transfer(to, cashback);
        }
        emit TransferSent(addressContract, to, cashback);
        address payable _to = payable(ownerDash);
        address payable _partner = payable(parther);
        _partner.transfer((addressContract.balance * partPartner) / 100);
        _to.transfer(addressContract.balance); 
    }
}