// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract DashOnout is ERC20 {
    address public contractAddress;
    address public contractOwner;
    address public partnerDashboard;
    address public partnerCrosschain;
    address public dashboardOwner;
    uint8   public partnerPercentageDashboard;
    uint8   public partnerPercentageCrosschain;
    uint256 public cashbackAmount = 50*10**18;
    uint256 public promoCodeBonus = 50*10**18;
    uint256 public minimumAmount = 1*10**18;
    uint8   public productIdForSecondPartner = 1;

    struct referralInfo {
        address promoCode;
        uint256 balance;
        uint256 referrals;
    }

    mapping(address => referralInfo) users;
    address[] public userIds;

    constructor() ERC20("DashOnout", "DASH") {
        contractAddress = address(this);
        contractOwner = msg.sender;
        dashboardOwner = 0x873351e707257C28eC6fAB1ADbc850480f6e0633;
        partnerDashboard = 0x352E6b9AF51298c97bd298bBa4aE252C3C583052; //farm.onout.org bank
        partnerCrosschain =  0x14D83667A8C55009905C4F16f5486ac2BdA4f0EE; //partner crosschain
        partnerPercentageDashboard = 10;
        partnerPercentageCrosschain = 10;
    }

    modifier onlyOwner() {
        require(contractOwner == msg.sender || dashboardOwner == msg.sender, "I'm sorry you're not the owner");
        _;
    }
    function editDashboardOwner(address newOwner) public onlyOwner {
        dashboardOwner = newOwner;
    }
    function editPartnerDashboard(address newPartner) public onlyOwner {
        partnerDashboard = newPartner;
    }
    function editPartnerCrosschain(address newPartnerCrosschain) public onlyOwner {
        partnerCrosschain = newPartnerCrosschain;
    }
    function editCashbackAmount(uint256 newCashbackAmount) public onlyOwner {
        cashbackAmount = newCashbackAmount * 10 ** 18;
    }
    function editPromoCodeBonus(uint256 bonusAmount) public onlyOwner {
        promoCodeBonus = bonusAmount * 10 ** 18;
    }
    function editMinimumAmount(uint256 newMinimumAmount) public onlyOwner {
        minimumAmount = newMinimumAmount * 10 ** 18;
    }
    function editPartnerPercentageDashboard(uint8 percentageForPartnerDashboard) public onlyOwner {
        partnerPercentageDashboard = percentageForPartnerDashboard;
    }
    function editPartnerPercentageCrosschain(uint8 percentageForPartnerCrosschain) public onlyOwner {
        partnerPercentageCrosschain = percentageForPartnerCrosschain;
    }
    function editProductIdForSecondPartner(uint8 newProductId) public onlyOwner {
        productIdForSecondPartner = newProductId;
    }

    function transferErc20(IERC20 bonusToken, address client,  uint productId) public payable {
        require(msg.value >= minimumAmount, "LESSTHAN_MIN_AMOUNT");
        address payable ownerDashboard = payable(dashboardOwner);
        address payable partner = payable(partnerDashboard);
        address payable partnerCrosschain = payable(partnerCrosschain);

        if (productId == productIdForSecondPartner) {
            partnerCrosschain.transfer((contractAddress.balance * partnerPercentageCrosschain) / 100);
        } else {
            partner.transfer((contractAddress.balance * partnerPercentageDashboard) / 100);
        }
        ownerDashboard.transfer(contractAddress.balance); 

        if (bonusToken.balanceOf(contractAddress) >= cashbackAmount) {
            bonusToken.transfer(client, cashbackAmount);
        }
    }

    function transferPromoErc20(IERC20 bonusToken, address client, address promoCode, uint productId) public payable {
        require(msg.value >= minimumAmount, "LESS_THAN_MIN_AMOUNT");
        address payable ownerDashboard = payable(dashboardOwner);
        address payable partner = payable(partnerDashboard);
        address payable partnerCrosschain = payable(partnerCrosschain);

        if (users[promoCode].promoCodeAddress == address(0)) {
            users[promoCode].promoCodeAddress = promoCode;
            users[promoCode].promoCodeUserBalance = msg.value;
            users[promoCode].promoCodeUserReferals = 0;
            userIds.push(promoCode);
        } else {
            users[promoCode].promoCodeUserBalance += msg.value;
        }
        users[client].promoCodeUserReferals += 1;

        if (productId == productIdForSecondPartner) {
            partnerCrosschain.transfer((contractAddress.balance * partnerPercentageCrosschain) / 100);
        } else {
            partner.transfer((contractAddress.balance * partnerPercentageDashboard) / 100);
        }
        ownerDashboard.transfer(contractAddress.balance); 

        if (bonusToken.balanceOf(contractAddress) >= cashbackAmount + promoCodeBonus) {
            bonusToken.transfer(client, cashbackAmount + promoCodeBonus);
        }
    }

    function checkPromoCodeBalance(address promoCode) public view returns (uint256) {
        return users[promoCode].promoCodeUserBalance;
    }

    function checkPromoCodeReferals(address promoCode) public view returns (uint256) {
        return users[promoCode].promoCodeUserReferals;
    }
}
