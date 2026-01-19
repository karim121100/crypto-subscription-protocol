// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SubscriptionManager is Ownable {
    uint256 public nextPlanId;
    
    struct Plan {
        address merchant;
        address token;
        uint256 amount;
        uint256 frequency; // in seconds
    }

    struct Subscription {
        address subscriber;
        uint256 start;
        uint256 nextPayment;
    }

    mapping(uint256 => Plan) public plans;
    mapping(address => mapping(uint256 => Subscription)) public subscriptions;

    event PlanCreated(uint256 planId, address merchant, uint256 amount, uint256 frequency);
    event Subscribed(address indexed subscriber, uint256 planId, uint256 date);
    event PaymentProcessed(address indexed subscriber, uint256 planId, uint256 amount, uint256 date);
    event SubscriptionCancelled(address indexed subscriber, uint256 planId, uint256 date);

    constructor() Ownable(msg.sender) {}

    function createPlan(address _token, uint256 _amount, uint256 _frequency) external {
        require(_token != address(0), "Invalid token");
        require(_amount > 0, "Amount > 0");
        require(_frequency > 0, "Frequency > 0");

        plans[nextPlanId] = Plan(msg.sender, _token, _amount, _frequency);
        emit PlanCreated(nextPlanId, msg.sender, _amount, _frequency);
        nextPlanId++;
    }

    function subscribe(uint256 _planId) external {
        Plan memory plan = plans[_planId];
        require(plan.merchant != address(0), "Plan does not exist");

        // Initial Payment
        IERC20(plan.token).transferFrom(msg.sender, plan.merchant, plan.amount);

        subscriptions[msg.sender][_planId] = Subscription(
            msg.sender,
            block.timestamp,
            block.timestamp + plan.frequency
        );

        emit Subscribed(msg.sender, _planId, block.timestamp);
        emit PaymentProcessed(msg.sender, _planId, plan.amount, block.timestamp);
    }

    function cancel(uint256 _planId) external {
        Subscription storage sub = subscriptions[msg.sender][_planId];
        require(sub.subscriber != address(0), "Not subscribed");
        
        delete subscriptions[msg.sender][_planId];
        emit SubscriptionCancelled(msg.sender, _planId, block.timestamp);
    }

    function pay(address _subscriber, uint256 _planId) external {
        Subscription storage sub = subscriptions[_subscriber][_planId];
        require(sub.subscriber != address(0), "Not subscribed");
        require(block.timestamp >= sub.nextPayment, "Not due yet");

        Plan memory plan = plans[_planId];
        IERC20(plan.token).transferFrom(_subscriber, plan.merchant, plan.amount);

        sub.nextPayment = sub.nextPayment + plan.frequency;
        emit PaymentProcessed(_subscriber, _planId, plan.amount, block.timestamp);
    }
}
