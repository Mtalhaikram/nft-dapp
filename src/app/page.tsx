import { WalletButton } from "@/components/WalletButton";
import { MintNFT } from "@/components/MintNFT";
import MyNFTs from "@/components/MyNFTs";
import { NFTDebugger } from "@/components/NFTDebugger";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Hero Header */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                <span className="text-sm font-semibold text-blue-400">Powered by Ethereum</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  NFT Marketplace
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Create, mint, and manage your digital assets on the blockchain with our decentralized platform
              </p>

              <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Decentralized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Web3 Native</span>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto mb-16 space-y-8">
              {/* Wallet Connection Section */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-8">
                  <WalletButton />
                </div>
              </div>

              {/* NFT Minting Section */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-8">
                  <MintNFT />
                </div>
              </div>
            </div>

            {/* My NFTs Section */}
            <div className="mb-16">
              <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-8 lg:p-10">
                <MyNFTs />
              </div>
            </div>

            {/* NFT Debugger Section */}
            <div className="max-w-5xl mx-auto mb-16">
              <NFTDebugger />
            </div>

            {/* Enhanced Features Section */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
              <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Wallet Integration
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Seamlessly connect your MetaMask wallet to interact with the blockchain securely.
                  </p>
                </div>
              </div>
              
              <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    NFT Minting
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Create and mint your own unique NFTs with custom metadata and artwork.
                  </p>
                </div>
              </div>
              
              <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Decentralized
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Built on Ethereum blockchain for true ownership and decentralization.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Getting Started */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold">Getting Started</h2>
                </div>
                <ol className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center font-bold border border-white/20">1</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Install MetaMask</h3>
                      <p className="text-gray-300 text-sm">Download and install the MetaMask browser extension to get started</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center font-bold border border-white/20">2</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Connect Your Wallet</h3>
                      <p className="text-gray-300 text-sm">Use the connect button above to link your wallet to the dApp</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center font-bold border border-white/20">3</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Get Test ETH</h3>
                      <p className="text-gray-300 text-sm">Ensure you have some Sepolia ETH for gas fees</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center font-bold border border-white/20">4</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Start Minting</h3>
                      <p className="text-gray-300 text-sm">Create and mint your unique NFTs on the blockchain!</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
