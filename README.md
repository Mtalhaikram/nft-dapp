# NFT dApp - MetaMask Integration

A modern Next.js dApp for minting NFTs with MetaMask wallet integration.

## Features

- 🔗 **MetaMask Wallet Connection** - Connect your wallet with one click
- 🎨 **NFT Minting** - Mint NFTs using smart contract
- 📊 **Transaction Status** - Real-time transaction tracking
- 🎯 **Custom URIs** - Mint NFTs with custom metadata
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Beautiful dark/light theme support

## Smart Contract

The project includes a complete ERC-721 NFT contract (`contracts/MyNFT.sol`) with:

- `mint()` function for standard minting
- `mintWithURI()` function for custom metadata
- Supply management and pricing
- Owner controls and withdrawal

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### 3. Deploy Smart Contract

1. Install Hardhat or Foundry
2. Deploy the `MyNFT.sol` contract
3. Update the contract address in `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Security Notes

- Always verify smart contracts before deployment
- Use test networks for development
- Never commit private keys or sensitive data
- Test thoroughly before mainnet deployment

## License

MIT License - feel free to use this project for your own NFT dApps!