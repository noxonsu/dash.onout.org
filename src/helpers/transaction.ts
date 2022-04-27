import { utils } from "ethers";
import bonusAndDiscountContractAbi from "../constants/bonusAndDiscountContractAbi.json";
import { SupportedChainId } from "../constants";
import { sendMessage, STATUS } from "./feedback";
import { saveLocal, getLocal } from "./storage";

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

const importToken = async (cashbackTokenAddress: string, from: string) => {
  const isTokenAlreadyAddedKey = `ADDED_SWAP_TOKKEN_${cashbackTokenAddress}_${from}`;

  if (!getLocal(isTokenAlreadyAddedKey)) {
    const tokenSymbol = "SWAP";
    const tokenDecimals = 18;
    const tokenImage =
      "https://swaponline.github.io/images/logo-colored_24a13c.svg";

    try {
      await window.ethereum
        .request({
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
        })
        .then(() => {
          saveLocal({
            key: isTokenAlreadyAddedKey,
            value: cashbackTokenAddress,
          });
        })
        .catch((e: any) => {
          console.error(e.message);
        });
    } catch (error) {
      console.log(error);
    }
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
    msg: `
    Time replenishment SWAP tokens on the network ${networkId};
    Current balance ${balance} SWAP
    `,
    status,
  });
};

const checkCashBackBalance = async (
  contract: any,
  cashbackTokenAddress: string,
  networkId: SupportedChainId
) => {
  try {
    await contract?.methods
      .balanceOf(cashbackTokenAddress)
      .call()
      .then((res: any) => {
        const balance = res / 10 ** 18;
        if (balance <= 120) {
          sendFeedback({
            networkId,
            balance,
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
    if (!bonusAndDiscountContract || !cashbackTokenAddress)
      throw new Error(
        "Don't have Bonus and Discount Contract or Cashback Token Address"
      );

    const contract = new provider.eth.Contract(
      bonusAndDiscountContractAbi,
      bonusAndDiscountContract,
      { from }
    );

    const decimals = await contract.methods.decimals().call();
    const unitAmount = utils.parseUnits(String(amount), decimals);

    importToken(cashbackTokenAddress, from);
    await checkCashBackBalance(contract, cashbackTokenAddress, networkId);
    if (promocode) {
      if (promocode === from)
        throw new Error("Don't use own address as promocode");

      return await contract.methods
        .transferPromoErc20(cashbackTokenAddress, from, promocode, productId)
        .send({
          from,
          value: unitAmount,
        });
    }
    return await contract.methods
      .transferErc20(cashbackTokenAddress, from, productId)
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
  cashbackTokenAddress,
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
      cashbackTokenAddress,
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
