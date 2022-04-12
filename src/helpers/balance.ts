import axios from "axios";

const DENBANK_API_ENDPOINT = "https://openapi.debank.com";

export const getUserUSDValueOfAddress = async (address: string) => {
  try {
    if (!address) throw new Error("Can't fetch empty address");

    const result = await axios(`${DENBANK_API_ENDPOINT}/v1/user/total_balance?id=${address}`);
    return result?.data?.total_usd_value;
  } catch (error) {
    throw error;
  }
};

const defaulExport = {
    getUserUSDValueOfAddress,
}

export default defaulExport;
