'use client'

import React, { useState, useRef, useEffect } from 'react'
import { uploadNFTToIPFS, generateNFTMetadata } from '@/lib/ipfs'

interface IPFSUploaderProps {
  onMetadataUploaded?: (metadataUrl: string) => void
  onUploadComplete?: (data: { imageHash: string; metadataHash: string; imageUrl: string; metadataUrl: string }) => void
}

export function IPFSUploader({ onMetadataUploaded, onUploadComplete }: IPFSUploaderProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<{
    imageHash: string
    metadataHash: string
    imageUrl: string
    metadataUrl: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Form data
  const [nftName, setNftName] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [attributes, setAttributes] = useState<Array<{ trait_type: string; value: string }>>([])
  const [externalUrl, setExternalUrl] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Ensure component only runs on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB')
        return
      }

      setImageFile(file)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }])
  }

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index][field] = value
    setAttributes(updatedAttributes)
  }

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!imageFile) {
      setError('Please select an image file')
      return
    }

    if (!nftName.trim()) {
      setError('Please enter a name for your NFT')
      return
    }

    if (!nftDescription.trim()) {
      setError('Please enter a description for your NFT')
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Generate metadata
      const metadata = generateNFTMetadata(
        nftName,
        nftDescription,
        '', // Will be updated with actual IPFS URL
        attributes.filter(attr => attr.trait_type.trim() && attr.value.trim()),
        externalUrl || undefined,
        backgroundColor || undefined
      )

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Upload to IPFS
      const result = await uploadNFTToIPFS(imageFile, metadata)

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadResult(result)

      // Call callbacks
      if (onMetadataUploaded) {
        onMetadataUploaded(result.metadataUrl)
      }
      if (onUploadComplete) {
        onUploadComplete(result)
      }

    } catch (err: unknown) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload to IPFS')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setImageFile(null)
    setImagePreview(null)
    setNftName('')
    setNftDescription('')
    setAttributes([])
    setExternalUrl('')
    setBackgroundColor('')
    setUploadResult(null)
    setError(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading IPFS Uploader...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Upload NFT Metadata to IPFS
      </h2>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          NFT Image *
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs max-h-64 mx-auto rounded-lg"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {imageFile?.name} ({imageFile?.size ? (imageFile.size / 1024 / 1024).toFixed(2) : '0'} MB)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Click to upload an image or drag and drop
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Select Image
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Metadata Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            placeholder="My Awesome NFT"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
            placeholder="Describe your NFT..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            External URL
          </label>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>

        {/* Attributes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Attributes
            </label>
            <button
              onClick={addAttribute}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              + Add Attribute
            </button>
          </div>
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={attr.trait_type}
                onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                placeholder="Trait Type"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => removeAttribute(index)}
                className="text-red-500 hover:text-red-600 px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleUpload}
          disabled={isUploading || !imageFile || !nftName.trim() || !nftDescription.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <span>📤</span>
              Upload to IPFS
            </>
          )}
        </button>

        <button
          onClick={resetForm}
          disabled={isUploading}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">❌</div>
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">
                Upload Failed
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {uploadResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🎉</div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Upload Successful!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your NFT metadata has been uploaded to IPFS
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Image Hash:
              </p>
              <p className="font-mono text-xs text-green-700 dark:text-green-300 break-all">
                {uploadResult.imageHash}
              </p>
              <a
                href={uploadResult.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View Image →
              </a>
            </div>

            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Metadata Hash:
              </p>
              <p className="font-mono text-xs text-green-700 dark:text-green-300 break-all">
                {uploadResult.metadataHash}
              </p>
              <a
                href={uploadResult.metadataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View Metadata →
              </a>
            </div>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Use this URL for minting:</strong>
              </p>
              <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                {uploadResult.metadataUrl}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
