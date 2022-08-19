require("dotenv").config();

const { listTransactions } = require("./lib/etherscan/api");
const { utils, BigNumber } = require("ethers");

const MULTISIG_SAFE_ADDRESS = "0x0e9D15e28e3De9bB3CF64FFbC2f2F49Da9Ac545B";

const getTransactions = async ({ startblock } = {}) => {
  const transactions = await listTransactions(MULTISIG_SAFE_ADDRESS, {
    startblock,
  });

  return transactions.data.result;
};

/**
 * (Block Base Fee Per Gas + MaxPriorityFee Per Gas) * Gas Used
 * @param {*} transaction
 * @returns
 */
const calculateTransactionGas = (transaction) => {
  return BigNumber.from(transaction.gasUsed).mul(transaction.gasPrice);
};

const getJuiceboxGasSpend = async ({ startblock } = {}) => {
  const transactions = await getTransactions({ startblock });
  console.log(`Found ${transactions.length} multisig transactions`);

  const gas = transactions.map((tx) => {
    const gasFeeGwei = calculateTransactionGas(tx);
    const gasFeeETH = utils.formatEther(gasFeeGwei);

    return {
      from: tx.from,
      hash: tx.hash,
      gasFeeGwei,
      gasFeeETH,
    };
  });

  const sumGas = gas.reduce((acc, tx) => {
    if (acc[tx.from] === undefined) {
      acc[tx.from] = tx.gasFeeGwei;
    } else {
      acc[tx.from] = acc[tx.from].add(tx.gasFeeGwei);
    }

    return acc;
  }, {});

  const formattedGas = Object.keys(sumGas).reduce((acc, addr) => {
    acc[addr] = utils.formatEther(sumGas[addr]);
    return acc;
  }, {});

  console.log(formattedGas);
};

if (!process.argv[2]) {
  console.error("Run failed. Specify start block.");
  process.exit(1);
}

getJuiceboxGasSpend({ startblock: process.argv[2] });
