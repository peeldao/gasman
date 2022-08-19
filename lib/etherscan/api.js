const axios = require("axios");

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const baseURL = "https://api.etherscan.io/api";
const axiosInstance = axios.create({
  baseURL,
});

exports.listTransactions = (
  contractAddress,
  { startblock } = { startblock: "0" }
) => {
  return axiosInstance.get("", {
    params: {
      module: "account",
      action: "txlist",
      address: contractAddress,
      startblock,
      endblock: "99999999",
      page: "1",
      offset: "0",
      sort: "desc",
      apikey: ETHERSCAN_API_KEY,
    },
  });
};
