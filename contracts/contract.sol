// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract DashOnout is ERC20 {
    address public contractAddress;
    address public contractOwner;
    address public dashboardPartner;
    address public crosschainPartner;
    address public ownerDashboard;
    uint8   public dashboardPartnerPercentage;
    uint8   public crosschainPartnerPercentage;
    uint256 public cashbackAmount = 50*10**18;
    uint256 public promoCodeBonus = 50*10**18;
    uint256 public minPurchaseAmount = 1*10**18;
    uint8   public crosschainProductId = 1;

    struct referralInfo {
        address promoCodeAddress;
        uint256 promoCodeUserBalance;
        uint256 promoCodeUserReferals;
    }

    mapping(address => referralInfo) referralMapping;
    address[] public userAddresses;

    constructor() ERC20("DashOnout", "DASH") {
        contractAddress = address(this);
        contractOwner = msg.sender;
        ownerDashboard = 0x873351e707257C28eC6fAB1ADbc850480f6e0633;
        dashboardPartner = 0x352E6b9AF51298c97bd298bBa4aE252C3C583052;
        crosschainPartner =  0x14D83667A8C55009905C4F16f5486ac2BdA4f0EE;
        dashboardPartnerPercentage = 10;
        crosschainPartnerPercentage = 10;
    }

    modifier onlyOwner() {
        require(contractOwner == msg.sender || ownerDashboard == msg.sender, "I'm sorry you're not the owner");
        _;
    }
    function editOwnerDashboard(address _newOwner) public onlyOwner {
        ownerDashboard = _newOwner;
    }
    function editDashboardPartner(address _newPartner) public onlyOwner {
        dashboardPartner = _newPartner;
    }
    function editCrosschainPartner(address _newPartnerCrosschain) public onlyOwner {
        crosschainPartner = _newPartnerCrosschain;
    }
    function editCashbackAmount(uint256 _newCashbackAmount) public onlyOwner {
        cashbackAmount = _newCashbackAmount * 10 ** 18;
    }
    function editPromoCodeBonus(uint256 _bonusPromoCode) public onlyOwner {
        promoCodeBonus = _bonusPromoCode * 10 ** 18;
    }
    function editMinPurchaseAmount(uint256 _newMinAmount) public onlyOwner {
        minPurchaseAmount = _newMinAmount * 10 ** 18;
    }
    function editDashboardPartnerPercentage(uint8 _partPartnerDash) public onlyOwner {
        dashboardPartnerPercentage = _partPartnerDash;
    }
    function editCrosschainPartnerPercentage(uint8 _partPartnerCrosscain) public onlyOwner {
        crosschainPartnerPercentage = _partPartnerCrosscain;
    }
    function editCrosschainProductId(uint8 _productIdSecondParther) public onlyOwner {
        crosschainProductId = _productIdSecondParther;
    }

    function processPurchase(IERC20 bonusTokenAddress, address clientAddress,  uint productId) public payable {
        require(msg.value >= minPurchaseAmount, "LESS_THAN_MIN_AMOUNT");
        address payable _ownerDashboard = payable(ownerDashboard);
        address payable _partner = payable(dashboardPartner);
        address payable _partPartnerCrosschain = payable(crosschainPartner);

        if (productId == crosschainProductId) {
            _partPartnerCrosschain.transfer((contractAddress.balance * crosschainPartnerPercentage) / 100);
        } else {
            _partner.transfer((contractAddress.balance * dashboardPartnerPercentage) / 100);
        }
        _ownerDashboard.transfer(contractAddress.balance); 

        if (bonusTokenAddress.balanceOf(contractAddress) >= cashbackAmount) {
            bonusTokenAddress.transfer(clientAddress, cashbackAmount);
        }
    }

    function processPromoPurchase(
        IERC20 bonusTokenAddress, address clientAddress, address promoCode, uint productId) public payable {
        require(msg.value >= minPurchaseAmount, "LESS_THAN_MIN_AMOUNT");
        referralInfo storage refInfo = referralMapping[promoCode];
        require(refInfo.promoCodeAddress == promoCode, "WRONG_PROMO_CODE");

        processPurchase(bonusTokenAddress, clientAddress, productId);

        refInfo.promoCodeUserBalance += msg.value;
        refInfo.promoCodeUserReferals += 1;
        if (bonusTokenAddress.balanceOf(contractAddress) >= promoCodeBonus) {
            bonusTokenAddress.transfer(clientAddress, promoCodeBonus);
        }
    }

    function registerPromoCode(address promoCode, address userAddress) public {
        require(contractOwner == msg.sender || ownerDashboard == msg.sender, "I'm sorry you're not the owner");
        referralInfo storage refInfo = referralMapping[promoCode];
        refInfo.promoCodeAddress = promoCode;
        refInfo.promoCodeUserBalance = 0;
        refInfo.promoCodeUserReferalsa = 0;
        userAddresses.push(userAddress);
    }

    function getPromoCode(address promoCode) public view returns (address, uint256, uint256) {
        referralInfo storage refInfo = referralMapping[promoCode];
        return (refInfo.promoCodeAddress, refInfo.promoCodeUserBalance, refInfo.promoCodeUserReferals);
    }
}
