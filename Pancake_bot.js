require('dotenv').config();
const { ethers } = require('ethers');

// Set up the provider and wallet
const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// PancakeSwap Router contract details
const PANCAKESWAP_ROUTER_ADDRESS = process.env.PANCAKESWAP_ROUTER_ADDRESS;
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'; // Correct USDT contract address on BSC
const YOUR_TOKEN_ADDRESS = '0xbF12f69C24E46E5fDe275AA6a10c63603f7d0bf8'; // Your token contract address

// Load PancakeSwap Router ABI
const pancakeRouterAbi = require('./PancakeRouter.json').abi; // Load the ABI file

// Create a contract instance
const pancakeRouter = new ethers.Contract(PANCAKESWAP_ROUTER_ADDRESS, pancakeRouterAbi, wallet);

const usdtContract = new ethers.Contract(USDT_ADDRESS, [
    "function approve(address spender, uint256 amount) public returns (bool)"
], wallet);

async function approveSpending() {
    const amount = ethers.utils.parseUnits('1', 'ether'); // Approving 1 USDT for spending, adjust as needed
    const tx = await usdtContract.approve(PANCAKESWAP_ROUTER_ADDRESS, amount);
    await tx.wait();
    console.log('USDT approval transaction successful!');
}

async function swapTokens(amountIn, amountOutMin, path, to, deadline) {
    console.log(`Swapping ${ethers.utils.formatEther(amountIn)} USDT for tokens...`);

    try {
        // Set gas price to a lower value to fit within your balance (e.g., 5 gwei)
        const gasPrice = ethers.utils.parseUnits('5', 'gwei'); // Adjust the gas price as needed
        const gasLimit = 300000; // Adjust the gas limit as needed

        // Execute swap
        const tx = await pancakeRouter.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            to,
            deadline,
            {
                gasLimit: gasLimit,
                gasPrice: gasPrice,
            }
        );

        const receipt = await tx.wait(); // Wait for the swap transaction to be mined
        console.log('Swap transaction successful! Transaction receipt:', receipt);
    } catch (error) {
        console.error('Error during token swap:', error);
    }
}

async function initiateSwap() {
    const amountIn = ethers.utils.parseUnits('0.00003', 'ether'); // Amount of USDT to swap
    const amountOutMin = 0; // Set minimum amount out (for slippage tolerance)
    const path = [USDT_ADDRESS, YOUR_TOKEN_ADDRESS]; // Path for swapping (USDT to your token)
    const to = wallet.address; // Address to receive the output tokens
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

    try {
        await approveSpending();
        await swapTokens(amountIn, amountOutMin, path, to, deadline);
    } catch (error) {
        console.error('Error initiating swap:', error);
    }
}

function startTransactionInterval() {
    // Initiate the first transaction immediately
    initiateSwap();

    // Set an interval to initiate a swap every 10 seconds
    setInterval(initiateSwap, 10000); // 10000 milliseconds = 10 seconds
}

startTransactionInterval();
