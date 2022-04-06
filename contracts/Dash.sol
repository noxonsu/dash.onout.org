// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./libraries/SafeMath.sol";
import "./interfaces/IERC20.sol";

contract Dash {
    using SafeMath for uint;

    struct ProductItem {
        string productId;
        uint price;
    }

    AggregatorV3Interface internal priceAggregator;
    bool blocked;
    address aggregatorAddress;
    address paymentDestination;
    address rewardToken;
    uint rewardAmount;
    mapping(string => uint) private productPrices;
    mapping(address => address) private owners;
    mapping(address => string) private data;

    modifier onlyOwners() {
        require(owners[msg.sender] == msg.sender, "FORBIDDEN");
        _;
    }

    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    modifier notEmpty(string memory _value) {
        bytes memory byteValue = bytes(_value);
        require(byteValue.length != 0, "NO_VALUE");
        _;
    }

    event Payment(address from, string productId, uint paymentAmount, uint nativeCoinPrice);

    constructor(
        address _owner,
        address _paymentDest,
        address _rewardToken,
        uint _rewardAmount,
        address _aggregatorAddress
    ) {
        aggregatorAddress = _aggregatorAddress;
        priceAggregator = AggregatorV3Interface(_aggregatorAddress);
        owners[_owner] = _owner;
        paymentDestination = _paymentDest;
        rewardToken = _rewardToken;
        rewardAmount = _rewardAmount;
    }

    function getLatestPrice() public view returns (uint) {
        (,int price,,,) = priceAggregator.latestRoundData();
        if (price >= 0) {
            return uint(price);
        }
        return 0;
    }

    function getData(address _target) public view returns(string memory) {
        return data[_target];
    }

    function payment(
        string memory _productId,
        string memory _data,
        address _rewardReceiver
    ) external payable lock notEmpty(_productId) {
        if (blocked) revert('BLOCKED');
        require(aggregatorAddress != address(0), "NO_AGGREGATOR_ADDR");
        uint nativeCoinPrice = getLatestPrice();
        uint productPrice = productPrices[_productId];
        require(nativeCoinPrice > 0 && productPrice >= 0, "WRONG_PRICE");
        while(productPrice < nativeCoinPrice) {
            productPrice = productPrice.mul(10);
        }
        uint weiDecimals = 10 ** 18;
        uint amount = productPrice.mul(weiDecimals) / nativeCoinPrice;
        uint acceptableInaccuracy = amount / 100; // 1%
        require(msg.value > (amount - acceptableInaccuracy) && msg.value < (amount + acceptableInaccuracy), "WRONG_VALUE");
        (bool success,) = paymentDestination.call{ value: msg.value }("");
        require(success, "FAILED_PAYMENT");
        _setData(msg.sender, _data);
        emit Payment(msg.sender, _productId, msg.value, nativeCoinPrice);
        if (IERC20(rewardToken).balanceOf(address(this)) >= rewardAmount) {
            sendReward(_rewardReceiver);
        }
    }

    function setBlocked(bool _blocked) public onlyOwners {
        blocked = _blocked;
    }

    function addOwner(address _owner) public onlyOwners {
        owners[_owner] = _owner;
    }

    function removeOwner(address _owner) public onlyOwners {
        delete owners[_owner];
    }

    function setAggregatorAddress(address _aggregatorAddress) public onlyOwners {
        aggregatorAddress = _aggregatorAddress;
        priceAggregator = AggregatorV3Interface(_aggregatorAddress);
    }

    function setPaymentDestination(address _moneyDest) public onlyOwners {
        paymentDestination = _moneyDest;
    }

    function setProductPrice(string memory _productId, uint _price) public onlyOwners {
        productPrices[_productId] = _price;
    }

    function setProductsPrices(ProductItem[] memory _productItems) public onlyOwners {
        require(_productItems.length > 0, "NO_ITEMS");
        for(uint x; x < _productItems.length; x++) {
            productPrices[_productItems[x].productId] = _productItems[x].price;
        }
    }

    function setData(address _target, string memory _data) public onlyOwners {
        _setData(_target, _data);
    }

    function setRewardAmount(uint _amount) public onlyOwners {
        rewardAmount = _amount;
    }

    function setRewardToken(address _token) public onlyOwners {
        rewardToken = _token;
    }

    function sendReward(address _to) private {
        require(IERC20(rewardToken).balanceOf(address(this)) >= rewardAmount, "INSUFFICIENT_FUNDS");
        bool success = IERC20(rewardToken).transferFrom(address(this), _to, rewardAmount);
        require(success, "FAILED_REWARD");
    }

    function _setData(address _target, string memory _data) private {
        data[_target] = _data;
    }
}