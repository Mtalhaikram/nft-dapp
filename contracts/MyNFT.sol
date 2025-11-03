// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Maximum supply
    uint256 public constant MAX_SUPPLY = 1000;
    
    // Mint price (in wei)
    uint256 public mintPrice = 0.01 ether;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    
    constructor(string memory baseURI) ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }
    
    // Mint function - the main function to be called
    function mint() public payable returns (uint256) {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(msg.sender, tokenId);
        
        emit NFTMinted(msg.sender, tokenId, tokenURI(tokenId));
        
        return tokenId;
    }
    
    // Mint with custom URI
    function mintWithURI(string memory customURI) public payable returns (uint256) {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(msg.sender, tokenId);
        
        emit NFTMinted(msg.sender, tokenId, customURI);
        
        return tokenId;
    }
    
    // Get total supply
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Get current token ID
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Set base URI (only owner)
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    // Set mint price (only owner)
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }
    
    // Withdraw funds (only owner)
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
    }
    
    // Override tokenURI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), ".json"));
    }
    
    // Get contract info
    function getContractInfo() public view returns (
        string memory nftName,
        string memory nftSymbol,
        uint256 totalSupply_,
        uint256 maxSupply,
        uint256 currentPrice
    ) {
        return (
            name(),
            symbol(),
            totalSupply(),
            MAX_SUPPLY,
            mintPrice
        );
    }
}
