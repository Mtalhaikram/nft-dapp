'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

interface NFT {
  tokenId: bigint
  uri: string
  metadata?: NFTMetadata
}

// Utility function to convert IPFS URLs to HTTP gateway URLs
function convertIpfsToHttp(ipfsUrl: string): string {
  if (!ipfsUrl) return ''
  
  // Already an HTTP URL
  if (ipfsUrl.startsWith('http://') || ipfsUrl.startsWith('https://')) {
    return ipfsUrl
  }
  
  // Handle ipfs:// protocol
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '')
    return `https://cloudflare-ipfs.com/ipfs/${hash}`
  }
  
  // Handle ipfs/ prefix
  if (ipfsUrl.startsWith('ipfs/')) {
    const hash = ipfsUrl.slice(5)
    return `https://cloudflare-ipfs.com/ipfs/${hash}`
  }
  
  // Assume it's just a hash
  return `https://cloudflare-ipfs.com/ipfs/${ipfsUrl}`
}

export default function MyNFTs() {
  const { address, isConnected } = useAccount()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const publicClient = usePublicClient()

  // Get total supply
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
  })

  useEffect(() => {
    if (!isConnected || !address || !totalSupply || !publicClient) {
      setNfts([])
      return
    }

    const fetchUserNFTs = async () => {
      setLoading(true)
      try {
        const userNFTs: NFT[] = []
        const supply = Number(totalSupply)

        // Check each token to see if user owns it
        for (let i = 1; i <= supply; i++) {
          try {
            // Read owner of token
            const owner = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: CONTRACT_ABI,
              functionName: 'ownerOf',
              args: [BigInt(i)],
            }) as `0x${string}`

            // If user owns this token, get its URI
            if (owner.toLowerCase() === address.toLowerCase()) {
              const uri = await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: CONTRACT_ABI,
                functionName: 'tokenURI',
                args: [BigInt(i)],
              }) as string

              // Fetch metadata
              let metadata: NFTMetadata | undefined
              try {
                const metadataUrl = convertIpfsToHttp(uri)
                console.log(`Fetching metadata for token ${i} from:`, metadataUrl)
                
                const response = await fetch(metadataUrl)
                if (response.ok) {
                  metadata = await response.json()
                  console.log(`Metadata for token ${i}:`, metadata)
                  
                  // Convert image IPFS URI to HTTP gateway URL
                  if (metadata?.image) {
                    metadata.image = convertIpfsToHttp(metadata.image)
                    console.log(`Image URL for token ${i}:`, metadata.image)
                  }
                } else {
                  console.error(`Failed to fetch metadata for token ${i}: ${response.status} ${response.statusText}`)
                }
              } catch (err) {
                console.error(`Error fetching metadata for token ${i}:`, err)
              }

              userNFTs.push({
                tokenId: BigInt(i),
                uri,
                metadata,
              })
            }
          } catch (err) {
            // Token doesn't exist or error reading - skip it
          }
        }

        setNfts(userNFTs)
      } catch (error) {
        console.error('Error fetching NFTs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserNFTs()
  }, [address, isConnected, totalSupply, publicClient])

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Connect your wallet to view your NFT collection
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block relative mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/30 border-t-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-300 text-lg">Loading your NFTs...</p>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <svg
            className="w-12 h-12 text-gray-400 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">No NFTs Yet</h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          You haven't minted any NFTs yet. Head to the mint section above to create your first NFT!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            My Collection
          </h2>
          <p className="text-gray-400">
            You own <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">{nfts.length}</span> NFT{nfts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard key={nft.tokenId.toString()} nft={nft} />
        ))}
      </div>
    </div>
  )
}

