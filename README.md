# 🎨 NFT Marketplace dApp

A modern, full-stack decentralized application for minting, managing, and trading NFTs on the Ethereum blockchain. Built with Next.js 15, TypeScript, Tailwind CSS v4, and Wagmi v2.

![NFT dApp](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-gray?style=for-the-badge&logo=solidity)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🔐 **Wallet Integration**
- Seamless MetaMask wallet connection
- Multiple wallet connector support via Wagmi
- Real-time wallet status and balance tracking
- Copy wallet address functionality

### 🎨 **NFT Minting**
- **Standard Minting**: Quick mint with default metadata
- **Custom URI Minting**: Mint with custom IPFS metadata
- **IPFS Upload**: Built-in IPFS uploader with Pinata/Infura support
- Full metadata customization (name, description, attributes, etc.)
- Real-time transaction status tracking

### 🖼️ **NFT Gallery**
- View all your minted NFTs in a beautiful grid layout
- Display NFT metadata, images, and attributes
- Multiple IPFS gateway fallback for reliable image loading
- Transfer NFTs to other addresses
- Direct links to OpenSea and Etherscan

### 🔍 **NFT Debugger**
- Inspect token metadata directly from the blockchain
- View token URIs and owner information
- Preview NFT images with fallback handling
- Helpful for debugging IPFS and metadata issues

### 🎨 **Modern UI/UX**
- Dark theme with gradient accents
- Glassmorphism effects
- Smooth animations and transitions
- Responsive design for all devices
- Professional loading states and error handling

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** or **pnpm**
- **MetaMask** browser extension
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mtalhaikram/nft-dapp.git
cd nft-dapp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables**
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your values
nano .env.local
```

Required environment variables:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key_for_deployment
```

Optional (for IPFS uploads):
```env
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
```

4. **Compile smart contracts**
```bash
npm run compile
```

5. **Deploy the contract (Sepolia testnet)**
```bash
npm run deploy:sepolia
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
```
http://localhost:3000
```

## 🏗️ Project Structure

```
nft-dapp/
├── contracts/              # Solidity smart contracts
│   └── MyNFT.sol          # ERC-721 NFT contract
├── scripts/               # Deployment scripts
│   ├── deploy.js
│   └── deploy.ts
├── src/
│   ├── app/               # Next.js 15 app directory
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page
│   ├── components/        # React components
│   │   ├── WalletButton.tsx
│   │   ├── MintNFT.tsx
│   │   ├── MyNFTs.tsx
│   │   ├── IPFSUploader.tsx
│   │   ├── NFTDebugger.tsx
│   │   └── WalletProvider.tsx
│   └── lib/               # Utility libraries
│       ├── contract.ts    # Contract ABI and config
│       ├── ipfs.ts        # IPFS upload functions
│       └── wagmi.ts       # Wagmi configuration
├── hardhat.config.ts      # Hardhat configuration
├── env.example            # Environment variables template
└── package.json           # Dependencies
```

## 🔧 Technology Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS
- **[Wagmi v2](https://wagmi.sh/)** - React hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript Ethereum library
- **[TanStack Query](https://tanstack.com/query)** - Async state management

### Blockchain
- **[Hardhat](https://hardhat.org/)** - Ethereum development environment
- **[Solidity](https://soliditylang.org/)** - Smart contract language
- **[OpenZeppelin](https://www.openzeppelin.com/)** - Secure contract library
- **[Ethers.js v6](https://docs.ethers.org/)** - Ethereum library

### Storage
- **[IPFS](https://ipfs.io/)** - Decentralized file storage
- **[Pinata](https://pinata.cloud/)** - IPFS pinning service

## 📝 Smart Contract

The NFT contract (`MyNFT.sol`) is an ERC-721 token with the following features:

- ✅ Standard ERC-721 compliance
- ✅ Configurable mint price
- ✅ Max supply limit
- ✅ Custom token URIs
- ✅ Owner-only functions
- ✅ Pausable minting
- ✅ Withdraw function for contract owner

### Contract Functions

```solidity
// Mint with default URI
function mint() external payable returns (uint256)

// Mint with custom URI
function mintWithURI(string memory customURI) external payable returns (uint256)

// Get contract information
function getContractInfo() external view returns (...)

// Owner functions
function setMintPrice(uint256 newPrice) external onlyOwner
function withdraw() external onlyOwner
```

## 🌐 Deployment

### Deploy to Sepolia Testnet

1. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

2. Configure your `.env.local`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

3. Deploy:
```bash
npm run deploy:sepolia
```

4. Copy the deployed contract address to `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

5. Verify on Etherscan:
```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS "ipfs://YOUR_BASE_URI"
```

## 🧪 Testing

### Run Tests
```bash
# Run Hardhat tests
npx hardhat test

# Run with coverage
npx hardhat coverage

# Run specific test
npx hardhat test test/MyNFT.test.js
```

### Test Locally
```bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network (in another terminal)
npm run deploy:local

# Update .env.local with local contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Start Next.js dev server
npm run dev
```

## 📚 Environment Variables

See `env.example` for a complete list of environment variables.

### Required
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Your deployed NFT contract address
- `SEPOLIA_RPC_URL` - RPC endpoint for Sepolia testnet
- `PRIVATE_KEY` - Wallet private key for deployment

### Optional
- `NEXT_PUBLIC_PINATA_API_KEY` - Pinata API key for IPFS
- `NEXT_PUBLIC_PINATA_SECRET_KEY` - Pinata secret key
- `NEXT_PUBLIC_INFURA_PROJECT_ID` - Infura project ID for IPFS
- `NEXT_PUBLIC_INFURA_PROJECT_SECRET` - Infura project secret
- `NEXT_PUBLIC_MOCK_IPFS` - Use mock IPFS for testing (true/false)
- `ETHERSCAN_API_KEY` - For contract verification

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start Next.js dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Smart Contracts
npm run compile      # Compile Solidity contracts
npm run deploy:sepolia  # Deploy to Sepolia testnet
npm run deploy:local    # Deploy to local Hardhat network
```

## 🔒 Security Best Practices

⚠️ **IMPORTANT**: Never commit sensitive information to Git!

- ✅ Use `.env.local` for sensitive data
- ✅ Never share your private keys
- ✅ Use hardware wallets for production
- ✅ Audit smart contracts before mainnet deployment
- ✅ Test thoroughly on testnets first
- ✅ Use environment variables for all secrets

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://www.openzeppelin.com/) - Secure smart contract library
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

- 📧 Email: talhaikramweb3@gmail.com
- 💬 GitHub Issues: [Report bugs or request features](https://github.com/Mtalhaikram/nft-dapp/issues)

## 🔗 Links

- **Live Demo**: [https://your-demo.vercel.app](https://your-demo.vercel.app)
- **Contract on Etherscan**: [View Contract](https://sepolia.etherscan.io/address/YOUR_CONTRACT)
- **Documentation**: [Full Docs](./SETUP.md)

---

**Built with ❤️ by [Talha Ikram](https://github.com/Mtalhaikram)**
