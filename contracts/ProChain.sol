// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ProChain is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;
    Counters.Counter public tokenSold;
    address payable owner;

    mapping(uint256 => TokenItem) public tokenItems;

    struct TokenItem {
        uint256 tokenId;
        uint256 tokenPrice;
        address payable seller;
        address payable owner;
        bool sold;
    }

    event CreateTokenItemEvent(
        uint256 tokenId,
        uint256 tokenPrice,
        address indexed seller,
        address indexed owner,
        bool sold
    );
    event MintNewTokenEvent(address indexed minter, uint256 tokenId);      

    constructor() ERC721("ProChain Solution", "PRS") {
        owner = payable(msg.sender);
    }

    // mint a new token 
    function mint(string memory _tokenUri, uint256 _tokenPrice) public payable {
        uint256 newId = tokenId.current();
        tokenId.increment();
        _safeMint(msg.sender, newId);
        _setTokenURI(newId, _tokenUri);

        // create token item
        tokenItems[newId] = TokenItem(
            newId,
            _tokenPrice,
            payable(msg.sender),
            payable(address(this)),
            false
        );

        // update frontend about new token minted
        emit CreateTokenItemEvent(
            newId,
            _tokenPrice,
            payable(msg.sender),
            payable(address(this)),
            false
        );
        
        // transfer token ownership to contract
        _transfer(msg.sender, address(this), newId);
        emit MintNewTokenEvent(msg.sender, newId);
    }

    // fetch all token items
    function fetchAllTokenItems() public view returns (TokenItem[] memory) {
        uint256 counter;
        uint256 totalTokenLength = tokenId.current();
        uint256 tokenBalance = totalTokenLength - tokenSold.current();
        TokenItem[] memory allItems = new TokenItem[](tokenBalance);

        for (uint256 id = 0; id < totalTokenLength; id++) {
            if (!tokenItems[id].sold) {
                allItems[counter] = tokenItems[id];
                counter++;
            }
        }

        return allItems;
    }    


}