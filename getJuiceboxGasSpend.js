require("dotenv").config();

const TerminalV1_1 = require("@jbx-protocol/contracts-v1/deployments/mainnet/TerminalV1_1.json");
const { listTransactions } = require("./lib/etherscan/api");
const { utils, BigNumber } = require("ethers");

const TAP_FUNCTION_NAME = "tap";
const PEEL_PROJECT_ID = 329;
const CONTRACT_INTERFACT = new utils.Interface(TerminalV1_1.abi);

const PEEL_CONTRIBUTORS = [
  "0xE16a238d207B9ac8B419C7A866b0De013c73357B", // aeolian
  "0x123a3c28eB9e701C173D3A73412489f3554F3005", // jmill.eth
  "0xf0FE43a75Ff248FD2E75D33fa1ebde71c6d1abAd", // johnnyd
  "0x63A2368F4B509438ca90186cb1C15156713D5834", // peri
  "0xc33E51FE166c65C1dde7DB68d981437aa8fD8E98", // benjamin vault
  "0xC0b8eed3314B625d0c4eBC5432a5bd4f31370B4d", // wraeth,
  "0x1b87d5d68d5100B97F92F0EB7dE46AD46C19b5F9", // pay.jmill
  "0xA99c384f43e72B65BB51fE33b85CE12A32C09526", // strath
];

const decodeTransactionInputs = (tx, functionName) => {
  const decodedData = CONTRACT_INTERFACT.decodeFunctionData(
    functionName,
    tx.input
  );

  return decodedData;
};

const getTapTransactions = async ({ startblock } = {}) => {
  const transactions = await listTransactions(TerminalV1_1.address, {
    startblock,
  });

  const tapTransactions = transactions.data.result.filter((tx) =>
    tx.functionName.startsWith(TAP_FUNCTION_NAME)
  );
  const transactionsDecoded = tapTransactions.map((tx) => {
    return {
      ...tx,
      decodedData: decodeTransactionInputs(tx, TAP_FUNCTION_NAME),
    };
  });

  return transactionsDecoded;
};

const findPeelTransactions = (transactions) =>
  transactions.filter(
    (tx) =>
      tx.decodedData._projectId.toNumber() === PEEL_PROJECT_ID &&
      PEEL_CONTRIBUTORS.includes(utils.getAddress(tx.from))
  );

/**
 * (Block Base Fee Per Gas + MaxPriorityFee Per Gas) * Gas Used
 * @param {*} transaction
 * @returns
 */
const calculateTransactionGas = (transaction) => {
  return BigNumber.from(transaction.gasUsed).mul(transaction.gasPrice);
};

const getJuiceboxGasSpend = async ({ startblock } = {}) => {
  const tapTransactions = await getTapTransactions({ startblock });
  const peelTaps = findPeelTransactions(tapTransactions);
  console.log(`Found ${peelTaps.length} taps`);

  const gas = peelTaps.map((tx) => {
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
      acc[tx.from] = BigNumber.from(0);
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
