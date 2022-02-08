import { utils } from "ethers";
import ERC20_ABI from "../constants/erc20.json";

type TxParameters = {
  provider: any;
  from: string;
  to: string;
  amount: number;
  tokenAddress?: string;
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
  const contract = new provider.eth.Contract(ERC20_ABI, tokenAddress, {
    from,
  });
  const decimals = await contract.methods.decimals().call();
  const unitAmount = utils.parseUnits(String(amount), decimals);

  try {
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

export const send = async ({
  provider,
  from,
  to,
  amount,
  tokenAddress,
}: TxParameters) => {
  const tx = {
    from,
    to,
    value: utils.parseUnits(String(amount), "ether").toHexString(),
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
    return await provider.eth.sendTransaction(tx);
  } catch (error) {
    console.group("%c send", "color: red;");
    console.error(error);
    console.groupEnd();
    return false;
  }
};
