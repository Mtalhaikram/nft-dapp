'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
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
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500/30 border-t-blue-500"></div>
          <span className="ml-4 text-gray-400">Loading IPFS Uploader...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white">
          Upload to IPFS
        </h2>
      </div>
      <p className="text-gray-400 text-sm">Upload your NFT image and metadata to IPFS for permanent decentralized storage</p>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3">
          NFT Image <span className="text-red-400">*</span>
        </label>
        <div className="relative border-2 border-dashed border-gray-600 hover:border-cyan-500/50 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer bg-black/20 backdrop-blur-sm group">
          {imagePreview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={300}
                  height={256}
                  className="max-w-xs max-h-64 mx-auto rounded-xl shadow-2xl border-2 border-white/10"
                  style={{ objectFit: 'contain' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-white/90 hover:bg-white text-gray-900 font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Change Image
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-mono">
                {imageFile?.name} ({imageFile?.size ? (imageFile.size / 1024 / 1024).toFixed(2) : '0'} MB)
              </p>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-300 font-semibold mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            placeholder="My Awesome NFT"
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
            placeholder="Describe your NFT..."
            rows={3}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            External URL
          </label>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Background Color
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-20 h-12 border border-white/10 rounded-xl cursor-pointer bg-black/30"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Attributes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-bold text-gray-300">
              Attributes
            </label>
            <button
              onClick={addAttribute}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Attribute
            </button>
          </div>
          {attributes.length > 0 ? (
            <div className="space-y-2">
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={attr.trait_type}
                    onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                    placeholder="Trait Type"
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  />
                  <button
                    onClick={() => removeAttribute(index)}
                    className="px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4 bg-black/20 rounded-xl border border-dashed border-gray-700">
              No attributes added yet
            </p>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          disabled={isUploading || !imageFile || !nftName.trim() || !nftDescription.trim()}
          className="flex-1 group relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:from-cyan-600 group-hover:to-blue-700"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400 to-blue-500 blur"></div>
          <span className="relative flex items-center justify-center gap-2">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Uploading... {uploadProgress}%</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload to IPFS
              </>
            )}
          </span>
        </button>

        <button
          onClick={resetForm}
          disabled={isUploading}
          className="px-6 py-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
        >
          Reset
        </button>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="relative overflow-hidden bg-black/30 rounded-full h-3 border border-white/10">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${uploadProgress}%` }}
          >
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-red-400 text-lg">
                Upload Failed
              </p>
              <p className="text-red-300/80 text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {uploadResult && (
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-400 text-lg">
                Upload Successful!
              </p>
              <p className="text-green-300/80 text-sm mt-1">
                Your NFT metadata has been uploaded to IPFS
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image Hash
              </p>
              <p className="font-mono text-xs text-gray-300 break-all mb-2">
                {uploadResult.imageHash}
              </p>
              <a
                href={uploadResult.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
              >
                View Image
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Metadata Hash
              </p>
              <p className="font-mono text-xs text-gray-300 break-all mb-2">
                {uploadResult.metadataHash}
              </p>
              <a
                href={uploadResult.metadataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
              >
                View Metadata
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
              <p className="text-sm text-cyan-400 font-bold mb-2">
                Use this URL for minting:
              </p>
              <p className="font-mono text-xs text-white break-all bg-black/30 p-3 rounded-lg">
                {uploadResult.metadataUrl}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
