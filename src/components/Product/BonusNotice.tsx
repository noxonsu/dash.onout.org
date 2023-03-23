import { useContext } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import bscIcon from "../../assets/images/bsc.svg";
import swapIcon from "../../assets/images/swap.svg";
import { NETWORKS, cashbackTokenAddresses } from "../../constants";
import { importToken } from "../../helpers/transaction";
import IconButton from "./IconButton";

const BonusNotice = ({ switchToNetwork }: { switchToNetwork: (chainId: string) => void }) => {
  const {
    account: { isBSCNetwork, networkId, address },
  } = useContext(Web3ConnecStateContext);

  const switchToBinance = () => switchToNetwork(NETWORKS[56].chainId);

  const importSwapToken = () => {
    if (networkId) {
      const cashbackToken = cashbackTokenAddresses[networkId]

      if (cashbackToken) {
        importToken(cashbackToken, address);
      }
    }
  };

  return (
    <p className="bonusNotice">
      Use binance smart chain{" "}
      <IconButton
        name="BSC"
        icon={bscIcon}
        alt="binance smart chain button"
        onClick={switchToBinance}
        inactive={isBSCNetwork}
      />{" "}
      to get{" "}
      <IconButton name="SWAP" icon={swapIcon} alt="swap token button" onClick={importSwapToken} inactive={true} />{" "}
      tokens as a bonus to stake at{" "}
      <a className="formOnoutLink" target="_blank" href="https://farm.onout.org/">
        farm.onout.org
      </a>
    </p>
  );
};

export default BonusNotice;
