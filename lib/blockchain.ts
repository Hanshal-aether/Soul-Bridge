import { ethers } from 'ethers';

const RPC_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL!;

export const getProvider = () => {
  return new ethers.JsonRpcProvider(RPC_URL);
};

export const getWalletSigner = (privateKey: string) => {
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
};

export interface TransactionData {
  from: string;
  to: string;
  amount: string;
  description: string;
}

export const simulateTransaction = async (data: TransactionData) => {
  try {
    const provider = getProvider();
    
    // Simulate transaction creation
    const tx = {
      to: data.to,
      value: ethers.parseEther(data.amount),
      data: ethers.toBeHex(data.description),
    };

    // Get gas estimate
    const gasEstimate = await provider.estimateGas(tx);
    
    return {
      success: true,
      gasEstimate: gasEstimate.toString(),
      estimatedCost: ethers.formatEther(gasEstimate),
    };
  } catch (error) {
    console.error('Transaction simulation failed:', error);
    return {
      success: false,
      error: 'Transaction simulation failed',
    };
  }
};

export const getTransactionStatus = async (txHash: string) => {
  try {
    const provider = getProvider();
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return { status: 'pending', confirmations: 0 };
    }

    return {
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      confirmations: receipt.confirmations || 0,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Failed to get transaction status:', error);
    return { status: 'unknown', error: 'Failed to fetch status' };
  }
};

export const verifyWalletSignature = (message: string, signature: string, address: string): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};
