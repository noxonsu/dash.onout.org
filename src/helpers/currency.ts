import { PRICE_ENDPOINT, NETWORKS } from "../constants";
import AggregatorV3Interface from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";

export const getApiPrice = async ({
  assetId,
  vsCurrency,
}: {
  assetId: string;
  vsCurrency: string;
}) => {
  try {
    const data = await fetch(
      `${PRICE_ENDPOINT}/simple/price?vs_currencies=${vsCurrency}&ids=${assetId}`
    ).then((response) => response.json());

    return data;
  } catch (error) {
    console.group("%c getApiPrice", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};

export const getOracleNativePrice = async ({
  provider,
  chainId,
  from,
}: {
  provider: any;
  chainId: number;
  from: string;
}) => {
  try {
    //@ts-ignore
    const oracleAddress = NETWORKS[chainId].nativePriceOracle;
    const oracle = new provider.eth.Contract(
      AggregatorV3Interface,
      oracleAddress,
      {
        from,
      }
    );
    const { answer } = await oracle.methods.latestRoundData().call();

    if (answer > 0) {
      // TODO: name and move oracle decimals somewhere
      return answer / 10 ** 8;
    }

    return false;
  } catch (error) {
    console.group("%c getOracleNativePrice", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};
