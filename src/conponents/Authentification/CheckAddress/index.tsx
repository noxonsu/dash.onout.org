
import { useState } from "react";
import { useCheckAddress } from "../../../hooks/useCheckAddress";
import ProductList from "../../ProductList";
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
    ? <ProductList />
    : <div style={{ margin: "0 1rem"}}>
      <p>Please enter your email to complete registration</p>
      <SubscriptionForm address={address} toggleSubscribed={toggleSetHaveSubscribed} />
    </div>;

};

export default CheckAddress;
