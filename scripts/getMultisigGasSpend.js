require("dotenv").config();

const {
  getMultisigTransactions,
  calculateGasSpendPerAddress,
} = require("../helpers");

async function main() {
  const startblock = process.argv[2];
  if (!startblock) {
    console.error("Run failed. Specify start block.");
    process.exit(1);
  }

  const transactions = await getMultisigTransactions({ startblock });
  console.log(`Found ${transactions.length} multisig transactions`);

  const gas = await calculateGasSpendPerAddress(transactions);

  console.log(gas);
}

main();
