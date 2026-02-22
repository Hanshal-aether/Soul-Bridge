// MetaMask + USDC Integration for HealthCoin Payments

const USDC_ADDRESS = '0x41e94eb019c0762f9bfcf9fb1e58725bab9e7c0a'; // Polygon Amoy USDC
const USDC_DECIMALS = 6;
const MAX_TRANSFER_AMOUNT = 1000000; // 10 lakh in smallest units (10,00,000 USDC)

export interface MetaMaskAccount {
  address: string;
  balance: string;
  chainId: string;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  message: string;
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).ethereum;
};

// Connect to MetaMask
export const connectMetaMask = async (): Promise<MetaMaskAccount | null> => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    const ethereum = (window as any).ethereum;

    // Request account access
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    }).catch((err: any) => {
      if (err.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw err;
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in MetaMask');
    }

    // Get chain ID
    const chainId = await ethereum.request({
      method: 'eth_chainId',
    });

    // Check if on Polygon Amoy (chain ID: 80002)
    if (chainId !== '0x13882') {
      // Try to switch to Polygon Amoy
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13882' }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Chain not added, add it
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13882',
                chainName: 'Polygon Amoy',
                rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://amoy.polygonscan.com/'],
              },
            ],
          });
        } else {
          console.warn('Could not switch chain:', switchError);
        }
      }
    }

    // Get balance
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest'],
    });

    return {
      address: accounts[0],
      balance: balance,
      chainId: chainId,
    };
  } catch (error: any) {
    console.error('MetaMask connection error:', error?.message || error);
    throw new Error(error?.message || 'Failed to connect MetaMask. Please ensure MetaMask is installed and unlocked.');
  }
};

// Send USDC payment
export const sendUSDCPayment = async (
  toAddress: string,
  amount: number // in USDC (not wei)
): Promise<TransactionResult> => {
  try {
    if (!isMetaMaskInstalled()) {
      return {
        success: false,
        error: 'MetaMask not installed',
        message: 'Please install MetaMask to make payments',
      };
    }

    // Check amount limit (10 lakh = 1,000,000 USDC)
    if (amount > MAX_TRANSFER_AMOUNT) {
      return {
        success: false,
        error: 'Amount exceeds limit',
        message: `Maximum transfer amount is ${MAX_TRANSFER_AMOUNT} USDC (10 lakh)`,
      };
    }

    const ethereum = (window as any).ethereum;

    // Get current account
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });

    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: 'No account connected',
        message: 'Please connect your MetaMask wallet',
      };
    }

    const fromAddress = accounts[0];

    // USDC transfer function signature: transfer(address to, uint256 amount)
    // Function selector: 0xa9059cbb
    const functionSelector = '0xa9059cbb';
    const paddedToAddress = toAddress.slice(2).padStart(64, '0');
    const amountInWei = (amount * Math.pow(10, USDC_DECIMALS)).toString(16).padStart(64, '0');

    const data = functionSelector + paddedToAddress + amountInWei;

    // Send transaction
    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: fromAddress,
          to: USDC_ADDRESS,
          data: data,
          gas: '0x186a0', // 100000 gas
        },
      ],
    });

    return {
      success: true,
      txHash: txHash,
      message: `Payment of ${amount} USDC sent successfully`,
    };
  } catch (error: any) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Payment failed. Please try again.',
    };
  }
};

// Get USDC balance
export const getUSDCBalance = async (address: string): Promise<string> => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }

    const ethereum = (window as any).ethereum;

    // balanceOf function signature
    const functionSelector = '0x70a08231';
    const paddedAddress = address.slice(2).padStart(64, '0');
    const data = functionSelector + paddedAddress;

    const result = await ethereum.request({
      method: 'eth_call',
      params: [
        {
          to: USDC_ADDRESS,
          data: data,
        },
        'latest',
      ],
    });

    // Convert hex to decimal and divide by decimals
    const balance = parseInt(result, 16) / Math.pow(10, USDC_DECIMALS);
    return balance.toFixed(2);
  } catch (error) {
    console.error('Balance fetch error:', error);
    return '0';
  }
};

// Listen for account changes
export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (!isMetaMaskInstalled()) return;

  const ethereum = (window as any).ethereum;
  ethereum.on('accountsChanged', callback);

  return () => {
    ethereum.removeListener('accountsChanged', callback);
  };
};

// Listen for chain changes
export const onChainChanged = (callback: (chainId: string) => void) => {
  if (!isMetaMaskInstalled()) return;

  const ethereum = (window as any).ethereum;
  ethereum.on('chainChanged', callback);

  return () => {
    ethereum.removeListener('chainChanged', callback);
  };
};
