import React, { useMemo, useState } from "react";
import axios from "../../../helpers/axios";
import { isValidEmail } from "../../../helpers/email";

type SubscriptionFormProps = { address: string, toggleSubscribed: () => void};

const SubscriptionForm = ({ address, toggleSubscribed } : SubscriptionFormProps) => {
  const [email, setEmail] = useState("");
  const [emailNews, setEmailNews] = useState(false);
  const [investmentOpportunities, setInvestmentOpportunities] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);

  const hasWrongFild = useMemo(
    () => (!isValidEmail(email) || !emailNews || !investmentOpportunities),
    [email, emailNews, investmentOpportunities]
  );

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

    setErrors([]);
  };

  const checkFilds = () => {
    const wrongFilds = [];

    if (!isValidEmail(email)) {
      wrongFilds.push("Please enter or fill correct email.");
    };

    if (!emailNews) {
      wrongFilds.push('Checkbox "Email me news" is required');
    };

    if (!investmentOpportunities) {
      wrongFilds.push('Checkbox "Interested in investment opportunities" is required');
    };

    return (wrongFilds as string[]);
  }

  const handleSubmit = async () => {
    const subscribeData = {
      address,
      email,
      emailNews: emailNews ? 1 : 0,
      investmentOpportunities: investmentOpportunities ? 1 : 0,
    };

    if (hasWrongFild) {
      return setErrors(checkFilds())
    }

    try {
      const response = await axios.put("/subscribe", subscribeData);
      if (response?.data?.statusText === "Successfully subscribed!") {
        toggleSubscribed()
      }
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
      {errors.length > 0 && errors.map((error, i) => {
          return (
            <div key={i} style={{color: "red"}}>
              <span>{error}</span>
            </div>
          )
      })}
    </form>
  );
};

export default SubscriptionForm;