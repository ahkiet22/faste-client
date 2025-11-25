import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui/utils';

const client = new SuiClient({
  url: getFullnodeUrl('testnet'),
});

const PACKAGE_ID = '';
const MODULE_NAME = '';

export async function CreateEscrowTransaction(
  senderAddress: string,
  senderSignTx: (tx: Transaction) => Promise<string>,
  data: {
    order_id: number; // u64
    seller: string; // address
    payment_object_id: string; // Coin<SUI> objectID
  },
) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::create_escrow`,
    arguments: [
      tx.pure.u64(data.order_id), // order_id
      tx.pure.address(data.seller), // seller
      tx.object(data.payment_object_id), // coin object
      tx.object(SUI_CLOCK_OBJECT_ID), // clock
    ],
  });

  tx.setSender(senderAddress);

  tx.setGasBudget(10_000_000);

  const senderSigHex = await senderSignTx(tx);

  const txBytes = await tx.build({ client });
  const result = await client.executeTransactionBlock({
    transactionBlock: txBytes,
    signature: [senderSigHex],
    options: { showEffects: true },
  });

  return result;
}
