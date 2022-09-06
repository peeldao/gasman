const axios = require("axios");

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const baseURL = "https://api.etherscan.io/api";
const axiosInstance = axios.create({
  baseURL,
});

exports.listTransactions = (
  contractAddress,
  { startblock, endblock } = { startblock: "0", endblock: "99999999" }
) => {
  return axiosInstance.get("", {
    params: {
      module: "account",
      action: "txlist",
      address: contractAddress,
      startblock,
      endblock,
      page: "1",
      offset: "0",
      sort: "desc",
      apikey: ETHERSCAN_API_KEY,
    },
  });
};
