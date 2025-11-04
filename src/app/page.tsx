import { WalletButton } from "@/components/WalletButton";
import { MintNFT } from "@/components/MintNFT";
import MyNFTs from "@/components/MyNFTs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              NFT dApp
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Connect your wallet to start minting and managing NFTs on the blockchain
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            {/* Wallet Connection Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
              <WalletButton />
            </div>

            {/* NFT Minting Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
              <MintNFT />
            </div>
          </div>

          {/* My NFTs Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
            <MyNFTs />
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Wallet Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect your MetaMask wallet to interact with the blockchain securely.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                NFT Minting
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and mint your own unique NFTs with custom metadata and artwork.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Decentralized
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built on Ethereum blockchain for true ownership and decentralization.
              </p>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Install MetaMask browser extension</li>
              <li>Connect your wallet using the button above</li>
              <li>Make sure you have some ETH for gas fees</li>
              <li>Start minting your NFTs!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
