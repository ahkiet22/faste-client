import MyWalletPage from './partials/my-wallet';
import WalletSetUpPage from './partials/wallet-setup';

export default function EWalletPage() {
  const isWallet = true;
  return <>{isWallet ? <MyWalletPage /> : <WalletSetUpPage />}</>;
}
