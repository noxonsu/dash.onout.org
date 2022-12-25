// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract DashOnout is ERC20 {
    // Declare contract address and owner
    address public contractAddress;
    address public contractOwner;
    // Declare dashboard owner and partners
    address public dashboardOwner;
    address public dashboardPartner;
    address public crosschainPartner;
    // Declare percentage of transaction value to be transferred to partners
    uint8 public percentageForDashboardPartner;
    uint8 public percentageForCrosschainPartner;
    // Declare cashback and bonus promo code amounts
    uint256 public cashbackAmount = 50 * 10 ** 18;
    uint256 public bonusPromoCodeAmount = 50 * 10 ** 18;
    // Declare minimum transaction amount
    uint256 public minTransactionAmount = 1 * 10 ** 18;
    // Declare product ID for crosschain partner
    uint8 public productIdForCrosschainPartner = 1;

    // Declare struct to store referral information
    struct ReferralInfo {
        address promoCodeAddress;
        uint256 promoCodeUserBalance;
        uint256 promoCodeUserReferrals;
    }

    // Declare mapping and array for users
    mapping(address => ReferralInfo) public users;
    address[] public userIds;

    // Constructor function
    constructor() ERC20("DashOnout", "DASH") {
        contractAddress = address(this);
        contractOwner = msg.sender;
        dashboardOwner = 0x873351e707257C28eC6fAB1ADbc850480f6e0633;
        dashboardPartner = 0x352E6b9AF51298c97bd298bBa4aE252C3C583052;
        crosschainPartner = 0x14D83667A8C55009905C4F16f5486ac2BdA4f0EE;
        percentageForDashboardPartner = 10;
        percentageForCrosschainPartner = 10;
    }

    // Modifier to restrict function execution to contract owner or dashboard owner
    modifier onlyOwner() {
        require(contractOwner == msg.sender || dashboardOwner == msg.sender, "I'm sorry you're not the owner");
        _;
    }

    // Functions to edit contract parameters
    function editDashboardOwner(address newOwner) public onlyOwner {
        dashboardOwner = newOwner;
    }
    function editDashboardPartner(address newPartner) public onlyOwner {
        dashboardPartner = newPartner;
    }
    function editCrosschainPartner(address newPartner) public onlyOwner {
        crosschainPartner = newPartner;
    }
    function editCashbackAmount(uint256 newAmount) public onlyOwner {
        cashbackAmount = newAmount * 10 ** 18;
    }
    function editBonusPromoCodeAmount(uint256 newAmount) public onlyOwner {
        bonusPromoCodeAmount = newAmount * 10 ** 18;
    }
    function editMinTransactionAmount(uint256 newAmount) public onlyOwner {
        minTransactionAmount = newAmount * 10 ** 18;
    }
    function editPercentageForDashboardPartner(uint8 newPercentage) public onlyOwner {
        percentageForDashboardPartner = newPercentage;
    }
    function editPercentageForCrosschainPartner(uint8 newPercentage) public onlyOwner {
        percentageForCrosschainPartner = newPercentage;
    }
    function editProductIdForCrosschainPartner(uint8 newProductId) public onlyOwner {
        productIdForCrosschainPartner = newProductId;
    }

    // Function to transfer tokens and provide cashback
    function transferErc20(IERC20 bonusTokenAddress, address clientAddress, uint productId) public payable {
        // Check if transaction value meets minimum amount requirement
        require(msg.value >= minTransactionAmount, "LESS_THAN_MIN_AMOUNT");
        // Declare payable versions of partner addresses
        address payable dashboardPartnerPayable = payable(dashboardPartner);
        address payable crosschainPartnerPayable = payable(crosschainPartner);
        // Transfer percentage of transaction value to appropriate partner
        if (productId == productIdForCrosschainPartner) {
            crosschainPartnerPayable.transfer((contractAddress.balance * percentageForCrosschainPartner) / 100);
        } else {
            dashboardPartnerPayable.transfer((contractAddress.balance * percentageForDashboardPartner) / 100);
        }
        // Transfer remaining balance to dashboard owner
        payable(dashboardOwner).transfer(contractAddress.balance); 
        // Check if contract has sufficient balance to provide cashback
        if (bonusTokenAddress.balanceOf(contractAddress) >= cashbackAmount) {
            // Transfer cashback to client
            bonusTokenAddress.transfer(clientAddress, cashbackAmount);
        }
    }

    // Function to transfer tokens using promo code and provide cashback and bonus
    function transferPromoErc20(IERC20 bonusTokenAddress, address clientAddress, address promoCode, uint productId) public payable {
        // Check if transaction value meets minimum amount requirement
        require(msg.value >= minTransactionAmount, "LESS_THAN_MIN_AMOUNT");
        // Check if promo code is valid
        require(users[promoCode].promoCodeAddress == promoCode, "INVALID_PROMO_CODE");
        // Declare payable versions of partner addresses
        address payable dashboardPartnerPayable = payable(dashboardPartner);
        address payable crosschainPartnerPayable = payable(crosschainPartner);
        // Transfer percentage of transaction value to appropriate partner
        if (productId == productIdForCrosschainPartner) {
            crosschainPartnerPayable.transfer((contractAddress.balance * percentageForCrosschainPartner) / 100);
        } else {
            dashboardPartnerPayable.transfer((contractAddress.balance * percentageForDashboardPartner) / 100);
        }
        // Transfer remaining balance to dashboard owner
        payable(dashboardOwner).transfer(contractAddress.balance); 
        // Check if contract has sufficient balance to provide cashback and bonus
        if (bonusTokenAddress.balanceOf(contractAddress) >= cashbackAmount + bonusPromoCodeAmount) {
            // Transfer cashback and bonus to client
            bonusTokenAddress.transfer(clientAddress, cashbackAmount + bonusPromoCodeAmount);
        }
        // Update referral information for promo code owner
        users[promoCode].promoCodeUserBalance += msg.value;
        users[promoCode].promoCodeUserReferrals += 1;
    }

    // Function to add a new promo code
    function addPromoCode(address promoCode, address owner) public onlyOwner {
        // Check if promo code has already been added
        require(users[promoCode].promoCodeAddress != promoCode, "PROMO_CODE_ALREADY_EXISTS");
        // Add new promo code to mapping
        users[promoCode] = ReferralInfo(promoCode, 0, 0);
        // Add promo code owner to user IDs array
        userIds.push(owner);
    }

    // Function to retrieve referral information for a promo code
    function getPromoCodeInfo(address promoCode) public view returns (address, uint256, uint256) {
        return (users[promoCode].promoCodeAddress, users[promoCode].promoCodeUserBalance, users[promoCode].promoCodeUserReferrals);
    }

    // Function to retrieve total number of promo codes
    function getTotalPromoCodes() public view returns (uint) {
        return userIds.length;
    }

    // Function to retrieve IDs of all users
    function getAllUsers() public view returns (address[]) {
        return userIds;
    }
}
