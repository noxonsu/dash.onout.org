// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract NasiCoin is ERC20{
    address public addressContract;
    address public ownerContract;
    address public parther;
    address public ownerDash;
    uint8 public partPartner;
    uint256 public cashback = 50*10**18;
    event TransferSent(address _from, address _destAddr, uint _amount);

    constructor() ERC20("NasiCoin", "NASI") {
        _mint(address(this), 21000000 * 10 ** 18);
        addressContract = address(this);
        ownerContract = msg.sender;
        ownerDash = 0x1C1531b28C4497C0f688A968622599f224d7FBe7;
        parther = 0x1C1531b28C4497C0f688A968622599f224d7FBe7;
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
        token.transfer(to, cashback);
        emit TransferSent(addressContract, to, cashback);
        address payable _to = payable(ownerDash);
        address payable _partner = payable(parther);
        _partner.transfer((addressContract.balance * partPartner) / 100);
        _to.transfer(addressContract.balance); 
    }

}