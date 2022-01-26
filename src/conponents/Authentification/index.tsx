
import { useContext } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import CheckAddress from "./CheckAddress";

import './index.css'

const Authentification = () => {
  const {account, isWeb3Loading} = useContext(Web3ConnecStateContext);

  return (
    <div className="auth">
      {
        isWeb3Loading
        ? <></>
        : !account.address
        ? <span>Please connect to wallet for access to links</span>
        : <CheckAddress address={account.address} />
      }
    </div>
  );
};

export default Authentification;