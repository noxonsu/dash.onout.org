import { useContext } from "react";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Web3ConnecStateContext } from "../WithWeb3Connect";

import "./index.css";

const Referal = () => {
  const { account } = useContext(Web3ConnecStateContext);

  return (
    <div className="referalInfo">
      <FaUsers size="4rem" className="icon referalIcon" />
      <div className="referalTextBlock">
        <p className="referalText">
          Earn cryptocurrency by publish the referral code.
        </p>
        <p className="referalAddress">
          {account.address}
          <span
            className="copyLink"
            onClick={() => {
              window.navigator.clipboard.writeText(account.address);
            }}
          >
            [copy]
          </span>
        </p>
        <Link className="linkAffiliale" to="/affiliate">
          Go to affiliate dashboard
        </Link>
      </div>
    </div>
  );
};

export default Referal;
