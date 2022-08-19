require("dotenv").config();

const {
  getTapTransactions,
  findPeelTransactions,
  calculateGasSpendPerAddress,
  getMultisigTransactions,
} = require("../helpers");

async function main() {
  const startblock = process.argv[2];
  if (!startblock) {
    console.error("Run failed. Specify start block.");
    process.exit(1);
  }

  const tapTransactions = await getTapTransactions({ startblock });
  const peelTaps = findPeelTransactions(tapTransactions);
  const multisigTransactions = await getMultisigTransactions({ startblock });

  const allTransactions = [...multisigTransactions, ...peelTaps];

  console.log(`Found ${allTransactions.length} \`tap\` transactions.`);

  const gas = await calculateGasSpendPerAddress(allTransactions);

  console.log(gas);
}

main();
