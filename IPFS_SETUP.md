# IPFS Upload Setup Guide

## Current Status

The IPFS upload functionality has been fixed! By default, the app now uses **mock mode** which allows you to test the upload process without real IPFS credentials. Mock mode generates fake IPFS hashes that look like real ones, enabling you to test the complete NFT minting workflow.

## Using Mock Mode (Default)

**No setup required!** The app automatically uses mock mode when no IPFS credentials are configured. This means:

- ✅ Upload button works immediately
- ✅ You can test the complete upload process
- ✅ Generated hashes look like real IPFS hashes
- ⚠️ Hashes won't actually point to files on IPFS
- ⚠️ Files are not stored permanently

## Setting Up Real IPFS Upload

If you want to use real IPFS storage, you have two options:

### Option 1: Pinata (Recommended)

Pinata is a professional IPFS pinning service with a free tier.

1. Sign up at [Pinata](https://www.pinata.cloud)
2. Create an account and get your API keys
3. Create a `.env.local` file in the root of your project:
   ```bash
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
   NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
   ```
4. Restart your development server

### Option 2: Infura

Infura provides IPFS infrastructure for developers.

1. Sign up at [Infura](https://infura.io)
2. Create an IPFS project
3. Get your Project ID and Secret
4. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_project_id
   NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_project_secret
   ```
5. Restart your development server

## Environment Variables

Add these to your `.env.local` file (never commit this file to git):

```bash
# Enable mock mode explicitly (optional, default is automatic)
NEXT_PUBLIC_MOCK_IPFS=true

# Or use real IPFS with Pinata
NEXT_PUBLIC_PINATA_API_KEY=your_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_here

# Or use real IPFS with Infura
NEXT_PUBLIC_INFURA_PROJECT_ID=your_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_project_secret
```

## How It Works

The app tries to upload in this order:
1. If PINATA credentials exist → tries Pinata
2. If no credentials exist → uses mock mode (default for development)
3. If PINATA fails and INFURA credentials exist → tries Infura
4. Falls back to other public IPFS endpoints

## Testing Your Upload

1. Start your development server: `npm run dev`
2. Navigate to the app and connect your wallet
3. Click "Upload to IPFS"
4. Fill in the NFT metadata form
5. Select an image file
6. Click "Upload to IPFS"
7. You should see "Upload Successful!" message

## Troubleshooting

### Upload Still Failing?

- Check the browser console for detailed error messages
- Verify your image file is under 10MB
- Ensure you have an active internet connection
- Try clearing browser cache and reloading

### Using Real IPFS?

- Make sure your API keys are correct
- Check your IPFS service dashboard for usage limits
- Verify the credentials in your `.env.local` file
- Restart the development server after adding credentials

## Production Deployment

For production deployment:

1. **Set up real IPFS credentials** (Pinata recommended)
2. Add environment variables to your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site settings → Environment variables
   - Other platforms: Follow their documentation
3. **Never commit** `.env.local` to git
4. Restart your application after deploying

## Need Help?

- Check the browser console for detailed error messages
- Review the IPFS_GUIDE.md for more information
- Ensure your setup matches the configuration options above
