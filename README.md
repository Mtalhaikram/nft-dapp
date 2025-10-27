# NFT dApp - Connect Your Wallet & Mint NFTs

A modern Next.js dApp that allows users to connect their MetaMask wallet and mint NFTs directly from the website. Built with wagmi, viem, and Tailwind CSS.

## 🚀 Features

- **Wallet Integration**: Connect MetaMask and other wallets seamlessly
- **NFT Minting**: Mint NFTs with custom metadata URIs
- **Network Support**: Works with Sepolia testnet, localhost, and mainnet
- **Real-time Updates**: Live contract data and transaction status
- **Responsive Design**: Beautiful UI that works on all devices
- **Error Handling**: Comprehensive error messages and user feedback
- **Dark Mode**: Beautiful dark/light theme support

## Smart Contract

The project includes a complete ERC-721 NFT contract (`contracts/MyNFT.sol`) with:

- `mint()` function for standard minting
- `mintWithURI()` function for custom metadata
- Supply management and pricing
- Owner controls and withdrawal

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MetaMask browser extension
- Some ETH on Sepolia testnet for gas fees
- A deployed MyNFT smart contract

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nft-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Contract Configuration
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   
   # WalletConnect Configuration (optional)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   
   # Network Configuration
   NEXT_PUBLIC_NETWORK=sepolia
   ```

4. **Update contract address**
   Replace `0xYourDeployedContractAddress` with your actual deployed contract address in:
   - `.env.local` file
   - `src/lib/contract.ts` (fallback value)

## 🚀 Getting Started

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:3000`

3. **Connect your wallet**
   - Click "Connect MetaMask" button
   - Approve the connection in MetaMask
   - Make sure you're on Sepolia testnet

4. **Start minting NFTs**
   - View contract information
   - Choose between standard mint or custom URI mint
   - Confirm transactions in MetaMask

## Usage

1. **Connect Wallet**: Click "Connect MetaMask" to connect your wallet
2. **View Contract Info**: See contract details, supply, and pricing
3. **Mint NFT**: Use the standard mint or custom URI mint
4. **Track Transactions**: Monitor transaction status and view on Etherscan

## Contract Functions

### `mint()`
- Mints an NFT with default metadata
- Requires payment (default: 0.01 ETH)
- Returns the token ID

### `mintWithURI(string memory customURI)`
- Mints an NFT with custom metadata URI
- Requires payment (default: 0.01 ETH)
- Returns the token ID

### View Functions
- `getContractInfo()` - Returns contract details
- `totalSupply()` - Current supply
- `mintPrice()` - Current mint price

## Technologies Used

- **Next.js 15** - React framework
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Tailwind CSS** - Styling
- **Solidity** - Smart contracts
- **OpenZeppelin** - Security standards

## Development

### Smart Contract Development

```bash
# Install Hardhat
npm install --save-dev hardhat

# Initialize Hardhat
npx hardhat init

# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Smart Contract
1. Deploy to your preferred network (Sepolia, Mainnet, etc.)
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
3. Verify contract on Etherscan

### Frontend
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set environment variables in your deployment platform

## 🐛 Troubleshooting

### Common Issues

1. **"Wallet Not Connected"**
   - Make sure MetaMask is installed and unlocked
   - Try refreshing the page and reconnecting

2. **"Unsupported Network"**
   - Switch to Sepolia testnet in MetaMask
   - Add Sepolia network if not already added

3. **"Transaction Failed"**
   - Check if you have enough ETH for gas fees
   - Ensure contract address is correct
   - Verify you're on the right network

4. **Contract not found**
   - Double-check the contract address
   - Ensure the contract is deployed on the current network
   - Verify the ABI matches your deployed contract

### Getting Sepolia ETH
1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH
4. Wait for confirmation

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourProductionContractAddress
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_NETWORK=mainnet
```

## 🔒 Security Notes

- Never commit private keys or sensitive data
- Use environment variables for configuration
- Test thoroughly on testnets before mainnet deployment
- Verify contract addresses before going live
- Always verify smart contracts before deployment

## 📚 Learn More

- [wagmi Documentation](https://wagmi.sh/)
- [viem Documentation](https://viem.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MetaMask Developer Docs](https://docs.metamask.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.