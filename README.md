# NFT-Marketplace-with-Zero-Gasfee - NFTMarketplace with Gasless Minting

1. An NFT marketplace is a digital platform for buying and selling NFTs. These platforms allow people to store and display their NFTs plus sell them to others for cryptocurrency or money. Some NFT marketplaces also allow users to mint their NFTs on the platform itself.  

2. The platform allows you to list NFTs without paying any gas fees. This is achieved by pushing the blockchain transaction forward to when someone purchases the token. But, when listing an NFT on OpenSea, the seller's MetaMask – or any other wallet – will trigger

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Constructor agruments"
```
