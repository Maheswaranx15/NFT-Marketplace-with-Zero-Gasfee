const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
require("@nomiclabs/hardhat-truffle5");



describe("NFT Marketplace", function () {
    var proxyinstance;
    var nft721instace;
    var nft1155instance;
    var tradeinstance;
    var tokenInstance;
    var factory721instance;
    var factory1155instance;
    const nonce_ownersignature = 1; 
    const nonce_ownersignature_1 = 2;
    const nonce_sellersignature = 3;
    const nonce_buyersignature_exe = 4;
    const amount = 1000;
    let qty = 1;
    var tokenId;
    var v;
    var r;
    var s;
    var v1;
    var s1;
    var r1;
    var sellersign_v;
    var sellersign_r;
    var sellersign_s;
    var v_buyer_exec;
    var r_buyer_exec;
    var s_buyer_exec;

    it("Should return the new greeting once it's changed", async function () {
      const [owner,user1,user2] = await ethers.getSigners();
      const nft721tokenName = "NexityNFT721";
      const nft721tokenSymbol = "NFT721";
      const nft1155tokenName = "NexityNFT721";
      const nft1155tokenSymbol = "NFT1155";
      const buyerFee = 25;
      const sellerFee  = 25;
      const tokenURIPrefix = "https://gateway.pinata.cloud/ipfs/";
      const Proxy = await ethers.getContractFactory("TransferProxy");
      proxyinstance = await Proxy.deploy();
      await proxyinstance.deployed();
      const NFT721 = await ethers.getContractFactory("ERC721");
      nft721instace = await NFT721.deploy(nft721tokenName,nft721tokenSymbol,tokenURIPrefix);
      await nft721instace.deployed();
      const NFT1155 = await ethers.getContractFactory("ERC1155");
      nft1155instance = await NFT1155.deploy(nft1155tokenName,nft1155tokenSymbol,tokenURIPrefix);
      await nft1155instance.deployed();
      const Trade = await ethers.getContractFactory("Trade");
      tradeinstance = await Trade.deploy(buyerFee,sellerFee,proxyinstance.address);
      await tradeinstance.deployed();
      await proxyinstance.changeOperator(tradeinstance.address)
      const Token = await ethers.getContractFactory("mockToken");
      tokenInstance = await Token.deploy(owner.address,"test","TET");
      await tokenInstance.deployed();
      const Factory721 = await hre.ethers.getContractFactory("Factory721");
      factory721instance = await Factory721.deploy(buyerFee,sellerFee,proxyinstance.address);
      await factory721instance.deployed();
      const Factory1155 = await hre.ethers.getContractFactory("Factory1155");
      factory1155instance = await Factory1155.deploy(buyerFee,sellerFee,proxyinstance.address);
      await factory1155instance.deployed();


      console.log("tokenInstance",tokenInstance.address)
      console.log("proxyinstance",proxyinstance.address)
      console.log("nft721instace",nft721instace.address)
      console.log("nft1155instance",nft1155instance.address)
      console.log("tradeinstance",tradeinstance.address)
      console.log("factory1155instance",factory1155instance.address)
      console.log("factory721instance",factory721instance.address)

    });
})