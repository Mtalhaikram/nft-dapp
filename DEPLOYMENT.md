# NFT Contract Deployment Guide

This guide will help you deploy your NFT contract to the Sepolia testnet.

## Prerequisites

Before deploying, make sure you have:

1. **A MetaMask wallet** with a private key
2. **Sepolia ETH** in your wallet (get from faucet)
3. **An RPC provider** (Alchemy, Infura, or QuickNode)
4. **Etherscan API key** (optional, for verification)

## Step 1: Get Sepolia ETH

You need Sepolia ETH to pay for gas fees. Get some from these faucets:

- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

## Step 2: Get an RPC URL

Sign up for a free account with one of these providers:

### Option A: Alchemy (Recommended)
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Create a free account
3. Create a new app on Sepolia network
4. Copy your API key
5. Your RPC URL will be: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

### Option B: Infura
1. Go to [infura.io](https://infura.io/)
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Your RPC URL will be: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

## Step 3: Get Your Private Key

⚠️ **IMPORTANT: Never share your private key or commit it to git!**

1. Open MetaMask
2. Click on the three dots menu
3. Select "Account Details"
4. Click "Show Private Key"
5. Enter your password
6. Copy your private key (starts with 0x)

## Step 4: Create .env File

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit the `.env` file and fill in your values:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
BASE_URI=ipfs://YOUR_CID_HERE/
```

## Step 5: Compile the Contract

```bash
npx hardhat compile
```

This will compile your Solidity contract and generate artifacts.

## Step 6: Deploy to Sepolia

```bash
npm run deploy:sepolia
```

Or manually:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## Step 7: Save the Contract Address

After deployment, you'll see output like:

```
✅ MyNFT deployed successfully!
Contract address: 0x1234567890abcdef1234567890abcdef12345678
```

**Save this contract address!** You'll need it to interact with your contract.

## Step 8: Verify Your Contract on Etherscan (Optional but Recommended)

Verification makes your contract's source code public and allows others to interact with it on Etherscan.

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS "YOUR_BASE_URI"
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234567890abcdef1234567890abcdef12345678 "ipfs://QmYourCID/"
```

## Step 9: Update Your Frontend

Update `src/lib/contract.ts` with your deployed contract address:

```typescript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"
```

Or set it as an environment variable in your `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

## Troubleshooting

### "Insufficient funds" Error
- Make sure you have enough Sepolia ETH in your wallet
- Get more from the faucets listed above

### "Invalid API key" Error
- Double-check your RPC URL in the `.env` file
- Make sure there are no extra spaces or quotes

### "Nonce too high" Error
- Reset your MetaMask account: Settings → Advanced → Reset Account

### Contract Verification Fails
- Make sure you're passing the exact same constructor arguments used during deployment
- Check that your Etherscan API key is correct

## Next Steps

After deployment:

1. ✅ Test minting an NFT from your frontend
2. ✅ View your contract on [Sepolia Etherscan](https://sepolia.etherscan.io/)
3. ✅ Share your NFT collection with others
4. ✅ Consider deploying to mainnet when ready (costs real ETH!)

## Helpful Commands

- Compile contracts: `npm run compile`
- Deploy to Sepolia: `npm run deploy:sepolia`
- Run local Hardhat node: `npx hardhat node`
- Deploy to local network: `npm run deploy:local`

## Security Notes

⚠️ **NEVER commit your `.env` file to git!**
⚠️ **NEVER share your private key with anyone!**
⚠️ **Always test on testnets before mainnet!**

## Support

If you encounter issues:

1. Check the [Hardhat documentation](https://hardhat.org/docs)
2. Search on [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
3. Ask in Web3 developer communities

---

Happy deploying! 🚀

