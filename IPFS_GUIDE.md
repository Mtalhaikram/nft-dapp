# NFT Metadata Upload to IPFS Guide

This guide explains how to upload NFT metadata to IPFS using the integrated uploader in your NFT dApp.

## What is IPFS?

IPFS (InterPlanetary File System) is a distributed file system that provides a decentralized way to store and access files. It's perfect for NFT metadata because:

- **Decentralized**: No single point of failure
- **Immutable**: Content-addressed storage ensures data integrity
- **Cost-effective**: No ongoing hosting costs
- **Standard**: Widely adopted in the NFT ecosystem

## How to Use the IPFS Uploader

### 1. Access the Uploader

1. Connect your wallet to the dApp
2. Navigate to the minting section
3. Click "Upload to IPFS" button in the Custom URI Mint section

### 2. Upload Your NFT

1. **Select Image**: Choose an image file (PNG, JPG, GIF, etc.)
   - Maximum file size: 10MB
   - Supported formats: All image formats

2. **Fill Metadata**:
   - **Name**: The name of your NFT
   - **Description**: A detailed description
   - **External URL**: Optional link to your website/project
   - **Background Color**: Optional hex color code
   - **Attributes**: Add traits like rarity, properties, etc.

3. **Upload**: Click "Upload to IPFS" to upload both image and metadata

### 3. Mint Your NFT

After successful upload, the metadata URL will be automatically filled in the Custom URI field. Click "Mint with Custom URI" to create your NFT.

## Metadata Format

The uploader creates metadata following the [OpenSea metadata standard](https://docs.opensea.io/docs/metadata-standards):

```json
{
  "name": "My Awesome NFT",
  "description": "This is a description of my NFT",
  "image": "https://ipfs.io/ipfs/QmYourImageHash",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "trait_type": "Color",
      "value": "Blue"
    }
  ],
  "external_url": "https://mywebsite.com",
  "background_color": "000000"
}
```

## IPFS Gateways

Your uploaded content will be accessible through various IPFS gateways:

- `https://ipfs.io/ipfs/YOUR_HASH`
- `https://gateway.pinata.cloud/ipfs/YOUR_HASH`
- `https://cloudflare-ipfs.com/ipfs/YOUR_HASH`

## Best Practices

### Image Optimization
- Use appropriate file sizes (under 10MB)
- Consider using WebP format for better compression
- Maintain aspect ratios suitable for NFT marketplaces

### Metadata Quality
- Write compelling descriptions
- Use relevant attributes/traits
- Include external URLs for additional context
- Test your metadata URLs before minting

### IPFS Considerations
- Content is pinned by default but may need additional pinning services
- Consider using Pinata or other pinning services for long-term storage
- Test accessibility across different IPFS gateways

## Troubleshooting

### Upload Issues
- Check your internet connection
- Ensure image file is under 10MB
- Try different image formats if upload fails

### Metadata Not Loading
- Verify the IPFS URL is correct
- Check if the content is accessible through IPFS gateways
- Ensure metadata follows JSON format

### Minting Issues
- Verify you're on the correct network
- Ensure you have enough ETH for gas fees
- Check that the metadata URL is accessible

## Alternative IPFS Services

If the default IPFS client doesn't work, you can use:

1. **Pinata**: Professional IPFS pinning service
2. **Infura IPFS**: Enterprise-grade IPFS infrastructure
3. **Web3.Storage**: Simple IPFS storage for developers
4. **Fleek**: Decentralized hosting with IPFS

## Security Notes

- Always verify metadata URLs before minting
- Be cautious with external URLs in metadata
- Consider the permanence of IPFS content
- Keep backups of your original files

## Example Workflow

1. Create your NFT image (e.g., `my-nft.png`)
2. Prepare metadata details (name, description, attributes)
3. Use the IPFS uploader to upload both image and metadata
4. Copy the returned metadata URL
5. Use the Custom URI mint function with the IPFS URL
6. Your NFT is now minted with decentralized metadata!

This ensures your NFT metadata is stored in a decentralized, immutable way that's accessible to all NFT marketplaces and viewers.
