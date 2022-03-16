import React, { useMemo, useState } from "react";
import GA from 'react-ga';
import axios from "../../../helpers/axios";
import { isValidEmail } from "../../../helpers/email";

import "../index.css";

type SubscriptionFormProps = { address: string; toggleSubscribed: () => void };

const SubscriptionForm = ({
  address,
  toggleSubscribed,
}: SubscriptionFormProps) => {
  const [email, setEmail] = useState("");
  const [emailNews, setEmailNews] = useState(false);
  const [investmentOpportunities, setInvestmentOpportunities] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);

  const hasWrongFild = useMemo(() => !isValidEmail(email), [email]);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
    if (event.target.name === "emailNews") {
      setEmailNews(event.target.checked);
    }
    if (event.target.name === "investmentOpportunities") {
      setInvestmentOpportunities(event.target.checked);
    }

    setErrors([]);
  };

  const checkFilds = () => {
    const wrongFilds = [];

    if (!isValidEmail(email)) {
      wrongFilds.push("Please enter or fill correct email.");
    }

    return wrongFilds as string[];
  };

  const handleSubmit = async () => {
    const subscribeData = {
      address,
      email,
      emailNews: emailNews ? 1 : 0,
      investmentOpportunities: investmentOpportunities ? 1 : 0,
    };

    if (hasWrongFild) {
      return setErrors(checkFilds());
    }

    try {
      const response = await axios.put("/subscribe", subscribeData);
      if (response?.data?.statusText === "Successfully subscribed!") {
        toggleSubscribed();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="subscriptionForm">
      <div className="sf-row sf-rowColumn">
        <label htmlFor="email">Email </label>
        <input
          className="primaryInput"
          id="email"
          type="email"
          value={email}
          name="email"
          onChange={onChangeInput}
        />
      </div>
      <div className="sf-row">
        <input
          className="primaryCheckbox"
          type="checkbox"
          id="emailNews"
          name="emailNews"
          checked={emailNews}
          onChange={onChangeInput}
        />
        <label htmlFor="emailNews">Email me news about your products</label>
      </div>
      <div className="sf-row">
        <input
          className="primaryCheckbox"
          type="checkbox"
          id="investmentOpportunities"
          name="investmentOpportunities"
          checked={investmentOpportunities}
          onChange={onChangeInput}
        />
        <label htmlFor="investmentOpportunities">
          I am also interested in investment opportunities such as launchpads,
          farming, etc.
        </label>
      </div>
      <div className="sf-row">
        <button
          type="button"
          className="primaryBtn"
          onClick={() => {
            handleSubmit();
            GA.event({
              category: 'Subscription',
              action: 'Press on Subscribe button',
            });
          }}
        >
          Subscribe
        </button>
      </div>
      {errors.length > 0 &&
        errors.map((error, i) => {
          return (
            <div key={i} style={{ color: "red" }}>
              <span>{error}</span>
            </div>
          );
        })}
    </form>
  );
};

export default SubscriptionForm;
