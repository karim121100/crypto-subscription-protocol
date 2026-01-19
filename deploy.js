const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with:", deployer.address);

    // 1. Deploy Mock Token
    const Token = await ethers.getContractFactory("MockUSDT");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();

    // 2. Deploy Manager
    const Manager = await ethers.getContractFactory("SubscriptionManager");
    const manager = await Manager.deploy();
    await manager.waitForDeployment();
    const managerAddr = await manager.getAddress();

    console.log(`Manager Deployed: ${managerAddr}`);
    
    // Save Config
    const config = { manager: managerAddr, token: tokenAddr };
    fs.writeFileSync("sub_config.json", JSON.stringify(config));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
