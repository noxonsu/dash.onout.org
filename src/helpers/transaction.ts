import { utils } from "ethers";
import ERC20_ABI from "../constants/abiPolygon.json";
import ERC20_ABI_BSC from "../constants/abiBSC.json";
import erc20abi from "../constants/erc20.json";
import { CONTRACT_ADDRESS_POLYGON, CONTRACT_ADDRESS_BSC } from "../constants";
import { sendMessage, STATUS } from "./feedback";

type TxParameters = {
  provider: any;
  from: string;
  to: string;
  amount: number;
  contractAddress?: string;
  promocode?: string;
  productId?: Number;
  onHash?: (hash: string) => void;
  data?: any;
};

// Cashback Token Address
const erc20addressOfCashbackToken =
  "0x654496319F438A59FEE9557940393cf818753ee9";
const addressOfCashbackTokenBSC = "0x92648e4537CdFa1EE743A244465a31AA034B1ce8";

const importToken = async (contractAddress: any) => {
  const tokenSymbol = "SWAP";
  const tokenDecimals = 18;
  const tokenImage =
    "https://swaponline.github.io/images/logo-colored_24a13c.svg";

  if (CONTRACT_ADDRESS_POLYGON === contractAddress) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: erc20addressOfCashbackToken,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  } else if (CONTRACT_ADDRESS_BSC === contractAddress) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: addressOfCashbackTokenBSC,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
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
    msg: `Time replenishment SWAP tokens on the network ${networkId}; Current balance ${balance} SWAP`,
    status,
  });
};

const getBalance = async ({ provider, contractAddress }: any) => {
  try {
    let contract;
    if (contractAddress === CONTRACT_ADDRESS_POLYGON) {
      contract = new provider.eth.Contract(
        ERC20_ABI,
        erc20addressOfCashbackToken
      );
      await contract.methods
        .balanceOf(CONTRACT_ADDRESS_BSC)
        .call()
        .then((res: any) => {
          if (res / 10 ** 18 <= 120) {
            sendFeedback({
              networkId: 137,
              balance: res / 10 ** 18,
              status: STATUS.bonusFuel,
            });
          }
        });
    } else if (contractAddress === CONTRACT_ADDRESS_BSC) {
      contract = new provider.eth.Contract(
        ERC20_ABI,
        addressOfCashbackTokenBSC
      );
      await contract.methods
        .balanceOf(CONTRACT_ADDRESS_BSC)
        .call()
        .then((res: any) => {
          if (res / 10 ** 18 <= 120) {
            sendFeedback({
              networkId: 56,
              balance: res / 10 ** 18,
              status: STATUS.bonusFuel,
            });
          }
        });
    }
  } catch (e) {
    console.error(e);
  }
};

const sendToken = async ({
  provider,
  from,
  to,
  amount,
  contractAddress,
  promocode,
  productId,
}: TxParameters & {
  contractAddress: string;
}) => {
  try {
    let contract;
    if (contractAddress === CONTRACT_ADDRESS_BSC) {
      contract = new provider.eth.Contract(ERC20_ABI_BSC, contractAddress, {
        from,
      });
    } else {
      contract = new provider.eth.Contract(ERC20_ABI, contractAddress, {
        from,
      });
    }
    // const decimals = await contract.methods.decimals().call();
    const unitAmount = utils.parseUnits(String(amount), 18);

    if (
      contractAddress === CONTRACT_ADDRESS_POLYGON &&
      promocode !== undefined
    ) {
      if (promocode !== from) {
        importToken(contractAddress);
        getBalance({ provider, contractAddress });
        return await contract.methods
          .transferPromoErc20(erc20addressOfCashbackToken, from, promocode)
          .send({
            from,
            value: unitAmount,
          });
      } else {
        const error = "wrong promocode code";
        console.group("%c send token", "color: red;");
        console.error(error);
        console.groupEnd();
        throw error;
      }
    } else if (
      contractAddress === CONTRACT_ADDRESS_BSC &&
      promocode !== undefined
    ) {
      if (promocode !== from) {
        importToken(contractAddress);
        getBalance({ provider, contractAddress });
        return await contract.methods
          .transferPromoErc20(
            addressOfCashbackTokenBSC,
            from,
            promocode,
            productId
          )
          .send({
            from,
            value: unitAmount,
          });
      } else {
        const error = "wrong promocode code";
        console.group("%c send token", "color: red;");
        console.error(error);
        console.groupEnd();
        throw error;
      }
    } else if (contractAddress === CONTRACT_ADDRESS_POLYGON) {
      importToken(contractAddress);
      return await contract.methods
        .transferErc20(erc20addressOfCashbackToken, from)
        .send({
          from,
          value: unitAmount,
        });
    } else if (contractAddress === CONTRACT_ADDRESS_BSC) {
      importToken(contractAddress);
      return await contract.methods
        .transferErc20(addressOfCashbackTokenBSC, from, productId)
        .send({
          from,
          value: unitAmount,
        });
    } else {
      return await contract.methods.transfer(to, unitAmount).send({
        from,
      });
    }
  } catch (error) {
    console.group("%c send token", "color: red;");
    console.error(error);
    console.groupEnd();
    throw error;
  }
};

export const send = async ({
  provider,
  from,
  to,
  amount,
  contractAddress,
  promocode,
  productId,
  onHash,
  data,
}: TxParameters) => {
  const tx = {
    from,
    to,
    value: utils.parseUnits(String(amount), "ether").toHexString(),
    data,
  };

  if (contractAddress) {
    return sendToken({
      provider,
      from,
      to,
      amount,
      contractAddress,
      promocode,
      productId,
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
    throw error;
  }
};
