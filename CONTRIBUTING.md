# Contributing to NFT Marketplace dApp

Thank you for your interest in contributing to this project! We welcome contributions from the community.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

- **Clear title** - Describe the issue concisely
- **Description** - Detailed explanation of the bug
- **Steps to reproduce** - How to replicate the issue
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Screenshots** - If applicable
- **Environment** - Browser, OS, Node version, etc.

### Suggesting Features

Feature requests are welcome! Please create an issue with:

- **Feature description** - What you'd like to see
- **Use case** - Why this feature would be useful
- **Proposed implementation** - Your ideas on how it could work
- **Alternatives considered** - Other solutions you've thought about

### Pull Requests

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/nft-dapp.git
cd nft-dapp
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
- Follow the existing code style
- Write clear, commented code
- Update documentation if needed
- Add tests if applicable

4. **Test your changes**
```bash
# Run linter
npm run lint

# Test the build
npm run build

# Test smart contracts (if modified)
npx hardhat test
```

5. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

6. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

7. **Open a Pull Request**
- Provide a clear title and description
- Reference any related issues
- Include screenshots/videos if UI changes
- Wait for review and address feedback

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for type safety
- **ESLint**: Follow the project's ESLint configuration
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming**:
  - Components: PascalCase (`MyComponent.tsx`)
  - Functions: camelCase (`handleClick`)
  - Constants: UPPER_SNAKE_CASE (`CONTRACT_ADDRESS`)

### Component Guidelines

```typescript
// ✅ Good
'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

export function MyComponent() {
  const { address } = useAccount()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="...">
      {/* Component content */}
    </div>
  )
}

// ❌ Avoid
export default function myComponent() {
  // Missing 'use client' directive
  // Inconsistent naming
}
```

### Smart Contract Guidelines

- Use OpenZeppelin libraries when possible
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Write comprehensive tests
- Add NatSpec comments
- Consider gas optimization

### Git Workflow

1. Always create a new branch for your work
2. Keep commits atomic and focused
3. Write meaningful commit messages
4. Rebase on main before submitting PR
5. Squash commits if needed

## 🧪 Testing

### Frontend Testing

```bash
# Run linter
npm run lint

# Build the project
npm run build

# Test locally
npm run dev
```

### Smart Contract Testing

```bash
# Compile contracts
npm run compile

# Run tests
npx hardhat test

# Run with coverage
npx hardhat coverage

# Run specific test
npx hardhat test test/MyNFT.test.js
```

### Manual Testing Checklist

- [ ] Wallet connection works
- [ ] Minting NFT succeeds
- [ ] NFT display works correctly
- [ ] Transfer functionality works
- [ ] IPFS upload works (if implemented)
- [ ] Error handling works properly
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] All animations work smoothly

## 📝 Documentation

When adding new features:

- Update README.md if needed
- Add inline code comments
- Document new environment variables
- Update SETUP.md for deployment changes
- Add JSDoc comments for complex functions

Example:
```typescript
/**
 * Uploads an NFT image and metadata to IPFS
 * @param imageFile - The image file to upload
 * @param metadata - NFT metadata object
 * @returns Object containing IPFS hashes and URLs
 */
export async function uploadNFTToIPFS(
  imageFile: File,
  metadata: NFTMetadata
): Promise<UploadResult> {
  // Implementation
}
```

## 🔒 Security

### Security Considerations

- Never commit private keys or secrets
- Use environment variables for sensitive data
- Validate user inputs
- Handle errors gracefully
- Use secure dependencies
- Follow smart contract best practices

### Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Email security concerns to: security@yourproject.com
3. Provide detailed information about the vulnerability
4. Wait for a response before disclosing publicly

## 🎨 UI/UX Guidelines

- Follow the existing design system
- Use Tailwind CSS utility classes
- Maintain consistency with current UI
- Ensure responsive design
- Add loading states
- Provide clear error messages
- Include smooth animations

## 📦 Dependencies

When adding new dependencies:

1. Ensure they're necessary
2. Check license compatibility (MIT preferred)
3. Verify package is actively maintained
4. Consider bundle size impact
5. Document why it's needed

## 🚀 Release Process

Releases are handled by project maintainers:

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create GitHub release
4. Deploy to production (if applicable)

## ❓ Questions?

- Create an issue for general questions
- Join our Discord for real-time chat
- Check existing issues and documentation first

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow community guidelines

## 🙏 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Credited in commit history

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to make this project better! 🎉

