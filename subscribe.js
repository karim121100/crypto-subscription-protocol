const { ethers } = require("hardhat");
const config = require("./sub_config.json");

async function main() {
    const [_, user] = await ethers.getSigners();
    const manager = await ethers.getContractAt("SubscriptionManager", config.manager, user);
    const token = await ethers.getContractAt("MockUSDT", config.token, user);

    // Setup: Give user tokens and approve infinite amount
    const [admin] = await ethers.getSigners();
    await token.connect(admin).transfer(user.address, ethers.parseEther("1000"));
    
    console.log("Approving Manager to spend tokens...");
    // Crucial step: User must approve a large amount for recurring billing to work
    await token.approve(config.manager, ethers.MaxUint256);

    console.log("Subscribing to Plan 0...");
    const tx = await manager.subscribe(0);
    await tx.wait();

    console.log("Subscribed! First payment sent.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
