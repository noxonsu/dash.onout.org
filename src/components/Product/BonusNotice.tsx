import { useContext } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import bscIcon from "../../assets/images/bsc.svg";
import ploygonIcon from "../../assets/images/polygon.svg";
import swapIcon from "../../assets/images/swap.svg";
import { NETWORKS, cashbackTokenAddresses } from "../../constants";
import { importToken } from "../../helpers/transaction";
import IconButton from "./IconButton";

const BonusNotice = ({ switchToNetwork }: { switchToNetwork: (chainId: string) => void }) => {
  const {
    account: { isPolygonNetwork, isBSCNetwork, networkId, address },
  } = useContext(Web3ConnecStateContext);

  const switchToPolygon = () => switchToNetwork(NETWORKS[137].chainId);
  const switchToBinance = () => switchToNetwork(NETWORKS[56].chainId);

  const importSwapToken = () => {
    if (networkId) {
      importToken(cashbackTokenAddresses[networkId], address);
    }
  };

  return (
    <p className="bonusNotice">
      Use{" "}
      <IconButton
        name="Polygon"
        icon={ploygonIcon}
        alt="polygon button"
        onClick={switchToPolygon}
        active={isPolygonNetwork}
      />{" "}
      or{" "}
      <IconButton
        name="BSC"
        icon={bscIcon}
        alt="binance smart chain button"
        onClick={switchToBinance}
        active={isBSCNetwork}
      />{" "}
      to get 50
      {""}
      <IconButton name="SWAP" icon={swapIcon} alt="swap token button" onClick={importSwapToken} /> tokens as a bonus.
    </p>
  );
};

export default BonusNotice;
