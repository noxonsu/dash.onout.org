import { useContext } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import CheckAddress from "./CheckAddress";

import "./index.css";

const Authentification = () => {
  const { account, isWeb3Loading } = useContext(Web3ConnecStateContext);

  return (
    <div className="auth">
      {isWeb3Loading ? (
        <></>
      ) : !account.address ? (
        <span>Please connect your wallet for access the products</span>
      ) : (
        <CheckAddress account={account} />
      )}
    </div>
  );
};

export default Authentification;