function NFTCard({ nft }: { nft: NFT }) {
  const { address } = useAccount()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentImageUrl, setCurrentImageUrl] = useState(nft.metadata?.image || '')
  const [gatewayIndex, setGatewayIndex] = useState(0)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [transferError, setTransferError] = useState('')

  // Alternative IPFS gateways as fallbacks
  const IPFS_GATEWAYS = [
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://dweb.link/ipfs/',
  ]

  // Function to get IPFS hash from URL
  const getIpfsHash = (url: string): string | null => {
    if (!url) return null
    
    // Extract hash from various IPFS URL formats
    const ipfsMatch = url.match(/(?:ipfs:\/\/|\/ipfs\/)([a-zA-Z0-9]+)/)
    if (ipfsMatch) return ipfsMatch[1]
    
    // If it's already just a hash
    if (url.match(/^[a-zA-Z0-9]+$/)) return url
    
    return null
  }

  // Try next gateway when image fails to load
  const tryNextGateway = () => {
    const hash = getIpfsHash(nft.metadata?.image || '')
    if (!hash) {
      setImageError(true)
      setImageLoading(false)
      return
    }

    const nextIndex = gatewayIndex + 1
    if (nextIndex < IPFS_GATEWAYS.length) {
      console.log(`Trying alternative gateway ${nextIndex + 1}/${IPFS_GATEWAYS.length} for NFT #${nft.tokenId}`)
      setGatewayIndex(nextIndex)
      setCurrentImageUrl(`${IPFS_GATEWAYS[nextIndex]}${hash}`)
      setImageLoading(true)
    } else {
      console.error(`All gateways failed for NFT #${nft.tokenId}`)
      setImageError(true)
      setImageLoading(false)
    }
  }

  // Initialize image URL
  useEffect(() => {
    if (nft.metadata?.image) {
      setCurrentImageUrl(nft.metadata.image)
    }
  }, [nft.metadata?.image])

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Handle transfer
  const handleTransfer = async () => {
    setTransferError('')
    
    // Validate address
    if (!recipientAddress) {
      setTransferError('Please enter a recipient address')
      return
    }
    
    if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setTransferError('Invalid Ethereum address')
      return
    }
    
    if (recipientAddress.toLowerCase() === address?.toLowerCase()) {
      setTransferError('Cannot transfer to yourself')
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'safeTransferFrom',
        args: [address as `0x${string}`, recipientAddress as `0x${string}`, nft.tokenId],
      })
    } catch (err) {
      console.error('Transfer error:', err)
      setTransferError('Failed to initiate transfer')
    }
  }

  // Reset modal when transfer is confirmed
  useEffect(() => {
    if (isConfirmed) {
      setShowTransferModal(false)
      setRecipientAddress('')
      setTransferError('')
    }
  }, [isConfirmed])

  return (
    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative">
        {/* Image Container */}
        <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
          {currentImageUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500"></div>
                    {gatewayIndex > 0 && (
                      <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/60 whitespace-nowrap">
                        Gateway {gatewayIndex + 1}/{IPFS_GATEWAYS.length}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <img
                key={currentImageUrl} // Force re-render when URL changes
                src={currentImageUrl}
                alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100 group-hover:scale-110'
                }`}
                onLoad={() => {
                  console.log(`✅ Image loaded successfully for NFT #${nft.tokenId}`)
                  setImageLoading(false)
                }}
                onError={() => {
                  console.error(`❌ Failed to load image for NFT #${nft.tokenId}`)
                  tryNextGateway()
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-pink-600/20">
              <div className="text-center">
                <svg
                  className="w-20 h-20 text-white/20 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-3 text-white/40 text-sm font-medium">No Image</p>
              </div>
            </div>
          )}
          
          {/* Token ID Badge */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <span className="text-white text-sm font-bold">#{nft.tokenId.toString()}</span>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title & Description */}
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300 truncate">
              {nft.metadata?.name || `MyNFT #${nft.tokenId}`}
            </h3>
            {nft.metadata?.description && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                {nft.metadata.description}
              </p>
            )}
          </div>

          {/* Attributes */}
          {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Attributes</p>
              <div className="grid grid-cols-2 gap-2">
                {nft.metadata.attributes.slice(0, 4).map((attr, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10 hover:border-purple-500/30 transition-colors"
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-wide truncate font-medium">
                      {attr.trait_type}
                    </p>
                    <p className="text-sm text-white font-bold truncate mt-1">
                      {attr.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-700/50 space-y-2">
            <div className="flex gap-2">
              <a
                href={`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${nft.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
              >
                OpenSea
              </a>
              <a
                href={`https://sepolia.etherscan.io/token/${CONTRACT_ADDRESS}?a=${nft.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                title="View on Etherscan"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <button
              onClick={() => setShowTransferModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Transfer NFT
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 max-w-md w-full p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Transfer NFT
              </h3>
              <button
                onClick={() => {
                  setShowTransferModal(false)
                  setRecipientAddress('')
                  setTransferError('')
                }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                {currentImageUrl && !imageError ? (
                  <img
                    src={currentImageUrl}
                    alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/10"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center border-2 border-white/10">
                    <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate text-lg">
                    {nft.metadata?.name || `MyNFT #${nft.tokenId}`}
                  </p>
                  <p className="text-gray-400 text-sm">Token ID #{nft.tokenId.toString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-300 mb-3">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              {transferError && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {transferError}
                </p>
              )}
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error.message || 'Transaction failed'}
                </p>
              )}
            </div>

            {isConfirming && (
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-400 text-sm flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                  Waiting for confirmation...
                </p>
              </div>
            )}

            {isConfirmed && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Transfer successful!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferModal(false)
                  setRecipientAddress('')
                  setTransferError('')
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={isPending || isConfirming || !recipientAddress}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isPending || isConfirming ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{isPending ? 'Confirming...' : 'Processing...'}</span>
                  </>
                ) : (
                  'Transfer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
