# Crypto Subscription Protocol

![Solidity](https://img.shields.io/badge/solidity-^0.8.20-blue)
![Payment](https://img.shields.io/badge/payment-recurring-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

**Crypto Subscription Protocol** enables SaaS businesses to accept recurring payments on the blockchain. Unlike credit cards (pull payments), crypto is usually "push" only. This protocol uses the `approve` pattern to allow the contract to "pull" funds periodically, provided the time interval has passed.

## Features

-   **Plan Management**: Merchants can create plans (Price, Interval).
-   **Subscription**: Users subscribe by approving tokens.
-   **Automated Billing**: Anyone (or a bot) can trigger the `charge()` function when due.
-   **Cancellation**: Users can cancel at any time to stop future billing.

## Usage

```bash
# 1. Install
npm install

# 2. Deploy Contracts
npx hardhat run deploy.js --network localhost

# 3. Create a Plan (e.g., 100 Tokens / 30 Days)
node create_plan.js

# 4. User Subscribes
node subscribe.js

# 5. Process Payment (After 30 days)
node process_payment.js
