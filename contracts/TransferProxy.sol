// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/ITransferProxy.sol";

contract TransferProxy is Ownable, ITransferProxy {
    event operatorChanged(address indexed from, address indexed to);

    address public operator;

    modifier onlyOperator() {
        require(msg.sender == operator, "Invalid operator");
        _;
    }

    constructor()Ownable(msg.sender) {
        operator = msg.sender;
    }
    

    function changeOperator(address _operator)
        external
        onlyOwner
        returns (bool)
    {
        require(
            _operator != address(0),
            "Operator: new operator is the zero address"
        );
        operator = _operator;
        emit operatorChanged(address(0), operator);
        return true;
    }

    function erc721safeTransferFrom(
        IERC721 token,
        address from,
        address to,
        uint256 tokenId
    ) external override onlyOperator {
        token.safeTransferFrom(from, to, tokenId);
    }

    function erc1155safeTransferFrom(
        IERC1155 token,
        address from,
        address to,
        uint256 tokenId,
        uint256 value,
        bytes calldata data
    ) external override onlyOperator {
        token.safeTransferFrom(from, to, tokenId, value, data);
    }

    function mintAndSafe1155Transfer(
        ILazyMint token,
        address from,
        address to,
        string memory _tokenURI,
        uint96 _royaltyFee,
        uint256 supply,
        uint256 qty
    ) external override onlyOperator  {
        token.mintAndTransfer(from, to, _tokenURI, _royaltyFee, supply, qty);
    }

    function mintAndSafe721Transfer(
        ILazyMint token,
        address from,
        address to,
        string memory _tokenURI,
        uint96 _royaltyFee
    ) external override onlyOperator {
        token.mintAndTransfer(from, to, _tokenURI, _royaltyFee);
    }

    function erc20safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) external override onlyOperator {
        require(
            token.transferFrom(from, to, value),
            "failure while transferring"
        );
    }
}
