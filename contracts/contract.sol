// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract DashOnout is ERC20 {
    address public addressContract;
    address public ownerContract;
    address public partherDashboard;
    address public partheSecond;
    address public ownerDashboard;
    uint8   public partPartnerDashboard;
    uint8   public partPartnerCrosschain;
    uint256 public cashback = 50*10**18;
    uint256 public bonusPromoCode = 50*10**18;
    uint256 public minAmount = 1*10**18;
    uint8   public productIdSecondParther = 1;

    struct referalInfo {
        address promoCodeAddress;
        uint256 promoCodeUserBalance;
        uint256 promoCodeUserReferals;
    }

    mapping(address => referalInfo) users;
    address[] public usersIds;

    constructor() ERC20("DashOnout", "DASH") {
        addressContract = address(this);
        ownerContract = msg.sender;
        ownerDashboard = 0x873351e707257C28eC6fAB1ADbc850480f6e0633;
        partherDashboard = 0x352E6b9AF51298c97bd298bBa4aE252C3C583052; //farm.onout.org bank
        partheSecond =  0x14D83667A8C55009905C4F16f5486ac2BdA4f0EE; //partner crosschain
        partPartnerDashboard = 10;
        partPartnerCrosschain = 10;
    }

    modifier onlyOwner() {
        require(ownerContract == msg.sender || ownerDashboard == msg.sender, "I'm sorry you're not the owner");
        _;
    }
    function editOwnerDashboard(address _newOwner) public onlyOwner {
        ownerDashboard = _newOwner;
    }
    function editPartnerDashboard(address _newPartner) public onlyOwner {
        partherDashboard = _newPartner;
    }
    function editPartnerCrosschain(address _newPartnerCrosschain) public onlyOwner {
        partheSecond = _newPartnerCrosschain;
    }
    function editCashback(uint256 _newCashbackAmount) public onlyOwner {
        cashback = _newCashbackAmount * 10 ** 18;
    }
    function editBonusPromoCode(uint256 _bonusPromoCode) public onlyOwner {
        bonusPromoCode = _bonusPromoCode * 10 ** 18;
    }
    function editMinAmount(uint256 _newMinAmount) public onlyOwner {
        minAmount = _newMinAmount * 10 ** 18;
    }
    function editPartPartnerDashboard(uint8 _partPartnerDash) public onlyOwner {
        partPartnerDashboard = _partPartnerDash;
    }
    function editPartPartnerCrosschain(uint8 _partPartnerCrosscain) public onlyOwner {
        partPartnerCrosschain = _partPartnerCrosscain;
    }
    function editProductIdSecondParther(uint8 _productIdSecondParther) public onlyOwner {
        productIdSecondParther = _productIdSecondParther;
    }

    function transferErc20(IERC20 bonusTokenAddress, address clientAddress,  uint productId) public payable {
        require(msg.value >= minAmount, "LESS_THAN_MIN_AMOUNT");
        address payable _ownerDashboard = payable(ownerDashboard);
        address payable _partner = payable(partherDashboard);
        address payable _partPartnerCrosschain = payable(partheSecond);

        if (productId == productIdSecondParther) {
            _partPartnerCrosschain.transfer((addressContract.balance * partPartnerCrosschain) / 100);
        } else {
            _partner.transfer((addressContract.balance * partPartnerDashboard) / 100);
        }
        _ownerDashboard.transfer(addressContract.balance); 

        if (bonusTokenAddress.balanceOf(addressContract) >= cashback) {
            bonusTokenAddress.transfer(clientAddress, cashback);
        }
    }

    function transferPromoErc20(IERC20 bonusTokenAddress, address clientAddress, address promoCode, uint productId) public payable {
        require(msg.value >= minAmount, "LESS_THAN_MIN_AMOUNT");
        address payable _ownerDashboard = payable(ownerDashboard);
        address payable _partner = payable(partherDashboard);
        address payable _partPartnerCrosschain = payable(partheSecond);

        if (productId == productIdSecondParther) {
            _partPartnerCrosschain.transfer((addressContract.balance * partPartnerCrosschain) / 100);
        } else {
            _partner.transfer((addressContract.balance * partPartnerDashboard) / 100);
        }
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
