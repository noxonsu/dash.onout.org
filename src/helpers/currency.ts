import { PRICE_ENDPOINT } from "../constants";

export const getPrice = async ({
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
    console.group("%c getPrice", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};
