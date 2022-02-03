import { providers, utils, Contract } from "ethers";
import ERC20_ABI from "../constants/erc20.json";

type TxParameters = {
  provider: providers.Web3Provider;
  from: string;
  to: string;
  amount: number;
  tokenAddress?: string;
  decimals?: number;
};

const sendToken = async ({
  provider,
  from,
  to,
  amount,
  tokenAddress,
  decimals,
}: TxParameters & {
  tokenAddress: string;
  decimals: number;
}) => {
  const contract = new Contract(tokenAddress, ERC20_ABI);
  const unitAmount = utils.parseUnits(String(amount), decimals);
  const result = await contract.transfer(to, unitAmount);

  return result;
};

export const send = async ({
  provider,
  from,
  to,
  amount,
  tokenAddress,
  decimals,
}: TxParameters) => {
  const tx = {
    from,
    to,
    value: utils.parseUnits(String(amount), "ether").toHexString(),
  };

  if (tokenAddress && decimals !== undefined) {
    return sendToken({
      provider,
      from,
      to,
      amount,
      tokenAddress,
      decimals,
    });
  }

  try {
    // const result = await provider.send("eth_sendTransaction", [tx]);
    const result = await provider.send("eth_sendTransaction", [tx]);

    return result;
  } catch (error) {
    console.group("%c send", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};
