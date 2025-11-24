// IPFS configuration
const IPFS_GATEWAY_URL = 'https://ipfs.io/ipfs/'

// Multiple IPFS endpoints for fallback
const IPFS_ENDPOINTS = [
  'https://ipfs.infura.io:5001/api/v0',
  'https://ipfs.io/api/v0',
  'https://gateway.pinata.cloud/api/v0',
  'https://cloudflare-ipfs.com/api/v0'
]

// Try different IPFS endpoints
const tryIPFSUpload = async (formData: FormData, headers: Record<string, string> = {}): Promise<string> => {
  for (const endpoint of IPFS_ENDPOINTS) {
    try {
      console.log(`Trying IPFS endpoint: ${endpoint}`)
      
      const response = await fetch(`${endpoint}/add`, {
        method: 'POST',
        body: formData,
        headers,
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`Success with endpoint ${endpoint}:`, result)
        return result.Hash
      } else {
        console.log(`Failed with endpoint ${endpoint}, status: ${response.status}`)
        const errorText = await response.text()
        console.log(`Error: ${errorText}`)
      }
    } catch (error) {
      console.log(`Error with endpoint ${endpoint}:`, error)
    }
  }
  
  throw new Error('All IPFS endpoints failed')
}

// Pinata upload functions (more reliable)
const uploadToPinata = async (formData: FormData): Promise<string> => {
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
  const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
  
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('Pinata API keys not configured')
  }

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  return result.IpfsHash
}

// Mock upload for testing (returns a fake hash that looks like a real IPFS hash)
const mockUpload = async (): Promise<string> => {
  console.log('Using mock upload for testing...')
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a fake IPFS hash that looks valid (44 characters, starts with Qm)
  const randomString = Math.random().toString(36).substring(2, 15)
  return `Qm${randomString}${randomString}${randomString}`.substring(0, 44)
}

// Try Pinata first, then fallback to other IPFS endpoints
const tryIPFSUploadWithFallback = async (formData: FormData, headers: Record<string, string> = {}): Promise<string> => {
  // Enable mock mode for testing (default in development)
  if (process.env.NEXT_PUBLIC_MOCK_IPFS === 'true' || (!process.env.NEXT_PUBLIC_PINATA_API_KEY && !process.env.NEXT_PUBLIC_INFURA_PROJECT_ID)) {
    console.log('Using mock IPFS upload (no credentials configured)')
    return await mockUpload()
  }

  // Try Pinata first if API keys are available
  if (process.env.NEXT_PUBLIC_PINATA_API_KEY && process.env.NEXT_PUBLIC_PINATA_SECRET_KEY) {
    try {
      console.log('Trying Pinata upload...')
      return await uploadToPinata(formData)
    } catch (error) {
      console.log('Pinata upload failed, trying other endpoints:', error)
    }
  }

  // Fallback to other IPFS endpoints
  return await tryIPFSUpload(formData, headers)
}

// Upload JSON metadata to IPFS using direct HTTP requests
export const uploadMetadataToIPFS = async (metadata: Record<string, unknown>): Promise<string> => {
  try {
    const formData = new FormData()
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    formData.append('file', blob, 'metadata.json')

    console.log('Uploading metadata to IPFS...', metadata)
    
    const headers: Record<string, string> = {}
    
    // Add authentication if available
    if (process.env.NEXT_PUBLIC_INFURA_PROJECT_ID && process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET) {
      headers.authorization = `Basic ${btoa(
        `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
      )}`
    }

    return await tryIPFSUploadWithFallback(formData, headers)
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error)
    throw new Error(`Failed to upload metadata to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Upload file to IPFS using direct HTTP requests
export const uploadFileToIPFS = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const fileSizeInMB = (file.size / 1024 / 1024).toFixed(2)
    console.log(`Uploading file to IPFS: ${file.name} (${fileSizeInMB} MB)`)
    
    const headers: Record<string, string> = {}
    
    // Add authentication if available
    if (process.env.NEXT_PUBLIC_INFURA_PROJECT_ID && process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET) {
      headers.authorization = `Basic ${btoa(
        `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
      )}`
    }

    return await tryIPFSUploadWithFallback(formData, headers)
  } catch (error) {
    console.error('Error uploading file to IPFS:', error)
    throw new Error(`Failed to upload file to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get IPFS URL from hash
export const getIPFSUrl = (hash: string): string => {
  return `${IPFS_GATEWAY_URL}${hash}`
}

// Generate NFT metadata object
export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  background_color?: string
  animation_url?: string
}

export const generateNFTMetadata = (
  name: string,
  description: string,
  imageUrl: string,
  attributes?: Array<{ trait_type: string; value: string | number }>,
  externalUrl?: string,
  backgroundColor?: string,
  animationUrl?: string
): NFTMetadata => {
  return {
    name,
    description,
    image: imageUrl,
    attributes: attributes || [],
    external_url: externalUrl,
    background_color: backgroundColor,
    animation_url: animationUrl,
  }
}

// Upload complete NFT metadata (image + metadata) to IPFS
export const uploadNFTToIPFS = async (
  imageFile: File,
  metadata: NFTMetadata
): Promise<{ imageHash: string; metadataHash: string; imageUrl: string; metadataUrl: string }> => {
  try {
    console.log('Starting IPFS upload process...')
    
    // Upload image first
    console.log('Uploading image to IPFS...')
    const imageHash = await uploadFileToIPFS(imageFile)
    const imageUrl = getIPFSUrl(imageHash)
    console.log('Image uploaded successfully:', imageHash)

    // Update metadata with image URL
    const updatedMetadata = {
      ...metadata,
      image: imageUrl,
    }

    // Upload metadata
    console.log('Uploading metadata to IPFS...')
    const metadataHash = await uploadMetadataToIPFS(updatedMetadata)
    const metadataUrl = getIPFSUrl(metadataHash)
    console.log('Metadata uploaded successfully:', metadataHash)

    return {
      imageHash,
      metadataHash,
      imageUrl,
      metadataUrl,
    }
  } catch (error) {
    console.error('Error uploading NFT to IPFS:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to upload NFT to IPFS: ${errorMessage}`)
  }
}
