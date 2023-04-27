import { useEffect, useState } from "react";
import { useCheckAddress } from "../../../hooks/useCheckAddress";
import useUser from "../../../hooks/useUser";
import { UserActions } from "../../UserProvider";
import SubscriptionForm from "../SubscriptionForm";

type CheckAddressProps = { account: any };

const CheckAddress = ({ account }: CheckAddressProps) => {
  const { state, dispatch } = useUser();
  const { isCheckLoading, isSubscribed, checkerErrors } = useCheckAddress(account.address);
  const [haveSubscribed, setHaveSubscribed] = useState<boolean>(false);

  const toggleSetHaveSubscribed = () => {
    setHaveSubscribed(!haveSubscribed);
  };

  useEffect(() => {
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
    } else if (state.subscribed) {
      dispatch({
        type: UserActions.subscribed,
        payload: false,
      });
    }
  }, [isSubscribed, haveSubscribed, state, dispatch]);

  if (checkerErrors.length > 0) {
    return (
      <>
        {checkerErrors.map(((error, i) => {
          return <span key={i} className="error">{error}</span>
        }))}
      </>
    )
  }

  if (isCheckLoading) {
    return <span className="pending">Checking your address</span>;
  }

  if (isSubscribed === undefined) return <></>;

  return isSubscribed || haveSubscribed ? null : (
    <div className="checkAddressWrapper">
      <h3 className="checkAddressTitle">Please enter your email to complete registration</h3>

      <SubscriptionForm
        address={account.address}
        toggleSubscribed={toggleSetHaveSubscribed}
      />
    </div>
  );
};

export default CheckAddress;
