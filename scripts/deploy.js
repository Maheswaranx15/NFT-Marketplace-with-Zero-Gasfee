const hre = require("hardhat");
const fs = require("fs");
async function main() {

  const NFT721name = "ERC721";
  const NFT721symbol = "NFT721";
  const NFT1155name = "ERC1155";
  const NFT1155symbol = "NFT1155";
  const tokenURIPrefix = "https://gateway.pinata.cloud/ipfs/ "
  const buyerFee = 25;
  const sellerFee = 25;
  const ERC721 = await hre.ethers.getContractFactory("ERC721");
  const ERC1155 = await hre.ethers.getContractFactory("ERC1155");
  const Trade = await hre.ethers.getContractFactory("Trade");
  const Proxy = await hre.ethers.getContractFactory("TransferProxy");
  const Factory721 = await hre.ethers.getContractFactory("Factory721");
  const Factory1155 = await hre.ethers.getContractFactory("Factory1155");
  //proxy
  const proxy = await Proxy.deploy();
  await proxy.deployed();
  console.log("TransferProxy", proxy.address);
  const ProxyContestdata = {
    address: proxy.address,
    abi: JSON.parse(proxy.interface.format('json'))
  }
  fs.writeFileSync('./Proxy-abi.json', JSON.stringify(ProxyContestdata))
  // NFT721
  const erc721 = await ERC721.deploy(NFT721name,NFT721symbol,tokenURIPrefix);
  await erc721.deployed();
  console.log("ERC721", erc721.address);
  const ERC721Contestdata = {
    address: erc721.address,
    abi: JSON.parse(erc721.interface.format('json'))
  }
  fs.writeFileSync('./erc721-abi.json', JSON.stringify(ERC721Contestdata))
  // NFT1155
  const erc1155 = await ERC1155.deploy(NFT1155name,NFT1155symbol,tokenURIPrefix);
  await erc1155.deployed();
  console.log("ERC1155", nebula1155.address);
  const ERC1155Contestdata = {
    address: erc1155.address,
    abi: JSON.parse(erc1155.interface.format('json'))
  }
  fs.writeFileSync('./ERC1155-abi.json', JSON.stringify(ERC1155Contestdata))
  // trade
  const trade = await Trade.deploy(buyerFee,sellerFee,proxy.address);
  await trade.deployed();
  console.log("trade deployed to:", trade.address);
  await proxy.changeOperator(trade.address)
  const TradeContestdata = {
    address: trade.address,
    abi: JSON.parse(trade.interface.format('json'))
  }
  fs.writeFileSync('./trade-abi.json', JSON.stringify(TradeContestdata))
  // Factory721
  const factory721 = await Factory721.deploy()
  await factory721.deployed();
  console.log(`factory721`,factory721.address);
  const Factory721Contestdata = {
    address: factory721.address,
    abi: JSON.parse(factory721.interface.format('json'))
  }
  fs.writeFileSync('./factory721-abi.json', JSON.stringify(Factory721Contestdata))
  // Factory1155
  const factory1155 = await Factory1155.deploy()
  await factory1155.deployed()
  console.log(`factory1155:`,factory1155.address);
  const Factory1155Contestdata = {
    address: factory1155.address,
    abi: JSON.parse(factory1155.interface.format('json'))
  }
  fs.writeFileSync('./factory1155-abi.json', JSON.stringify(Factory1155Contestdata))
  let nft721Address = '/Deployed contract address/'
  let nft1155Address = '/Deployed contract address/'
  let tradeAddress =  '/Deployed contract address/' 
  let factory1155Address = '/Deployed contract address/' 
  let factory721Address = '/Deployed contract address/'
  let proxyAddress = '/Deployed contract address/'
  
  // VERIFY
  //proxy
   await hre.run("verify:verify", {
    address: proxyAddress,
  });
  //Factory721
  await hre.run("verify:verify", {
    address: factory721Address,
  });
  
  // Factory1155
  await hre.run("verify:verify", {
    address: factory1155Address,
  });
  // NFT721
  await hre.run("verify:verify", {
    address: nft721Address,
    constructorArguments: [NFT721name,NFT721symbol,tokenURIPrefix],
  });
  // NFT1155
  await hre.run("verify:verify", {
    address: nft1155Address,
    constructorArguments: [NFT1155name,NFT1155symbol,tokenURIPrefix],
  });
  //trade
  await hre.run("verify:verify", {
    address: tradeAddress,
    constructorArguments: [sellerFee,sellerFee,proxyAddress],
  });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});