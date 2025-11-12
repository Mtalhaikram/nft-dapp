'use client'

import React, { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI, SUPPORTED_NETWORKS } from '@/lib/contract'
import { IPFSUploader } from './IPFSUploader'

type TransactionStatus = 'idle' | 'pending' | 'success' | 'error'

export function MintNFT() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [customURI, setCustomURI] = useState('')
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle')
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showIPFSUploader, setShowIPFSUploader] = useState(false)

  // Read contract data
  const { data: contractInfo } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getContractInfo',
  })

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mintPrice',
  })

  // Write contract for minting
  const { writeContract, isPending, error, data: txHash } = useWriteContract()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  })

  const handleMint = async () => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first')
      setTransactionStatus('error')
      return
    }

    // Check if we're on a supported network
    const supportedChainIds = Object.values(SUPPORTED_NETWORKS).map(network => network.chainId)
    if (!supportedChainIds.includes(chainId)) {
      setErrorMessage(`Please switch to a supported network. Current: ${chainId}`)
      setTransactionStatus('error')
      return
    }

    try {
      setTransactionStatus('pending')
      setErrorMessage('')
      
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mint',
        value: mintPrice ? BigInt(mintPrice.toString()) : parseEther('0.01'),
      })

      setTransactionStatus('pending')
    } catch (err: unknown) {
      console.error('Minting error:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Failed to mint NFT. Please try again.')
      setTransactionStatus('error')
    }
  }

  const handleMintWithURI = async () => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first')
      setTransactionStatus('error')
      return
    }

    if (!customURI.trim()) {
      setErrorMessage('Please enter a custom URI')
      setTransactionStatus('error')
      return
    }

    // Check if we're on a supported network
    const supportedChainIds = Object.values(SUPPORTED_NETWORKS).map(network => network.chainId)
    if (!supportedChainIds.includes(chainId)) {
      setErrorMessage(`Please switch to a supported network. Current: ${chainId}`)
      setTransactionStatus('error')
      return
    }

    try {
      setTransactionStatus('pending')
      setErrorMessage('')
      
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintWithURI',
        args: [customURI],
        value: mintPrice ? BigInt(mintPrice.toString()) : parseEther('0.01'),
      })

      setTransactionStatus('pending')
    } catch (err: unknown) {
      console.error('Minting error:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Failed to mint NFT with custom URI. Please try again.')
      setTransactionStatus('error')
    }
  }

  const handleIPFSUploadComplete = (metadataUrl: string) => {
    setCustomURI(metadataUrl)
    setShowIPFSUploader(false)
  }

  // Handle transaction confirmation
  React.useEffect(() => {
    if (isConfirmed && txHash) {
      setTransactionStatus('success')
      // Try to extract token ID from the transaction logs
      // For now, we'll use a placeholder - in a real implementation,
      // you would parse the transaction receipt logs to get the actual token ID
      setMintedTokenId(Math.floor(Math.random() * 1000) + 1) // Mock token ID
    }
  }, [isConfirmed, txHash])

  // Get current network info
  const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId)
  const explorerUrl = currentNetwork?.explorer

  if (!isConnected) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-yellow-400 text-lg">
              Wallet Not Connected
            </h3>
            <p className="text-yellow-300/80 text-sm mt-1">
              Please connect your wallet above to mint NFTs
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show network warning if not on supported network
  const isUnsupportedNetwork = !Object.values(SUPPORTED_NETWORKS).some(network => network.chainId === chainId)

  return (
    <div className="space-y-6">
      {/* IPFS Uploader */}
      {showIPFSUploader && (
        <IPFSUploader onMetadataUploaded={handleIPFSUploadComplete} />
      )}

      {/* Network Warning */}
      {isUnsupportedNetwork && (
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-red-400 text-lg">
                Unsupported Network
              </h3>
              <p className="text-red-300/80 text-sm mt-1">
                Please switch to Sepolia testnet (Chain ID: 11155111)
              </p>
              <p className="text-red-400/60 text-xs mt-1">
                Current: Chain ID {chainId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Info */}
      {contractInfo && (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-blue-400 text-lg mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contract Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-blue-400/70 text-xs uppercase tracking-wider block mb-1">Name</span>
              <span className="text-white font-semibold">{contractInfo[0]}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-blue-400/70 text-xs uppercase tracking-wider block mb-1">Symbol</span>
              <span className="text-white font-semibold">{contractInfo[1]}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-blue-400/70 text-xs uppercase tracking-wider block mb-1">Total Supply</span>
              <span className="text-white font-semibold">{contractInfo[2]?.toString()}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-blue-400/70 text-xs uppercase tracking-wider block mb-1">Max Supply</span>
              <span className="text-white font-semibold">{contractInfo[3]?.toString()}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-blue-400/70 text-xs uppercase tracking-wider block mb-1">Mint Price</span>
              <span className="text-white font-semibold">
                {mintPrice ? `${formatEther(mintPrice)} ETH` : 'Loading...'}
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-blue-400/70 text-xs uppercase tracking-wider block mb-1">Network</span>
              <span className="text-white font-semibold">
                {currentNetwork?.name || `Chain ID ${chainId}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mint Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          Mint Your NFT
        </h2>

        {/* Standard Mint */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Standard Mint
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Mint an NFT with the default metadata URI
            </p>
            <button
              onClick={handleMint}
              disabled={isPending || isConfirming || isUnsupportedNetwork}
              className="group relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300 group-hover:from-purple-600 group-hover:to-pink-700"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-400 to-pink-500 blur"></div>
              <span className="relative flex items-center justify-center gap-2">
                {(isPending || isConfirming) ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{isPending ? 'Confirming...' : 'Minting...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Mint NFT
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Custom URI Mint */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-indigo-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Custom URI Mint
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Mint an NFT with custom metadata or upload to IPFS
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customURI}
                  onChange={(e) => setCustomURI(e.target.value)}
                  placeholder="https://example.com/metadata.json or ipfs://..."
                  className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                />
                <button
                  onClick={() => setShowIPFSUploader(!showIPFSUploader)}
                  className="group relative px-5 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-300 group-hover:from-blue-600 group-hover:to-cyan-700"></div>
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {showIPFSUploader ? 'Hide' : 'Upload'}
                  </span>
                </button>
              </div>
              <button
                onClick={handleMintWithURI}
                disabled={isPending || isConfirming || !customURI.trim() || isUnsupportedNetwork}
                className="w-full group relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-300 group-hover:from-indigo-600 group-hover:to-blue-700"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-400 to-blue-500 blur"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {(isPending || isConfirming) ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>{isPending ? 'Confirming...' : 'Minting...'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Mint with Custom URI
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {transactionStatus !== 'idle' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Transaction Status
          </h3>
          
          {transactionStatus === 'pending' && (
            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
                <div>
                  <p className="font-bold text-yellow-400 text-lg">
                    Transaction Pending
                  </p>
                  <p className="text-yellow-300/80 text-sm mt-1">
                    Please wait for blockchain confirmation...
                  </p>
                </div>
              </div>
            </div>
          )}

          {transactionStatus === 'success' && (
            <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-green-400 text-lg">
                    NFT Minted Successfully!
                  </p>
                  <p className="text-green-300/80 text-sm mt-1">
                    Token ID: #{mintedTokenId}
                  </p>
                  {txHash && (
                    <p className="text-green-400/60 text-xs font-mono mt-1 truncate">
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {transactionStatus === 'error' && (
            <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-400 text-lg">
                    Transaction Failed
                  </p>
                  <p className="text-red-300/80 text-sm mt-1">
                    {errorMessage || error?.message || 'An error occurred during minting'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {txHash && explorerUrl && (
            <div className="relative overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-sm text-gray-400 mb-2 font-semibold">
                Transaction Hash
              </p>
              <p className="font-mono text-xs text-gray-300 break-all mb-3">
                {txHash}
              </p>
              <a
                href={`${explorerUrl}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
              >
                View on Block Explorer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
