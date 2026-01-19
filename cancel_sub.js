const { ethers } = require("hardhat");
const config = require("./sub_config.json");

async function main() {
    const [_, user] = await ethers.getSigners();
    const manager = await ethers.getContractAt("SubscriptionManager", config.manager, user);

    console.log("Cancelling subscription...");
    
    const tx = await manager.cancel(0);
    await tx.wait();

    console.log("Subscription Cancelled. No further charges.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
