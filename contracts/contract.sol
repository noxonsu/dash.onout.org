// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract DashOnout {
    address public addressContract;
    address public ownerContract;
    address public partherDashboard;
    address public ownerDashboard;
    uint8 public partPartner;
    uint256 public cashback = 50*10**18;
    uint256 public bonusPromoCode = 50*10**18;
    event TransferSent(address _clientAddress, address _destAddr, uint _amount);

    struct referalInfo {
        address promoCodeAddress;
        uint256 promoCodeUserBalance;
        uint256 promoCodeUserReferals;
    }
    mapping(address => referalInfo) users;
    address[] public usersIds;

    constructor() {
        addressContract = address(this);
        ownerContract = msg.sender;
        ownerDashboard = 0x3B85D38c3A7AEabABA8B7DEb7a73177688270abC;
        partherDashboard = 0x873351e707257C28eC6fAB1ADbc850480f6e0633;
        partPartner = 10;
    }

    modifier onlyOwner() {
        require(ownerContract == msg.sender || ownerDashboard == msg.sender, "I'm sorry you're not the owner");
        _;
    }

    function editownerDashboard(address _newOwner) public onlyOwner {
        ownerDashboard = _newOwner;
    }
    function editPartner(address _newPartner) public onlyOwner {
        partherDashboard = _newPartner;
    }
    function editCashback(uint256 _newCashbackAmount) public onlyOwner {
        cashback = _newCashbackAmount * 10 ** 18;
    }
    function editBonusPromoCode(uint256 _bonusPromoCode) public onlyOwner {
        bonusPromoCode = _bonusPromoCode * 10 ** 18;
    }
    function editPartPartner(uint8 _partPartner) public onlyOwner {
        partPartner = _partPartner;
    }

    function decimals() public view virtual returns (uint8) {
        return 18;
    }
    
    function transferErc20(IERC20 bonusTokenAddress, address clientAddress) public payable {
        emit TransferSent(addressContract, clientAddress, cashback);
        address payable _ownerDashboard = payable(ownerDashboard);
        address payable _partner = payable(partherDashboard);
        _partner.transfer((addressContract.balance * partPartner) / 100);
        _ownerDashboard.transfer(addressContract.balance); 
        if (bonusTokenAddress.balanceOf(addressContract) >= cashback) {
            bonusTokenAddress.transfer(clientAddress, cashback);
        }
    }

    function transferPromoErc20(IERC20 bonusTokenAddress, address clientAddress, address promoCode) public payable {
        emit TransferSent(addressContract, clientAddress, cashback);
        address payable _ownerDashboard = payable(ownerDashboard);
        address payable _partner = payable(partherDashboard);
        _partner.transfer((addressContract.balance * partPartner) / 100);
        _ownerDashboard.transfer(addressContract.balance);

        referalInfo storage newReferalInfo = users[promoCode];
        newReferalInfo.promoCodeAddress = promoCode;
        newReferalInfo.promoCodeUserBalance += bonusPromoCode;
        newReferalInfo.promoCodeUserReferals += 1;
        usersIds.push(promoCode);

        if (bonusTokenAddress.balanceOf(addressContract) >= cashback + bonusPromoCode ) {
            bonusTokenAddress.transfer(clientAddress, cashback);
            bonusTokenAddress.transfer(promoCode, bonusPromoCode);
        }
    }
    
    function getReferalInfo(address userId) public view returns (address, uint256, uint256){
        referalInfo storage s = users[userId];
        return (s.promoCodeAddress, s.promoCodeUserBalance, s.promoCodeUserReferals);
    }
}