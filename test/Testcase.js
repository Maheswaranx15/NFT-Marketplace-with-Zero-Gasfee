const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-truffle5");

describe("NFT Marketplace", async function () {
  var proxyinstance;
  var nft721instace;
  var nft1155instance;
  var tradeinstance;
  var tokenInstance;
  var factory721instance;
  var factory1155instance;
  const nonce_ownersignature = 1; 
  const nonce_sellersignature = 3;
  const amount = 1000;
  let qty = 1;
  var tokenId;
  var v;
  var r;
  var s;

  it("Should deploy contracts and print their addresses", async function () {
    try {
      const [owner, user1, user2] = await ethers.getSigners();
      const nft721tokenName = "NexityNFT721";
      const nft721tokenSymbol = "NFT721";
      const nft1155tokenName = "NexityNFT1155";
      const nft1155tokenSymbol = "NFT1155";
      const buyerFee = 25;
      const sellerFee = 25;
      const tokenURIPrefix = "https://gateway.pinata.cloud/ipfs/";

      const Proxy = await ethers.getContractFactory("TransferProxy");
      proxyinstance = await Proxy.deploy();
      await proxyinstance.deployed();

      const NFT721 = await ethers.getContractFactory("LazyMintSingle");
      nft721instace = await NFT721.deploy(nft721tokenName, nft721tokenSymbol, tokenURIPrefix);
      await nft721instace.deployed();

      const NFT1155 = await ethers.getContractFactory("LazyMintMultiple");
      nft1155instance = await NFT1155.deploy(nft1155tokenName, nft1155tokenSymbol, tokenURIPrefix);
      await nft1155instance.deployed();

      const Trade = await ethers.getContractFactory("Trade");
      tradeinstance = await Trade.deploy(buyerFee, sellerFee, proxyinstance.address);
      await tradeinstance.deployed();

      await proxyinstance.changeOperator(tradeinstance.address);

      const Token = await ethers.getContractFactory("Token_ERC20");
      tokenInstance = await Token.deploy(owner.address, "test", "TET");
      await tokenInstance.deployed();

      // const Factory721 = await ethers.getContractFactory("Factory721");
      // factory721instance = await Factory721.deploy(buyerFee, sellerFee, proxyinstance.address);
      // await factory721instance.deployed();
      // const Factory1155 = await ethers.getContractFactory("Factory1155");
      // factory1155instance = await Factory1155.deploy(buyerFee, sellerFee, proxyinstance.address);
      // await factory1155instance.deployed();

      console.log("tokenInstance", tokenInstance.address);
      console.log("proxyinstance", proxyinstance.address);
      console.log("nft721instace", nft721instace.address);
      console.log("nft1155instance", nft1155instance.address);
      console.log("tradeinstance", tradeinstance.address);
   
      
    } catch (error) {
      console.error("Error deploying contracts:", error);
      throw error; // Rethrow the error to fail the test case
    }
  });

  it(`setApproval Functionality for erc721`,async()=>{
    const [owner,user1,user2] = await ethers.getSigners();
    await nft721instace.connect(user1).setApprovalForAll(proxyinstance.address, true)
  })

  it(`OwnerSignature`,async()=> {
    const [owner,user1,user2] = await ethers.getSigners();
    const uri = "sample1";
    var tokenhash = ethers.utils.solidityKeccak256(["address", "address", "string", "uint256"], [nft721instace.address, user1.address, uri, nonce_ownersignature]);
    var arrayify =  ethers.utils.arrayify(tokenhash);
    var tokensignature = await owner.signMessage(arrayify);
    var splitSign = ethers.utils.splitSignature(tokensignature)
    v = splitSign.v
    r = splitSign.r
    s = splitSign.s
    
  })

  it(`Mint functionality`,async()=>{
    const [owner,user1,user2] = await ethers.getSigners();
    const uri = "sample1";
    const royaltyfee = 5
    let mint = await nft721instace.connect(user1).mint(uri, royaltyfee, [v,r,s,nonce_ownersignature])
    let mint_wait = await mint.wait()
    let from_address = mint_wait.events[0].args[0];
    let to_address = mint_wait.events[0].args[1];
    tokenId = mint_wait.events[0].args[2];
  })


  it(`Transfer Function`,async()=>{
    const [owner,user1,user2] = await ethers.getSigners();
    let to_address = user2.address
    let amount = 1025
    await tokenInstance.connect(owner).transfer(to_address,amount)
    await tokenInstance.connect(user2).approve(proxyinstance.address,amount)
  })

  it(`Seller sign for buyAsset`,async()=>{
    const [owner,user1,user2] = await ethers.getSigners();
    const uri = "sample1";
    let amount = 1025
    let tokenId = 0;
    console.log("NFT address",nft721instace.address)
    console.log("tokenId",tokenId)
    console.log("token",tokenInstance.address)
    console.log("nounce amount",amount, nonce_sellersignature)
    var tokenhash = ethers.utils.solidityKeccak256(["address", "uint256", "address", "uint256", "uint256"], [nft721instace.address, tokenId, tokenInstance.address, amount, nonce_sellersignature]);
    var arrayify =  ethers.utils.arrayify(tokenhash);
    var tokensignature = await user1.signMessage(arrayify);
    var splitSign = ethers.utils.splitSignature(tokensignature)
    sellersign_v = splitSign.v
    sellersign_r = splitSign.r
    sellersign_s = splitSign.s
  })

  it(`Buying Asset by the User`,async()=>{
    const [owner,user1,user2] = await ethers.getSigners();
    let seller = user1.address
    let buyer = user2.address
    let erc20Address = tokenInstance.address
    let nftAddress = nft721instace.address
    let nftType = 1
    let unitPrice = 1000
    let amount = 1025
    let tokenId = 0
    let supply = 1
    let qty = 1
    let assest = await tradeinstance.getFees([seller,buyer,erc20Address,nftAddress,nftType,unitPrice,0,amount,tokenId,"sample1",supply,5,qty])
  
    console.log("asset",parseInt(assest[0]))
    console.log("asset",parseInt(assest[1]))
    console.log("asset",parseInt(assest[2]))
    console.log("asset",parseInt(assest[3]))
    console.log("asset",(assest[4]))

    // await tradeinstance.connect(user2).buyAsset([seller,buyer,erc20Address,nftAddress,nftType,unitPrice,0,amount,tokenId,"sample1",supply,5,qty],[sellersign_v,sellersign_r,sellersign_s,nonce_sellersignature])
  })

  it(`OwnerSignature`,async()=> {
    const [owner,user1,user2] = await ethers.getSigners();
    const uri = "sample1";
    var tokenhash = ethers.utils.solidityKeccak256(["address", "address", "string", "uint256"], [nft721instace.address, user1.address, uri, 5]);
    var arrayify =  ethers.utils.arrayify(tokenhash);
    var tokensignature = await owner.signMessage(arrayify);
    var splitSign = ethers.utils.splitSignature(tokensignature)
    v = splitSign.v
    r = splitSign.r
    s = splitSign.s
  })

  it(`Mint functionality`,async()=>{
    const [owner,user1,user2] = await ethers.getSigners();
    const uri = "sample1";
    const royaltyfee = 5
    let mint = await nft721instace.connect(user1).mint(uri, royaltyfee, [v,r,s,5])
    let mint_wait = await mint.wait()
    let from_address = mint_wait.events[0].args[0];
    let to_address = mint_wait.events[0].args[1];
    tokenId = mint_wait.events[0].args[2];
  })

});
