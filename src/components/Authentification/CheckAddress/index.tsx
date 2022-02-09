import { useState } from "react";
import { useCheckAddress } from "../../../hooks/useCheckAddress";
import useUser from "../../../hooks/useUser";
import { UserActions } from "../../UserProvider";
import SubscriptionForm from "../SubscriptionForm";

type CheckAddressProps = { account: any };

const CheckAddress = ({ account }: CheckAddressProps) => {
  const { state, dispatch } = useUser();
  const { isCheckLoading, isSubscribed } = useCheckAddress(account.address);
  const [haveSubscribed, setHaveSubscribed] = useState<boolean>(false);

  const toggleSetHaveSubscribed = () => {
    setHaveSubscribed(!haveSubscribed);
  };

  if (isCheckLoading) {
    return <span className="pending">Checking your address</span>;
  }

  if (isSubscribed === undefined) return <></>;

  if (isSubscribed || haveSubscribed) {
    if (!state.signed) {
      dispatch({
        type: UserActions.signed,
        payload: true,
      });
    }
    if (!state.subscribed) {
      dispatch({
        type: UserActions.subscribed,
        payload: true,
      });
    }
  }

  return isSubscribed || haveSubscribed ? null : (
    <div style={{ margin: "0 1rem" }}>
      <h3>Please enter your email to complete registration</h3>

      <SubscriptionForm
        address={account.address}
        toggleSubscribed={toggleSetHaveSubscribed}
      />
    </div>
  );
};

export default CheckAddress;
