// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./common/ERC2981.sol";

contract OwnUser721Token is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    ERC721URIStorage,
    ERC2981,
    Ownable
{
    string private baseTokenURI;

    constructor(
        string memory name,
        string memory symbol,
        string memory _baseTokenURI
    ) ERC721(name, symbol)Ownable(msg.sender) {
        baseTokenURI = _baseTokenURI;
    }

    function baseURI() external view returns (string memory) {
        return _baseURI();
    }

    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mint(
        string memory _tokenURI,
        uint96 _royaltyFee
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = totalSupply();
        _mint(_msgSender(), tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _setTokenRoyalty(tokenId, _msgSender(), _royaltyFee);
        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

     function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
            public
            view
            override(ERC721, ERC721Enumerable, ERC721URIStorage,ERC2981)
            returns (bool)
        {
            return super.supportsInterface(interfaceId);
    }
}
