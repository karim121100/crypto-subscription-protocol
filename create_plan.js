const { ethers } = require("hardhat");
const config = require("./sub_config.json");

async function main() {
    const [merchant] = await ethers.getSigners();
    const manager = await ethers.getContractAt("SubscriptionManager", config.manager, merchant);

    console.log("Creating Monthly Plan...");
    
    const amount = ethers.parseEther("10"); // 10 USDT
    const frequency = 30 * 24 * 60 * 60; // 30 Days in seconds

    const tx = await manager.createPlan(config.token, amount, frequency);
    await tx.wait();

    console.log("Plan Created! ID: 0");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
