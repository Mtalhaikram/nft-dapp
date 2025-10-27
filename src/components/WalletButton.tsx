'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200 font-medium">
            Wallet Connected! 🎉
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Connect Your Wallet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Connect your MetaMask wallet to start minting NFTs and interacting with the blockchain.
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                {connector.name === 'MetaMask' && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Connect {connector.name}
              </>
            )}
          </button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>Don&apos;t have MetaMask? <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Download it here</a></p>
      </div>
    </div>
  )
}
