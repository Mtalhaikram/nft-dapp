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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">🔍 NFT Debugger</h3>
      <p className="text-gray-400 text-sm mb-4">
        Check what data is stored in your NFT tokens
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Token ID"
          min="1"
          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={debugToken}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Loading...' : 'Debug'}
        </button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          {debugInfo.error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-semibold">❌ Error</p>
              <p className="text-red-300 text-sm mt-1">{debugInfo.error}</p>
            </div>
          ) : (
            <>
              {/* Token URI */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Token URI</p>
                <p className="text-white text-sm break-all font-mono">{debugInfo.uri}</p>
                {debugInfo.isIPFSUri && (
                  <p className="text-green-400 text-xs mt-2">✅ IPFS URI detected</p>
                )}
                {debugInfo.isMockHash && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 mt-2">
                    <p className="text-yellow-400 text-xs">
                      ⚠️ This might be a mock IPFS hash (not a real image)
                    </p>
                  </div>
                )}
              </div>

              {/* Owner */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Owner</p>
                <p className="text-white text-sm break-all font-mono">{debugInfo.owner}</p>
              </div>

              {/* Metadata */}
              {debugInfo.metadata ? (
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Metadata</p>
                  <pre className="text-white text-xs overflow-auto p-3 bg-black/30 rounded border border-gray-700">
                    {JSON.stringify(debugInfo.metadata, null, 2)}
                  </pre>
                  
                  {/* Image URL */}
                  {debugInfo.metadata.image && (
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-400 text-xs">Image URL:</p>
                      <p className="text-blue-400 text-xs break-all">{debugInfo.metadata.image}</p>
                      
                      {/* Try to display image */}
                      <div className="mt-3">
                        <p className="text-gray-400 text-xs mb-2">Image Preview:</p>
                        <img
                          src={debugInfo.metadata.image}
                          alt="NFT"
                          className="max-w-xs rounded-lg border border-gray-700"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const errorDiv = document.createElement('div')
                            errorDiv.className = 'bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm'
                            errorDiv.textContent = '❌ Image failed to load - URL is invalid or image not accessible'
                            e.currentTarget.parentNode?.appendChild(errorDiv)
                          }}
                          onLoad={() => {
                            console.log('✅ Image loaded successfully')
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : debugInfo.metadataError ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 font-semibold">❌ Failed to fetch metadata</p>
                  <p className="text-red-300 text-sm mt-1">{debugInfo.metadataError}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    This usually means the IPFS hash is invalid or the file doesn't exist on IPFS.
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-400 text-xs">
          <strong>💡 Tip:</strong> If you're using mock IPFS hashes (no API keys configured), 
          the images won't load. Configure Pinata or Infura API keys in your .env file to 
          upload real images to IPFS.
        </p>
      </div>
    </div>
  )
}

