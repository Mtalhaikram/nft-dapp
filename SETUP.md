# 🚀 NFT dApp Setup & Deployment Guide

Complete guide for setting up and deploying the NFT Marketplace dApp.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Frontend Configuration](#frontend-configuration)
- [IPFS Setup](#ipfs-setup)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software

1. **Node.js** (v18.0 or higher)
   ```bash
   # Check version
   node --version
   
   # Install from: https://nodejs.org/
   ```

2. **MetaMask** browser extension
   - Download from: https://metamask.io/
   - Create a new wallet or import existing one

3. **Git**
   ```bash
   # Check version
   git --version
   ```

### Required Accounts

1. **Infura/Alchemy Account** (for RPC access)
   - Infura: https://infura.io/
   - Alchemy: https://www.alchemy.com/

2. **Etherscan Account** (for contract verification)
   - https://etherscan.io/apis

3. **Pinata Account** (optional, for IPFS)
   - https://pinata.cloud/

## 💻 Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/nft-dapp.git
cd nft-dapp

# Install dependencies
npm install
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit with your values
nano .env.local
```

Minimum required variables:
```env
# Get from Infura/Alchemy
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Your wallet private key (for deployment only)
PRIVATE_KEY=your_private_key_without_0x_prefix

# Get from Etherscan
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 3: Get Test ETH

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH
4. Wait for transaction confirmation

Alternative faucets:
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

### Step 4: Compile Contracts

```bash
# Compile smart contracts
npm run compile

# You should see output:
# Compiled 1 Solidity file successfully
```

## 📦 Smart Contract Deployment

### Deploy to Sepolia Testnet

```bash
# Deploy the contract
npm run deploy:sepolia
```

**Expected Output:**
```
Deploying MyNFT contract...
MyNFT deployed to: 0x1234...5678
Contract deployed successfully!
```

**Important**: Save the contract address!

### Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS "ipfs://YOUR_BASE_URI"
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234567890123456789012345678901234567890 "ipfs://QmYourBaseURI/"
```

### Update Frontend Configuration

Add the deployed contract address to `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## 🌐 Frontend Configuration

### Step 1: Configure Contract Address

Edit `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
```

### Step 2: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 3: Connect Wallet

1. Click "Connect Wallet" button
2. Select MetaMask
3. Approve connection
4. Ensure you're on Sepolia network

## ☁️ IPFS Setup

### Option 1: Pinata (Recommended)

1. **Create Account**: https://pinata.cloud/
2. **Get API Keys**:
   - Go to API Keys section
   - Create new key
   - Copy API Key and API Secret

3. **Configure**:
```env
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
NEXT_PUBLIC_MOCK_IPFS=false
```

### Option 2: Infura IPFS

1. **Create Project**: https://infura.io/
2. **Enable IPFS**:
   - Create new project
   - Enable IPFS
   - Copy Project ID and Secret

3. **Configure**:
```env
NEXT_PUBLIC_INFURA_PROJECT_ID=your_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_project_secret
NEXT_PUBLIC_MOCK_IPFS=false
```

### Option 3: Mock IPFS (Testing Only)

For testing without IPFS credentials:
```env
NEXT_PUBLIC_MOCK_IPFS=true
```

⚠️ **Warning**: Mock IPFS generates fake hashes. Not for production!

## 🧪 Testing

### Frontend Testing

```bash
# Run linter
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```

### Smart Contract Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run coverage
npx hardhat coverage
```

### Local Blockchain Testing

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy to local network
npm run deploy:local

# Terminal 3: Start frontend
npm run dev
```

Update `.env.local` for local testing:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## 🚀 Production Deployment

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Vercel**:
   - Go to https://vercel.com/
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Environment Variables on Vercel**:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_PINATA_API_KEY` (if using IPFS)
   - `NEXT_PUBLIC_PINATA_SECRET_KEY`

⚠️ **Never add** `PRIVATE_KEY` to Vercel!

### Deploy to Other Platforms

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
# Add in Netlify dashboard
```

#### AWS/Azure/GCP
```bash
# Build
npm run build

# Start
npm start

# Configure reverse proxy (nginx/apache)
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Contract Not Deployed

**Error**: `Contract address is not configured`

**Solution**:
```bash
# Check .env.local
cat .env.local | grep CONTRACT_ADDRESS

# Should show:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# If empty, deploy contract and update
```

#### 2. Wallet Connection Failed

**Error**: `MetaMask not found`

**Solutions**:
- Install MetaMask extension
- Refresh the page
- Try different browser
- Clear browser cache

#### 3. Transaction Failed

**Error**: `Insufficient funds` or `Gas estimation failed`

**Solutions**:
- Check you have enough Sepolia ETH
- Try increasing gas limit
- Check network congestion
- Verify contract is on correct network

#### 4. IPFS Upload Failed

**Error**: `Failed to upload to IPFS`

**Solutions**:
- Check API credentials
- Verify file size (< 10MB)
- Try different gateway
- Use mock IPFS for testing

#### 5. Build Errors

**Error**: `Module not found` or `Type errors`

**Solutions**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

#### 6. Network Mismatch

**Error**: `Wrong network`

**Solutions**:
- Open MetaMask
- Switch to Sepolia testnet
- Add Sepolia if not available:
  - Network Name: Sepolia
  - RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
  - Chain ID: 11155111
  - Currency: ETH

### Getting Help

If you're still stuck:

1. **Check Logs**:
```bash
# Development logs
npm run dev

# Browser console (F12)
# Check for errors
```

2. **Verify Configuration**:
```bash
# Check all environment variables
cat .env.local

# Verify contract on Etherscan
# https://sepolia.etherscan.io/address/YOUR_CONTRACT
```

3. **Create an Issue**:
   - Include error messages
   - Describe steps to reproduce
   - Share relevant logs (without private keys!)

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Hardhat Docs](https://hardhat.org/docs)
- [Wagmi Docs](https://wagmi.sh/)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/)

### Tutorials
- [Ethereum Development](https://ethereum.org/en/developers/)
- [Solidity by Example](https://solidity-by-example.org/)
- [Web3 University](https://www.web3.university/)

### Communities
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [Hardhat Discord](https://hardhat.org/discord)
- [OpenZeppelin Forum](https://forum.openzeppelin.com/)

## 🔐 Security Checklist

Before going to production:

- [ ] Remove all hardcoded addresses
- [ ] Verify environment variables are secure
- [ ] Audit smart contracts
- [ ] Test on testnet extensively
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backup RPC endpoints
- [ ] Document emergency procedures

## 📝 Maintenance

### Regular Tasks

- Monitor contract activity
- Update dependencies regularly
- Check for security advisories
- Backup configuration files
- Review transaction logs

### Updating the App

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart server
npm start
```

---

**Need more help?** Open an issue or contact support!

