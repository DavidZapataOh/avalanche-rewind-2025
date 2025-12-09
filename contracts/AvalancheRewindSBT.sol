// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AvalancheRewind2025
 * @dev Soulbound Token for Avalanche Rewind 2025
 * 
 * Features:
 * - Non-transferable (Soulbound)
 * - ONE mint per wallet, period
 * - 2025 only - no year parameter needed
 */
contract AvalancheRewind2025 is ERC721, ERC721URIStorage, Ownable {
    // Token ID counter
    uint256 private _nextTokenId;

    // Track which wallets have minted
    mapping(address => bool) public hasMinted;

    // Events
    event RewindMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    // Custom errors
    error AlreadyMinted();
    error SoulboundTokenCannotBeTransferred();

    constructor() ERC721("Avalanche Rewind 2025", "REWIND2025") Ownable(msg.sender) {}

    /**
     * @dev Mint your Rewind 2025 NFT
     * @param to Address to mint to
     * @param uri The token URI pointing to IPFS metadata
     */
    function mint(address to, string memory uri) external returns (uint256) {
        // One mint per wallet, period
        if (hasMinted[to]) revert AlreadyMinted();

        // Mark as minted
        hasMinted[to] = true;

        // Mint the token
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit RewindMinted(to, tokenId, uri);

        return tokenId;
    }

    /**
     * @dev Check if a wallet can still mint
     */
    function canMint(address wallet) external view returns (bool) {
        return !hasMinted[wallet];
    }

    /**
     * @dev Get total minted count
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // ============ SOULBOUND OVERRIDES ============

    /**
     * @dev Prevent transfers - makes token soulbound
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting and burning only
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenCannotBeTransferred();
        }

        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert SoulboundTokenCannotBeTransferred();
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert SoulboundTokenCannotBeTransferred();
    }

    // ============ REQUIRED OVERRIDES ============

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
