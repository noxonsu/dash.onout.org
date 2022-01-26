
import { useState } from "react";
import { useCheckAddress } from "../../../hooks/useCheckAddress";
import SubscriptionForm from "../SubscriptionForm";

type CheckAddressProps = { address: string };

const CheckAddress = ({address} : CheckAddressProps) => {
  const { isCheckLoading, isSubscribed } = useCheckAddress(address);
  const [haveSubscribed, setHaveSubscribed] = useState<boolean>(false);

  const toggleSetHaveSubscribed = () => {
    setHaveSubscribed(!haveSubscribed)
  }

  if (isCheckLoading) return <span>Checking your address...</span>;
  if (isSubscribed === undefined) return <></>;

  return isSubscribed || haveSubscribed
    ? <span>You have subscribed, soon here will be list of our products</span>
    : <div style={{ margin: "0 1rem"}}>
      <p>You have't subscriber, please fill form bellow that subscribe to our company then you will get links list to buy our products (all filds is required)</p>
      <SubscriptionForm address={address} toggleSubscribed={toggleSetHaveSubscribed} />
    </div>;

};

export default CheckAddress;