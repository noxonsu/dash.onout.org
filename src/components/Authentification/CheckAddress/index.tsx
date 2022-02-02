import { useState } from "react";
import { useCheckAddress } from "../../../hooks/useCheckAddress";
import useUser from "../../../hooks/useUser";
import { UserActions } from "../../UserProvider";
import SubscriptionForm from "../SubscriptionForm";

type CheckAddressProps = { account: any };

const CheckAddress = ({ account }: CheckAddressProps) => {
  const { state, dispatch } = useUser();

  if (!state.signed) {
    dispatch({
      type: UserActions.signed,
      payload: true,
    });
  }

  return null;
  // const { isCheckLoading, isSubscribed } = useCheckAddress(account.address);
  // const [haveSubscribed, setHaveSubscribed] = useState<boolean>(false);

  // const toggleSetHaveSubscribed = () => {
  //   setHaveSubscribed(!haveSubscribed);
  // };

  // if (isCheckLoading) return <span>Checking your address...</span>;
  // if (isSubscribed === undefined) return <></>;

  // return isSubscribed || haveSubscribed ? null : (
  //   <div style={{ margin: "0 1rem" }}>
  //     <p>Please enter your email to complete registration</p>
  //     <SubscriptionForm
  //       address={account.address}
  //       toggleSubscribed={toggleSetHaveSubscribed}
  //     />
  //   </div>
  // );
};

export default CheckAddress;
