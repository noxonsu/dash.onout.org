const axios = require('axios');

const DENBANK_API_ENDPOINT = "https://pro-openapi.debank.com";

const getTotalUsd = async (address = '') => {
  try {
    const config = {
      headers: {
       AccessKey: process.env.DEBANK_API_KEY
      }
    };

    const result = await axios.get(`${DENBANK_API_ENDPOINT}/v1/user/total_balance?id=${address}`, config);
    return result.data.total_usd_value;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTotalUsd,
};