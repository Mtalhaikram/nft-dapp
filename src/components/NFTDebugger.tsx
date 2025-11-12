'use client'

import { useState } from 'react'
import { usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

export function NFTDebugger() {
  const [tokenId, setTokenId] = useState('1')
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const publicClient = usePublicClient()

  const debugToken = async () => {
    if (!publicClient) {
      alert('Please connect your wallet first')
      return
    }

    setLoading(true)
    setDebugInfo(null)

    try {
      // Get token URI
      const uri = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'tokenURI',
        args: [BigInt(tokenId)],
      }) as string

      console.log('Token URI:', uri)

      // Try to fetch metadata
      let metadata = null
      let metadataError = null
      
      try {
        // Convert IPFS URI to HTTP
        let metadataUrl = uri
        if (uri.startsWith('ipfs://')) {
          metadataUrl = uri.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
        } else if (uri.startsWith('ipfs/')) {
          metadataUrl = `https://cloudflare-ipfs.com/ipfs/${uri.slice(5)}`
        }

        console.log('Fetching metadata from:', metadataUrl)
        const response = await fetch(metadataUrl)
        
        if (response.ok) {
          metadata = await response.json()
          console.log('Metadata:', metadata)
        } else {
          metadataError = `HTTP ${response.status}: ${response.statusText}`
        }
      } catch (err) {
        metadataError = err instanceof Error ? err.message : 'Unknown error'
      }

      // Get owner
      const owner = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'ownerOf',
        args: [BigInt(tokenId)],
      }) as string

      setDebugInfo({
        tokenId,
        uri,
        owner,
        metadata,
        metadataError,
        isIPFSUri: uri.includes('ipfs'),
        isMockHash: uri.includes('Qm') && uri.length < 100,
      })
    } catch (error) {
      console.error('Debug error:', error)
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Failed to fetch token info',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-black text-white">NFT Debugger</h3>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Inspect and debug NFT token data directly from the blockchain
      </p>

      <div className="flex gap-3 mb-6">
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Token ID"
          min="1"
          className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-mono"
        />
        <button
          onClick={debugToken}
          disabled={loading}
          className="group relative px-8 py-3 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 group-hover:from-orange-600 group-hover:to-red-700"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-400 to-red-500 blur"></div>
          <span className="relative flex items-center gap-2">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Debug
              </>
            )}
          </span>
        </button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          {debugInfo.error ? (
            <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-400 text-lg">Error</p>
                  <p className="text-red-300 text-sm mt-1">{debugInfo.error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Token URI */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-bold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Token URI
                  </p>
                  {debugInfo.isIPFSUri && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      IPFS
                    </span>
                  )}
                </div>
                <p className="text-white text-sm break-all font-mono bg-black/30 p-3 rounded-lg border border-white/10">{debugInfo.uri}</p>
                {debugInfo.isMockHash && (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-400 text-xs flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      This might be a mock IPFS hash (not a real image)
                    </p>
                  </div>
                )}
              </div>

              {/* Owner */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Owner
                </p>
                <p className="text-white text-sm break-all font-mono bg-black/30 p-3 rounded-lg border border-white/10">{debugInfo.owner}</p>
              </div>

              {/* Metadata */}
              {debugInfo.metadata ? (
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Metadata
                  </p>
                  <pre className="text-white text-xs overflow-auto p-4 bg-black/50 rounded-lg border border-white/10 font-mono max-h-96">
{JSON.stringify(debugInfo.metadata, null, 2)}
                  </pre>
                  
                  {/* Image URL */}
                  {debugInfo.metadata.image && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-blue-400 text-xs font-bold mb-2">Image URL:</p>
                        <p className="text-blue-300 text-xs break-all font-mono">{debugInfo.metadata.image}</p>
                      </div>
                      
                      {/* Try to display image */}
                      <div>
                        <p className="text-gray-400 text-xs font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Image Preview:
                        </p>
                        <div className="relative">
                          <img
                            src={debugInfo.metadata.image}
                            alt="NFT"
                            className="max-w-xs rounded-xl border-2 border-white/10 shadow-2xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const errorDiv = document.createElement('div')
                              errorDiv.className = 'bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2'
                              errorDiv.innerHTML = `
                                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Image failed to load - URL is invalid or image not accessible</span>
                              `
                              e.currentTarget.parentNode?.appendChild(errorDiv)
                            }}
                            onLoad={() => {
                              console.log('✅ Image loaded successfully')
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : debugInfo.metadataError ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-red-400 text-lg">Failed to fetch metadata</p>
                      <p className="text-red-300 text-sm mt-1">{debugInfo.metadataError}</p>
                      <p className="text-red-400/60 text-xs mt-2">
                        This usually means the IPFS hash is invalid or the file doesn't exist on IPFS
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      )}

      <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-blue-400 font-bold text-sm mb-1">💡 Developer Tip</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              If you're using mock IPFS hashes (no API keys configured), the images won't load. 
              Configure Pinata or Infura API keys in your <code className="bg-black/30 px-1.5 py-0.5 rounded text-cyan-400 font-mono">.env</code> file to upload real images to IPFS.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
