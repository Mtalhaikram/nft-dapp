# NFT Contract Deployment Information

## 🎉 Successfully Deployed to Sepolia Testnet

**Deployment Date**: November 3, 2025

---

## 📋 Contract Details

- **Contract Address**: `0x3824B33323C3663FF878E7A828A3c8d7f7f65210`
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Deployer Address**: `0x3fFB517965600911D2E55fdE6B4f22409BCF1536`

---

## 📊 Contract Information

- **Name**: MyNFT
- **Symbol**: MNFT
- **Max Supply**: 1,000 NFTs
- **Mint Price**: 0.01 ETH
- **Total Minted**: 0 (at deployment)
- **Base URI**: ipfs://YOUR_CID_HERE/

---

## 🔗 Important Links

### View on Etherscan
- **Contract**: https://sepolia.etherscan.io/address/0x3824B33323C3663FF878E7A828A3c8d7f7f65210
- **Deployer**: https://sepolia.etherscan.io/address/0x3fFB517965600911D2E55fdE6B4f22409BCF1536

### Interact with Contract
- Add to MetaMask and interact via your dApp
- View on OpenSea Testnet: https://testnets.opensea.io/assets/sepolia/0x3824B33323C3663FF878E7A828A3c8d7f7f65210/1

---

## ✅ Verify Contract on Etherscan

To verify your contract's source code on Etherscan (recommended):

```bash
npx hardhat verify --network sepolia 0x3824B33323C3663FF878E7A828A3c8d7f7f65210 "ipfs://YOUR_CID_HERE/"
```

Benefits of verification:
- ✅ Users can read your contract source code
- ✅ Direct interaction through Etherscan UI
- ✅ Increased trust and transparency
- ✅ Better integration with tools and explorers

---

## 🎨 Update NFT Metadata

Your contract is currently using a placeholder URI. To update it:

1. **Upload your metadata to IPFS** (see IPFS_GUIDE.md)
2. **Get your IPFS CID** (e.g., QmYourCIDHere)
3. **Update the base URI** using the contract owner functions:

```javascript
// Using ethers.js
const contract = new ethers.Contract(contractAddress, abi, signer);
await contract.setBaseURI("ipfs://YOUR_NEW_CID/");
```

Or update the `.env` file and redeploy if needed.

---

## 🚀 Next Steps

### 1. Test Your Contract
```bash
# Start your frontend
npm run dev
```

Visit http://localhost:3000 and test minting an NFT!

### 2. Verify the Contract (Recommended)
Get an Etherscan API key from https://etherscan.io/myapikey and run:
```bash
npx hardhat verify --network sepolia 0x3824B33323C3663FF878E7A828A3c8d7f7f65210 "ipfs://YOUR_CID_HERE/"
```

### 3. Upload Metadata to IPFS
- Prepare your NFT metadata (name, description, image)
- Upload to IPFS using Pinata or NFT.Storage
- Update base URI in the contract

### 4. Configure Your Frontend
The contract address has been automatically updated in `src/lib/contract.ts`.

### 5. Share Your Collection
- Share the contract address with users
- List on OpenSea Testnet
- Test all functionality before mainnet deployment

---

## ⚠️ Important Security Notes

- ✅ Your `.env` file is in `.gitignore` - never commit it!
- ✅ Keep your private key secure
- ✅ Test thoroughly on testnet before mainnet
- ✅ Consider getting a smart contract audit before mainnet deployment

---

## 🎯 Contract Functions

Your deployed contract includes:

### Public Functions
- `mint()` - Mint an NFT (costs 0.01 ETH)
- `mintWithURI(string)` - Mint with custom URI
- `totalSupply()` - Get current total supply
- `getCurrentTokenId()` - Get current token ID
- `tokenURI(uint256)` - Get metadata URI for a token
- `getContractInfo()` - Get contract details

### Owner-Only Functions
- `setBaseURI(string)` - Update base metadata URI
- `setMintPrice(uint256)` - Update mint price
- `withdraw()` - Withdraw contract balance

---

## 📞 Support

If you need help:
- Check the DEPLOYMENT.md guide
- Review Hardhat documentation: https://hardhat.org/docs
- Ethereum Stack Exchange: https://ethereum.stackexchange.com/

---

**Congratulations on your successful deployment! 🎉**

