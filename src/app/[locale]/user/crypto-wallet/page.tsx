'use client';

import { useState, useEffect } from 'react';
import '@mysten/dapp-kit/dist/index.css';
import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
} from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletStore } from '@/stores/walletStore';

type ChainType = 'testnet' | 'mainnet' | 'localnet';

export default function CryptoWalletPage() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chainName, setChainName] = useState<ChainType>('testnet');

  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  const {
    account: accountStore,
    balance,
    network,
    setAccount,
    setBalance,
    setNetwork,
  } = useWalletStore();

  // Fetch balance
  useEffect(() => {
    if (account && account !== accountStore) {
      fetchBalance();
      setAccount(account);
    }
  }, [account, accountStore]);

  const fetchBalance = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const balance = await suiClient.getBalance({
        owner: account.address,
        coinType: '0x2::sui::SUI',
      });

      const balanceInSui = (Number(balance.totalBalance) / 1e9).toFixed(4);
      setBalance(balanceInSui);

      setTokens([
        {
          id: 'sui',
          name: 'Sui',
          symbol: 'SUI',
          balance: balanceInSui,
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  /* ------------------------------ Not connected ------------------------------ */
  if (!account) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-sky-900/40 border-sky-700 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              Crypto Wallet
            </CardTitle>
            <CardDescription className="text-sky-200/80">
              Connect your Sui wallet to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ConnectButton className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-semibold py-6 text-lg">
              Connect Wallet
            </ConnectButton>

            <p className="text-xs text-sky-300 text-center mt-4">
              Using Sui Testnet • Powered by @mysten/dapp-kit
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ------------------------------ Connected UI ------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-950 via-sky-900 to-sky-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Crypto Wallet</h1>
          <p className="text-sky-300">Manage your digital assets</p>
        </div>

        <div className="grid gap-6 mb-6">
          {/* Wallet Info */}
          <Card className="bg-sky-900/50 border-sky-700">
            <CardHeader>
              <CardTitle className="text-white">Wallet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-sky-800 rounded-lg">
                <div>
                  <p className="text-sm text-sky-300">Wallet Address</p>
                  <p className="text-lg font-mono text-white">
                    {shortenAddress(account.address)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(account.address)}
                  className="text-sky-300 border-sky-500 hover:text-white hover:bg-sky-700"
                >
                  Copy
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-sky-800 rounded-lg">
                  <p className="text-sm text-sky-300">Network</p>
                  <select
                    value={chainName}
                    onChange={(e) => setChainName(e.target.value as ChainType)}
                    className="p-2 bg-sky-700 text-white rounded"
                  >
                    <option value="mainnet">Mainnet</option>
                    <option value="testnet">Testnet</option>
                    <option value="localnet">Localnet</option>
                  </select>
                </div>

                <div className="p-4 bg-sky-800 rounded-lg">
                  <p className="text-sm text-sky-300">Status</p>
                  <p className="text-lg font-semibold text-green-400">
                    Connected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BALANCE */}
          <Card className="bg-gradient-to-br from-sky-700 via-sky-800 to-sky-900 border-sky-700">
            <CardHeader>
              <CardTitle className="text-white">SUI Balance</CardTitle>
              <CardDescription className="text-sky-300">
                Your total balance
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-32 bg-sky-800" />
                  <Skeleton className="h-4 w-48 bg-sky-800" />
                </div>
              ) : (
                <div>
                  <p className="text-4xl font-bold text-white">
                    {balance || '0'}
                  </p>
                  <p className="text-sm text-sky-300 mt-2">SUI Token</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* TOKENS */}
          <Card className="bg-sky-900/50 border-sky-700">
            <CardHeader>
              <CardTitle className="text-white">Your Tokens</CardTitle>
              <CardDescription className="text-sky-300">
                Assets in your wallet
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full bg-sky-800" />
                  ))}
                </div>
              ) : tokens.length > 0 ? (
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="flex justify-between items-center p-4 bg-sky-800 rounded-lg hover:bg-sky-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {token.symbol[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {token.name}
                          </p>
                          <p className="text-xs text-sky-300">{token.symbol}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-white">
                        {token.balance}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sky-300">No tokens found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disconnect */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => disconnect()}
            className="bg-red-400 text-white hover:text-white hover:bg-red-300"
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
