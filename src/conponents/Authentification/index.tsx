
import { useContext } from "react";
import { useCheckAddress } from "../../hooks/useCheckAddress";
import { Web3ConnecStateContext } from "../WithWeb3Connect";

import './index.css'

type CheckAddressProps = { address: string }

const CheckAddress = ({address} : CheckAddressProps ) => {
  const { isCheckLoading, isSubscribed } = useCheckAddress(address);


  if (isCheckLoading) return <span>Checking your address...</span>
  if (isSubscribed === undefined) return <></>;

  return isSubscribed
    ? <span>You have subscribed, soon here will be list of our products</span>
    : <span>You have't subscriber, please fill form bellow that subscribe to our company then you will get links list to buy our products</span>

}

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

export default Authentification