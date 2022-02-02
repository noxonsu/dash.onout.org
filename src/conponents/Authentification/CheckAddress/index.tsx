import { useState } from "react";
import { encrypt, decrypt } from "../../../helpers/storage";
import { useCheckAddress } from "../../../hooks/useCheckAddress";
import ProductList from "../../ProductList";
import SubscriptionForm from "../SubscriptionForm";
import {
  toBuffer,
  hashPersonalMessage,
  ecrecover,
  publicToAddress,
  bufferToHex,
} from "ethereumjs-util";

type CheckAddressProps = { account: any };

const CheckAddress = ({ account }: CheckAddressProps) => {
  const { isCheckLoading, isSubscribed } = useCheckAddress(account.address);
  const [haveSubscribed, setHaveSubscribed] = useState<boolean>(false);

  const toggleSetHaveSubscribed = () => {
    setHaveSubscribed(!haveSubscribed);
  };

  if (isCheckLoading) return <span>Checking your address...</span>;
  if (isSubscribed === undefined) return <></>;

  return true ? ( // isSubscribed || haveSubscribed
    <ProductList />
  ) : (
    <div style={{ margin: "0 1rem" }}>
      <p>Please enter your email to complete registration</p>
      <SubscriptionForm
        address={account.address}
        toggleSubscribed={toggleSetHaveSubscribed}
      />
    </div>
  );
};

export default CheckAddress;
