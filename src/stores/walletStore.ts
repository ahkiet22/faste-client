// src/store/walletStore.ts
import { create } from 'zustand';
import { SuiClient } from '@mysten/sui/client';
import type { WalletAccount } from '@mysten/wallet-standard';

// Chain type
export type NetworkType = 'sui:testnet' | 'sui:mainnet' | 'sui:devnet';

// Zustand interface
interface WalletState {
  network: NetworkType;
  account: WalletAccount | null;
  balance: string;

  setNetwork: (network: NetworkType) => void;
  setAccount: (account: WalletAccount | null) => void;
  setBalance: (balance: string) => void;
}

// Client map
const clients: Record<NetworkType, SuiClient> = {
  'sui:testnet': new SuiClient({ url: 'https://fullnode.testnet.sui.io' }),
  'sui:mainnet': new SuiClient({ url: 'https://fullnode.mainnet.sui.io' }),
  'sui:devnet': new SuiClient({ url: 'https://fullnode.devnet.sui.io' }),
};

// Zustand store
export const useWalletStore = create<WalletState>((set, get) => ({
  network: 'sui:testnet',
  account: null,
  balance: '0',

  setNetwork: (network) => set({ network }),
  setAccount: (account) => set({ account }),
  setBalance: (balance) => set({ balance }),
}));

// Optional helper: fetch balance from Sui network
export const fetchWalletBalance = async (
  account: WalletAccount,
  network: NetworkType,
) => {
  const client = clients[network];
  const balance = await client.getBalance({
    owner: account.address,
    coinType: '0x2::sui::SUI',
  });
  return balance.totalBalance.toString();
};
