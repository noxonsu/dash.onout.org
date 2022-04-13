import { utils } from "ethers";
import ERC20_ABI_BSC from "../constants/abiBSC.json";
import { SupportedChainId } from "../constants";
import { sendMessage, STATUS } from "./feedback";

type TxParameters = {
  provider: any;
  networkId: SupportedChainId;
  from: string;
  to: string;
  amount: number;
  cashbackTokenAddress?: string;
  bonusAndDiscountContract?: string;
  promocode?: string | false;
  productId?: Number;
  onHash?: (hash: string) => void;
  data?: any;
};

const importToken = async (cashbackTokenAddress: string) => {
  const tokenSymbol = "SWAP";
  const tokenDecimals = 18;
  const tokenImage =
    "https://swaponline.github.io/images/logo-colored_24a13c.svg";

  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: cashbackTokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const sendFeedback = ({
  networkId,
  status,
  balance,
}: {
  networkId?: number;
  balance?: Number;
  status: STATUS;
}) => {
  sendMessage({
    msg: `Time replenishment SWAP tokens on the network ${networkId}; Current balance ${balance} SWAP`,
    status,
  });
};

const checkCashBackBalance = async (contract: any, cashbackTokenAddress: string, networkId: SupportedChainId) => {
  try {
    await contract?.methods
      .balanceOf(cashbackTokenAddress)
      .call()
      .then((res: any) => {
        if (res / 10 ** 18 <= 120) {
          sendFeedback({
            networkId,
            balance: res / 10 ** 18,
            status: STATUS.bonusFuel,
          });
        }
      });
  } catch (e) {
    console.error(e);
  }
};

const sendToken = async ({
  provider,
  networkId,
  from,
  to,
  amount,
  bonusAndDiscountContract,
  cashbackTokenAddress,
  promocode,
  productId,
}: TxParameters) => {
  try {
    if (!bonusAndDiscountContract || !cashbackTokenAddress ) throw new Error("Don't have Bonus and Discount Contract or Cashback Token Address");

    const contract = new provider.eth.Contract(
      ERC20_ABI_BSC, // TODO: deploy similar contract to need chains and provide this ABI here
      bonusAndDiscountContract,
      { from },
      );

    // const decimals = await contract.methods.decimals().call();
    const unitAmount = utils.parseUnits(String(amount), 18);

    importToken(cashbackTokenAddress);

    if (promocode) {
      if (promocode === from) throw new Error("Don't use own address as promocode");

      await checkCashBackBalance(contract, cashbackTokenAddress, networkId);

      return await contract.methods
        .transferPromoErc20(
          cashbackTokenAddress,
          from,
          promocode,
          productId
        )
        .send({
          from,
          value: unitAmount,
        });
    }

    return await contract.methods
      .transferErc20(cashbackTokenAddress, from)
      .send({
        from,
        value: unitAmount,
      });

  } catch (error) {
    console.group("%c send token", "color: red;");
    console.error(error);
    console.groupEnd();
    throw error;
  }
};

export const send = async ({
  provider,
  networkId,
  from,
  to,
  amount,
  bonusAndDiscountContract,
  promocode,
  productId,
  onHash,
  data,
}: TxParameters) => {

  if (bonusAndDiscountContract) {
    return sendToken({
      provider,
      networkId,
      from,
      to,
      amount,
      bonusAndDiscountContract,
      promocode,
      productId,
    });
  }

  const tx = {
    from,
    to,
    value: utils.parseUnits(String(amount), "ether").toHexString(),
    data,
  };

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
    throw error;
  }
};
