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

  return <ProductList />;

  // if (isCheckLoading) return <span>Checking your address...</span>;
  // if (isSubscribed === undefined) return <></>;

  // return isSubscribed || haveSubscribed ? (
  //   <ProductList />
  // ) : (
  //   <div style={{ margin: "0 1rem" }}>
  //     <p>
  //       You have't subscriber, please fill form bellow that subscribe to our
  //       company then you will get links list to buy our products (all filds is
  //       required)
  //     </p>
  //     <SubscriptionForm
  //       address={account.address}
  //       toggleSubscribed={toggleSetHaveSubscribed}
  //     />
  //   </div>
  // );
};

export default CheckAddress;
