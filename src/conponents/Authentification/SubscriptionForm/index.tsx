import { useState } from "react";
import axios from "../../../helpers/axios";

type SubscriptionFormProps = { address: string };

const SubscriptionForm = ({address} : SubscriptionFormProps) => {
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

  const handleSubmit = async () => {
    const subscribeData = {
      address,
      email,
      emailNews: emailNews ? 1 : 0,
      investmentOpportunities: investmentOpportunities ? 1 : 0,
    };
    console.log('subscribeData', subscribeData);
    try {
      const response = axios.post("/subscribe", subscribeData);
      console.log('response', response)
    } catch (error) {
      console.log(error);
    };
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

export default SubscriptionForm;