'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, usePublicClient } from 'wagmi'
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
                const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
                const response = await fetch(metadataUrl)
                if (response.ok) {
                  metadata = await response.json()
                  if (metadata?.image) {
                    metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  }
                }
              } catch (err) {
                console.log(`Could not fetch metadata for token ${i}`)
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
      <div className="text-center py-16">
        <svg
          className="mx-auto h-16 w-16 text-gray-600"
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
        <h3 className="mt-4 text-xl font-semibold text-gray-300">Connect Your Wallet</h3>
        <p className="mt-2 text-gray-500">
          Connect your wallet to view your NFT collection
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        <p className="mt-6 text-gray-400 text-lg">Loading your NFTs...</p>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-gray-400"
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
        <h3 className="mt-6 text-2xl font-bold text-white">No NFTs Yet</h3>
        <p className="mt-2 text-gray-400 max-w-md mx-auto">
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
          <h2 className="text-3xl font-bold text-white">My NFT Collection</h2>
          <p className="mt-2 text-gray-400">
            You own <span className="text-blue-400 font-semibold">{nfts.length}</span> NFT{nfts.length !== 1 ? 's' : ''}
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
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
      {/* Image Container */}
      <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        {nft.metadata?.image && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            <img
              src={nft.metadata.image}
              alt={nft.metadata.name || `NFT #${nft.tokenId}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-purple-600/30">
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
              <p className="mt-2 text-white/40 text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {/* Token ID Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="text-white text-sm font-bold">#{nft.tokenId.toString()}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {nft.metadata?.name || `MyNFT #${nft.tokenId}`}
          </h3>
          {nft.metadata?.description && (
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
              {nft.metadata.description}
            </p>
          )}
        </div>

        {/* Attributes */}
        {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Attributes</p>
            <div className="grid grid-cols-2 gap-2">
              {nft.metadata.attributes.slice(0, 4).map((attr, index) => (
                <div
                  key={index}
                  className="bg-gray-900/60 rounded-lg px-3 py-2 border border-gray-700/50"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                    {attr.trait_type}
                  </p>
                  <p className="text-sm text-white font-semibold truncate mt-0.5">
                    {attr.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-700 flex gap-2">
          <a
            href={`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${nft.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50"
          >
            OpenSea
          </a>
          <a
            href={`https://sepolia.etherscan.io/token/${CONTRACT_ADDRESS}?a=${nft.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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
      </div>
    </div>
  )
}

