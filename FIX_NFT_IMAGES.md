# 🖼️ Fix NFT Images - Complete Guide

## 🔍 Problem: Why Images Show "No Image"

Your NFTs are displaying "No Image" because the app is currently using **mock IPFS hashes**. This happens when no IPFS API credentials are configured. Mock hashes look like real IPFS addresses but don't actually point to any files.

## 🎯 Solution: Set Up Real IPFS Uploads

You have 3 options to fix this:

### ✅ Option 1: Use Pinata (Recommended - Easiest)

Pinata is the easiest and most reliable IPFS service.

1. **Sign up for free**: Go to [https://www.pinata.cloud/](https://www.pinata.cloud/)
2. **Get API Keys**:
   - After signing in, go to "API Keys" in your dashboard
   - Click "New Key"
   - Enable all permissions
   - Give it a name (e.g., "NFT dApp")
   - Copy the **API Key** and **API Secret**

3. **Configure your app**:
   ```bash
   # Create .env.local file in your project root
   cp .env.example .env.local
   ```

4. **Add your keys to `.env.local`**:
   ```env
   NEXT_PUBLIC_PINATA_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_PINATA_SECRET_KEY=your_actual_secret_key_here
   ```

5. **Restart your development server**:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

### ✅ Option 2: Use Infura IPFS

1. **Sign up for free**: Go to [https://www.infura.io/](https://www.infura.io/)
2. **Create IPFS project**:
   - After signing in, click "Create New Key"
   - Select "IPFS" as the network
   - Copy your **Project ID** and **API Secret**

3. **Add to `.env.local`**:
   ```env
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_api_secret_here
   ```

4. **Restart your dev server**

### ⚠️ Option 3: Use Test Images (For Development Only)

If you just want to test without setting up IPFS, you can use direct HTTP image URLs:

1. Upload your image to any image hosting service (Imgur, CloudFlare, etc.)
2. When minting, use the direct image URL instead of uploading to IPFS
3. In the "Custom URI Mint" section, provide a URL to your metadata JSON file

## 🧪 Debug Your NFTs

I've added an **NFT Debugger** component to your app. Use it to:

1. **Check what's stored in your NFTs**:
   - Scroll down to the "NFT Debugger" section on the main page
   - Enter a token ID (e.g., "1")
   - Click "Debug"

2. **What to look for**:
   - ✅ **IPFS URI detected**: Good - your NFT has an IPFS reference
   - ⚠️ **Mock hash warning**: Your NFT is using a fake hash (images won't load)
   - ❌ **Failed to fetch metadata**: The metadata file doesn't exist or is inaccessible
   - 🖼️ **Image Preview**: If shown, your image is working!

## 📋 Step-by-Step: Mint a New NFT with Real Images

Once you've configured IPFS credentials:

1. **Connect your wallet**
2. **Go to the mint section**
3. **Click "Upload to IPFS"** button
4. **Fill in the form**:
   - Select an image file
   - Enter name and description
   - (Optional) Add attributes
5. **Click "Upload to IPFS"**
6. **Wait for upload to complete** (you'll see progress)
7. **Click "Mint with Custom URI"**
8. **Confirm the transaction** in your wallet
9. **Wait for confirmation**
10. **Refresh the page** - your NFT should now display with the image!

## 🔧 Troubleshooting

### Images still not showing after configuration?

1. **Check browser console** (F12 or Cmd+Option+I):
   - Look for error messages
   - Check if IPFS URLs are being fetched
   - See if images are loading

2. **Use the NFT Debugger**:
   - Verify the token URI is a real IPFS hash
   - Check if metadata is fetching successfully
   - Test if the image URL loads

3. **Verify your API keys**:
   - Make sure you copied them correctly
   - Check there are no extra spaces
   - Ensure the file is named `.env.local` (not `.env.local.txt`)

4. **Restart your server**:
   ```bash
   # Kill the server and restart
   npm run dev
   ```

5. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### For existing NFTs with mock hashes

Unfortunately, NFTs that were already minted with mock IPFS hashes **cannot be fixed** because the metadata is permanently stored on the blockchain. You have two options:

1. **Mint new NFTs** with proper IPFS configuration
2. **Transfer existing NFTs** to another address and mint new ones

## 🎨 What Changed to Fix Image Display

I've improved the image loading system:

1. **Multiple IPFS gateways** - If one fails, automatically tries others:
   - Cloudflare IPFS (primary)
   - ipfs.io
   - Pinata gateway
   - dweb.link

2. **Better error handling** - Shows detailed errors in console

3. **Smart URL conversion** - Handles all IPFS URL formats:
   - `ipfs://QmHash...`
   - `ipfs/QmHash...`
   - `https://ipfs.io/ipfs/QmHash...`

4. **Loading indicators** - Shows which gateway is being tried

5. **Debug tools** - New debugger component to diagnose issues

## 📞 Still Having Issues?

Check the browser console for detailed error messages. The app now logs:
- ✅ When images load successfully
- ❌ When images fail (with URL)
- 🔄 Which gateway is being tried
- 📊 Metadata fetch status

All console messages are prefixed with emojis for easy filtering!

