---

# 🌐 StackUp x Arbitrum Social Forum App

Welcome to the **StackUp x Arbitrum Social Forum App** – an innovative platform bridging communities through decentralized technology. This app leverages the power of StackUp and Arbitrum to create a vibrant, secure, and interactive space for community discussions, voting, and social engagement.

---

## 🌟 Hosted Application

Visit the hosted version of our Social Forum App [here](https://arbitrum-capstone-Bounty.vercel.app/) and experience the decentralized future firsthand!
---

## 📹 Demo Video

<a href="https://youtu.be/1nBSi-7rAMY">
   <img src="https://github.com/SinghShubhamkumarkrishnadev/arbitrum_capstone_Bounty/blob/main/videos.png" alt="video demo" width="400" height="300">
</a>

---

## ⚙️ Prerequisites

Before cloning and running this project, ensure you have:

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)
- **MetaMask** browser extension for interacting with the blockchain
- **Arbitrum One** testnet or mainnet wallet setup
- **RainbowKit** integration knowledge

---

## 📥 Cloning the Project

### 1. For the Backend

```bash
git clone https://github.com/SinghShubhamkumarkrishnadev/arbitrum_capstone_Bounty.git
curl -L https://foundry.paradigm.xyz | bash
foundryup
cd forum_dapp
forge build
```

- **Configure** your environment variables.
- Set Up Environment Variables
- Proceed to create a .env file in the forum_dpp directory.
- Next, add the following code snippet to the .env file.
  
```bash
# API KEY from Arbiscan
API_KEY="REPLACE WITH YOUR ARBISCAN API KEY"

# PRIVATE KEY from MetaMask
PRIVATE_KEY="REPLACE WITH YOUR WALLET PRIVATE KEY"
```

- Verify & Publish Forum Smart Contract:
- Load Environment Variables
- Navigate to the **forum_dapp** directory and run the following command.

```bash
source .env
```
- Next, deploy your Forum smart contract to the Arbitrum Sepolia network and verify it on Arbiscan Sepolia by running the following command:

```bash
forge create --rpc-url "arbitrumSepolia" --private-key "${PRIVATE_KEY}" --verifier-url "https://api-sepolia.arbiscan.io/api" -e "${API_KEY}" --verify src/Forum.sol:Forum
```
- Note Down the deployed contract address as we will need later.

### 2. For the Frontend
- From the root directory run the folllowing commands:
  
```bash
cd frontend
corepack enable
yarn install
yarn wagmi generate
```

- create a new file called .env.development.local at the root of the frontend directory. Inside this file, add the following code snippet.

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-project id"
NEXT_PUBLIC_ENABLE_TESTNETS="true"
NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS="your deployed contract addrress"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

- visit frontend/src/components/PostForm.tsx(line 94):
- replace the preset name with your uplaod preset name
  
```bash
formData.append("upload_preset", "your-preset-name"); //replace with your upload preset
```
- **Start** the frontend development server:

```bash
yarn dev
```
- Go and explore the app, try posting anything, and engage with communities!

---

## 🚀 Features

- **📝 Forum Discussions**: Seamlessly create, share, and interact with posts using a sleek user interface.
- **📊 Poll Integration**: Engage with posts by participating in polls directly embedded in the post content.
- **💬 Commenting System**: Add comments to posts, reply to existing comments, and participate in detailed discussions.
- **👍 Vote on Posts**: Upvote and downvote posts to contribute to community-driven content curation.
- **🔗 Social Sharing**: Effortlessly share posts across various platforms.
- **🖼️ Media Attachments**: Upload and display images and videos in posts, with automatic recognition of video file formats.
- **🌈 Wallet Connection**: Connect using RainbowKit and securely manage your account through MetaMask.
- **🎨 User-Friendly Design**: A well-structured, visually appealing interface with interactive elements like hover effects and smooth transitions.
- **🤝 Decentralized Identity**: Blockchain-based authentication and user identity management for a more secure experience.
- **📡 Real-Time Updates**: Utilizing efficient queries to display the latest posts, comments, and user interactions dynamically.

---
