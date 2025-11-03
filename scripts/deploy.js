const hre = require("hardhat");

async function main() {
  console.log("Deploying MyNFT contract to Sepolia...");

  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get the account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Set the base URI for your NFT metadata
  // You can change this to your IPFS gateway URL or any other metadata endpoint
  const baseURI = process.env.BASE_URI || "ipfs://YOUR_CID_HERE/";
  console.log("Base URI:", baseURI);

  // Deploy the contract
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy(baseURI);

  await myNFT.waitForDeployment();

  const contractAddress = await myNFT.getAddress();
  console.log("\n✅ MyNFT deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("\n📝 Save this information:");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Sepolia");
  console.log("Deployer:", deployer.address);
  
  // Get contract info
  const [name, symbol, totalSupply, maxSupply, mintPrice] = await myNFT.getContractInfo();
  console.log("\n📊 Contract Info:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", totalSupply.toString());
  console.log("Max Supply:", maxSupply.toString());
  console.log("Mint Price:", hre.ethers.formatEther(mintPrice), "ETH");

  console.log("\n🔍 Verify your contract on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress} "${baseURI}"`);
  
  console.log("\n📝 Update your contract.ts file with the contract address:");
  console.log(`export const CONTRACT_ADDRESS = "${contractAddress}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

