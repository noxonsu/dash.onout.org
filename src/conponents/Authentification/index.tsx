
import { useContext, useState } from "react";
import { useCheckAddress } from "../../hooks/useCheckAddress";
import { Web3ConnecStateContext } from "../WithWeb3Connect";

import './index.css'

const SubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const [emailNews, setEmailNews] = useState(false);
  const [investmentOpportunities, setInvestmentOpportunities] = useState(false);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "email") {
      setEmail(event.target.value)
    };
    if (event.target.name === "emailNews") {
      setEmailNews(event.target.checked)
    };
    if (event.target.name === "investmentOpportunities") {
      setInvestmentOpportunities(event.target.checked)
    };
  };

  const handleSubmit = () => {
    const subscribeData = {
      email,
      emailNews: emailNews ? 1 : 0,
      investmentOpportunities: investmentOpportunities ? 1 : 0,
    };
    console.log('subscribeData', subscribeData);
  };

  return (
    <form>
      <div className="sf-row">
        <label htmlFor="email">Email </label>
        <input
          type="email"
          value={email}
          name="email"
          onChange={onChangeInput}
        />
      </div>
      <div className="sf-row">
        <input
          type="checkbox"
          id="emailNews"
          name="emailNews"
          checked={emailNews}
          onChange={onChangeInput}
        />
        <label htmlFor="emailNews">
          Email me news about your products
        </label>
      </div>
      <div className="sf-row">
        <input
          type="checkbox"
          id="investmentOpportunities"
          name="investmentOpportunities"
          checked={investmentOpportunities}
          onChange={onChangeInput}
        />
        <label htmlFor="investmentOpportunities">
          I am also interested in investment opportunities such as launchpads, farming, etc...
        </label>
      </div>
      <div className="sf-row">
        <button
          type="button"
          onClick={handleSubmit}
        >
          Subscribe
        </button>
      </div>
    </form>
  );
};

type CheckAddressProps = { address: string };

const CheckAddress = ({address} : CheckAddressProps ) => {
  const { isCheckLoading, isSubscribed } = useCheckAddress(address);


  if (isCheckLoading) return <span>Checking your address...</span>;
  if (isSubscribed === undefined) return <></>;

  return isSubscribed
    ? <span>You have subscribed, soon here will be list of our products</span>
    : <div style={{ margin: "0 1rem"}}>
      <p>You have't subscriber, please fill form bellow that subscribe to our company then you will get links list to buy our products (all filds is required)</p>
      <SubscriptionForm/>
    </div>;

};

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