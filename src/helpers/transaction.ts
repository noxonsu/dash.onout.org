import { utils } from "ethers";
import ERC20_ABI from "../constants/erc20abi.json";

type TxParameters = {
  provider: any;
  from: string;
  to: string;
  amount: number;
  tokenAddress?: string;
  onHash?: (hash: string) => void;
  data?: any;
};

const sendToken = async ({
  provider,
  from,
  to,
  amount,
  tokenAddress,
}: TxParameters & {
  tokenAddress: string;
}) => {
  try {
    const contract = new provider.eth.Contract(ERC20_ABI, tokenAddress, {
      from,
    });
    const decimals = await contract.methods.decimals().call();
    const unitAmount = utils.parseUnits(String(amount), decimals);

    return await contract.methods.transfer(to, unitAmount).send({
      from,
    });
  } catch (error) {
    console.group("%c send token", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};

const sendTokenPolygon = async ({
  provider,
  from,
  to,
  amount,
  tokenAddress,
}: TxParameters & {
  tokenAddress: string;
}) => {
  try {
    const contract = new provider.eth.Contract(ERC20_ABI, tokenAddress, {
      from,
    });
    const decimals = await contract.methods.decimals().call();
    const unitAmount = utils.parseUnits(String(amount), decimals);

    return await contract.methods.transferErc20(tokenAddress, from).send({
      from,
      value: unitAmount,
    });
  } catch (error) {
    console.group("%c send token", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};

export const send = async ({
  provider,
  from,
  to,
  amount,
  tokenAddress,
  onHash,
  data,
}: TxParameters) => {
  const tx = {
    from,
    to,
    value: utils.parseUnits(String(amount), "ether").toHexString(),
    data,
  };

  if (tokenAddress) {
    return sendToken({
      provider,
      from,
      to,
      amount,
      tokenAddress,
    });
  }

  try {
    return await provider.eth
      .sendTransaction(tx)
      .on("transactionHash", (hash: string) => {
        if (typeof onHash === "function") onHash(hash);
      });
  } catch (error) {
    console.group("%c send", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};
export const sendPolygon = async ({
  provider,
  from,
  to,
  amount,
  tokenAddress,
  onHash,
  data,
}: TxParameters) => {
  const tx = {
    from,
    to,
    value: utils.parseUnits(String(amount), "ether").toHexString(),
    data,
  };

  if (tokenAddress) {
    return sendTokenPolygon({
      provider,
      from,
      to,
      amount,
      tokenAddress,
    });
  }

  try {
    return await provider.eth
      .sendTransaction(tx)
      .on("transactionHash", (hash: string) => {
        if (typeof onHash === "function") onHash(hash);
      });
  } catch (error) {
    console.group("%c send", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};
