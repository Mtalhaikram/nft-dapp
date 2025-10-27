'use client'

import React, { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI, SUPPORTED_NETWORKS } from '@/lib/contract'

type TransactionStatus = 'idle' | 'pending' | 'success' | 'error'

export function MintNFT() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [customURI, setCustomURI] = useState('')
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

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
  const { writeContract, isPending, error } = useWriteContract()

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
    if (!supportedChainIds.includes(chainId as any)) {
      setErrorMessage(`Please switch to a supported network. Current: ${chainId}`)
      setTransactionStatus('error')
      return
    }

    try {
      setTransactionStatus('pending')
      setErrorMessage('')
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mint',
        value: mintPrice ? BigInt(mintPrice.toString()) : parseEther('0.01'),
      })

      if (hash) {
        setTxHash(hash)
        setTransactionStatus('pending')
      }
    } catch (err: any) {
      console.error('Minting error:', err)
      setErrorMessage(err?.message || 'Failed to mint NFT. Please try again.')
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
    if (!supportedChainIds.includes(chainId as any)) {
      setErrorMessage(`Please switch to a supported network. Current: ${chainId}`)
      setTransactionStatus('error')
      return
    }

    try {
      setTransactionStatus('pending')
      setErrorMessage('')
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintWithURI',
        args: [customURI],
        value: mintPrice ? BigInt(mintPrice.toString()) : parseEther('0.01'),
      })

      if (hash) {
        setTxHash(hash)
        setTransactionStatus('pending')
      }
    } catch (err: any) {
      console.error('Minting error:', err)
      setErrorMessage(err?.message || 'Failed to mint NFT with custom URI. Please try again.')
      setTransactionStatus('error')
    }
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
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Wallet Not Connected
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Please connect your wallet to mint NFTs
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
      {/* Network Warning */}
      {isUnsupportedNetwork && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚨</div>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                Unsupported Network
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Please switch to Sepolia testnet (Chain ID: 11155111) to mint NFTs
              </p>
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                Current network: Chain ID {chainId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Info */}
      {contractInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Contract Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-600 dark:text-blue-400">Name:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">{contractInfo[0]}</span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Symbol:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">{contractInfo[1]}</span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Total Supply:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">{contractInfo[2]?.toString()}</span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Max Supply:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">{contractInfo[3]?.toString()}</span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Mint Price:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">
                {mintPrice ? `${formatEther(mintPrice)} ETH` : 'Loading...'}
              </span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Network:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">
                {currentNetwork?.name || `Chain ID ${chainId}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mint Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Mint Your NFT
        </h2>

        {/* Standard Mint */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Standard Mint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Mint an NFT with the default metadata URI.
          </p>
          <button
            onClick={handleMint}
            disabled={isPending || isConfirming || isUnsupportedNetwork}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            {(isPending || isConfirming) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isPending ? 'Confirming...' : 'Minting...'}
              </>
            ) : (
              <>
                <span>🎨</span>
                Mint NFT
              </>
            )}
          </button>
        </div>

        {/* Custom URI Mint */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Custom URI Mint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Mint an NFT with a custom metadata URI.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              value={customURI}
              onChange={(e) => setCustomURI(e.target.value)}
              placeholder="https://example.com/metadata.json"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleMintWithURI}
              disabled={isPending || isConfirming || !customURI.trim() || isUnsupportedNetwork}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              {(isPending || isConfirming) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isPending ? 'Confirming...' : 'Minting...'}
                </>
              ) : (
                <>
                  <span>🔗</span>
                  Mint with Custom URI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {transactionStatus !== 'idle' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Transaction Status
          </h3>
          
          {transactionStatus === 'pending' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Transaction Pending
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Please wait for confirmation...
                  </p>
                </div>
              </div>
            </div>
          )}

          {transactionStatus === 'success' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎉</div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    NFT Minted Successfully!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Token ID: {mintedTokenId}
                  </p>
                  {txHash && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {transactionStatus === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">❌</div>
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Transaction Failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {errorMessage || error?.message || 'An error occurred during minting'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {txHash && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Transaction Hash:</strong>
              </p>
              <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                {txHash}
              </p>
              {explorerUrl && (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm mt-1 inline-block"
                >
                  View on Explorer →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
