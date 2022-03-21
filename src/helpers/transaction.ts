import { utils } from "ethers";
import ERC20_ABI from "../constants/erc20abi.json";

type TxParameters = {
  provider: any;
  from: string;
  to: string;
  amount: number;
  contractAddress?: string;
  onHash?: (hash: string) => void;
  data?: any;
};

// Cashback Token Address
const erc20addressOfCashbackToken = '0x654496319F438A59FEE9557940393cf818753ee9';

const importToken = async () => {
  const tokenSymbol = 'SWAP';
  const tokenDecimals = 18;
  const tokenImage = 'https://swaponline.github.io/images/logo-colored_24a13c.svg';
  
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
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
}

const sendToken = async ({
  provider,
  from,
  to,
  amount,
  contractAddress,
}: TxParameters & {
  contractAddress: string;
}) => {
  try {
    const contract = new provider.eth.Contract(ERC20_ABI, contractAddress, {
      from,
    });
    const decimals = await contract.methods.decimals().call();
    const unitAmount = utils.parseUnits(String(amount), decimals);
    const contractAddressCashbackPolygon = '0x098844e1362c1D7346184045c155DF3c99A98700';
    
    if(contractAddress === contractAddressCashbackPolygon) {
      importToken()
      return await contract.methods.transferErc20(erc20addressOfCashbackToken, from).send({
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
    return false;
  }
};

export const send = async ({
  provider,
  from,
  to,
  amount,
  contractAddress,
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

