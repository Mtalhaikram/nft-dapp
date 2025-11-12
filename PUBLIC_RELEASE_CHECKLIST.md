# 📋 Public Release Checklist

Use this checklist before making your repository public to ensure all sensitive information is removed.

## 🔒 Security & Privacy

### Remove Sensitive Files
- [ ] Delete `DEPLOYMENT_INFO.md` (or add to .gitignore)
- [ ] Delete any files with actual wallet addresses
- [ ] Delete any files with private keys or API keys
- [ ] Remove all `.env` files except `env.example`
- [ ] Check for hardcoded contract addresses in code

### Verify .gitignore
- [ ] `.env*` files are ignored (except `env.example`)
- [ ] `DEPLOYMENT_INFO.md` is ignored
- [ ] `node_modules/` is ignored
- [ ] Build artifacts are ignored
- [ ] `.DS_Store` and OS files are ignored

### Review Code
- [ ] No hardcoded private keys anywhere
- [ ] No hardcoded wallet addresses (except examples)
- [ ] No hardcoded API keys
- [ ] All sensitive config uses environment variables
- [ ] Contract addresses read from `.env.local`

### Git History
⚠️ **IMPORTANT**: Check if sensitive data was ever committed

```bash
# Search git history for potential secrets
git log --all --full-history --source -- .env
git log --all --full-history --source -- DEPLOYMENT_INFO.md

# If found, you may need to:
# 1. Remove from history using git-filter-repo or BFG Repo-Cleaner
# 2. Regenerate all exposed keys/secrets
# 3. Redeploy contracts if addresses were exposed
```

## 📝 Documentation

### README.md
- [ ] Project title is clear and descriptive
- [ ] Features section is complete
- [ ] Installation instructions are clear
- [ ] Environment variables are documented
- [ ] Usage examples are included
- [ ] Screenshots/demo link are added (optional)
- [ ] License information is included
- [ ] Contact information is updated
- [ ] Replace placeholder links with actual URLs
- [ ] Update GitHub username/repo name

### Other Documentation
- [ ] `SETUP.md` is complete
- [ ] `CONTRIBUTING.md` is included
- [ ] `SECURITY.md` is included
- [ ] `LICENSE` file is included
- [ ] `env.example` is up to date

### Replace Placeholders
Search and replace these in all documentation:
- [x] `yourusername` → Mtalhaikram ✓
- [x] `your.email@example.com` → talhaikramweb3@gmail.com ✓
- [x] Twitter references → Removed ✓
- [ ] `https://your-demo.vercel.app` → actual demo URL (optional)
- [ ] `YOUR_CONTRACT` → remove or use placeholder text
- [x] `[Your Name]` → Talha Ikram ✓

## 🧹 Code Quality

### Clean Up
- [ ] Remove unused dependencies
- [ ] Remove commented-out code
- [ ] Remove debug console.logs (or keep minimal)
- [ ] Remove TODO comments or convert to issues
- [ ] Format code consistently

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run linter
npm run lint

# Build to check for errors
npm run build
```

### Testing
- [ ] All tests pass: `npx hardhat test`
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Build completes successfully
- [ ] App runs without errors locally

## 📦 Repository Setup

### GitHub Settings
- [ ] Repository name is descriptive
- [ ] Repository description is clear
- [ ] Topics/tags are added (web3, nft, ethereum, nextjs, etc.)
- [ ] Website URL is added (if deployed)
- [ ] License is selected (MIT recommended)
- [ ] Issues are enabled
- [ ] Wiki is enabled (optional)
- [ ] Discussions are enabled (optional)

### Branch Protection
- [ ] Protect main branch
- [ ] Require PR reviews (optional)
- [ ] Require status checks (optional)

### Files in Repository Root
- [ ] `README.md` ✓
- [ ] `LICENSE` ✓
- [ ] `CONTRIBUTING.md` ✓
- [ ] `SECURITY.md` ✓
- [ ] `SETUP.md` ✓
- [ ] `env.example` ✓
- [ ] `.gitignore` ✓
- [ ] `package.json` ✓

## 🚀 Before Publishing

### Final Checks
- [ ] All TODOs in this checklist are complete
- [ ] Create a fresh clone and test setup
- [ ] Verify `env.example` has all needed variables
- [ ] Test installation from scratch following README
- [ ] Review all markdown files for typos
- [ ] Check all links work

### Test Fresh Installation
```bash
# In a different directory
git clone https://github.com/yourusername/nft-dapp.git test-install
cd test-install
npm install
cp env.example .env.local
# Edit .env.local with test values
npm run compile
npm run dev
```

### Create Initial Release (Optional)
- [ ] Tag version: `git tag v1.0.0`
- [ ] Push tags: `git push --tags`
- [ ] Create GitHub release with changelog
- [ ] Add release notes

## 📢 After Publishing

### Announce
- [ ] Share on Twitter/X
- [ ] Post on relevant Discord servers
- [ ] Share on Reddit (r/ethdev, r/ethereum)
- [ ] Add to awesome lists (optional)
- [ ] Write a blog post (optional)

### Monitor
- [ ] Watch for issues
- [ ] Respond to questions
- [ ] Review pull requests
- [ ] Update documentation based on feedback

### Maintenance
- [ ] Set up dependabot for security updates
- [ ] Plan regular dependency updates
- [ ] Monitor gas costs on mainnet
- [ ] Keep documentation up to date

## ⚠️ Emergency Procedures

If sensitive data was accidentally committed:

### 1. Immediate Actions
```bash
# Remove the sensitive commit (if not pushed)
git reset --hard HEAD~1

# If already pushed, rewrite history (⚠️ DANGEROUS)
# This will break anyone who has cloned the repo
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (⚠️ will rewrite history)
git push origin --force --all
git push origin --force --tags
```

### 2. Rotate All Exposed Secrets
- [ ] Generate new API keys
- [ ] Create new wallet for deployment
- [ ] Redeploy contracts if address was exposed
- [ ] Update all services with new credentials

### 3. Notify Users
- [ ] Create security advisory on GitHub
- [ ] Notify users via Discord/Twitter
- [ ] Document the incident
- [ ] Learn from the mistake

## ✅ Final Sign-Off

- [ ] I have reviewed all files in the repository
- [ ] I have searched for any hardcoded secrets
- [ ] I have tested the installation process
- [ ] I have verified all documentation is accurate
- [ ] I am confident this repository is safe to make public

**Ready to publish?** Make your repository public:
1. Go to Settings → General → Danger Zone
2. Click "Change visibility"
3. Select "Public"
4. Confirm by typing the repository name

---

## 🎉 Congratulations!

Your NFT dApp is now ready for the world to see!

Remember:
- Respond to issues promptly
- Be welcoming to contributors
- Keep dependencies updated
- Share your project with the community

Good luck! 🚀

