const { ethers } = require("hardhat");
const config = require("./sub_config.json");

async function main() {
    const [bot, user] = await ethers.getSigners(); // Anyone can trigger this
    const manager = await ethers.getContractAt("SubscriptionManager", config.manager, bot);

    // Simulate time passing (31 days)
    // await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
    // await ethers.provider.send("evm_mine");

    console.log("Attempting to charge next payment...");

    try {
        // Plan 0, User address
        const tx = await manager.pay(user.address, 0);
        await tx.wait();
        console.log("Payment Processed Successfully!");
    } catch (e) {
        console.error("Payment Failed (Not due yet?):", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
