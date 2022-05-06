import { useContext, useState, useEffect } from "react";
import {
  bonusAndDiscountContractsByNetworkId,
  cashbackTokenAddresses,
} from "../../constants";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import bonusAndDiscountContractAbi from "../../constants/bonusAndDiscountContractAbi.json";

import "./index.css";

const Affiliate = () => {
  const {
    account: { provider, address, networkId, wrongNetwork },
  } = useContext(Web3ConnecStateContext);

  const [bonusToken, setBonusToken] = useState(0);
  const [referal, setReferal] = useState(0);

  useEffect(() => {
    const fetchReferalInfo = async () => {
      try {
        if (
          wrongNetwork ||
          !networkId ||
          !bonusAndDiscountContractsByNetworkId[networkId] ||
          !cashbackTokenAddresses[networkId]
        ) {
          setBonusToken(0);
          setReferal(0);
          return;
        }

        const from = address;

        const contract = new provider.eth.Contract(
          bonusAndDiscountContractAbi,
          bonusAndDiscountContractsByNetworkId[networkId],
          {
            from,
          }
        );

        await contract.methods
          .getReferalInfo(from)
          .call()
          .then((res: any) => {
            setBonusToken(res[1]);
            setReferal(res[2]);
          });
      } catch (e) {
        console.error(e);
      }
    };

    fetchReferalInfo();
  }, [address, networkId, wrongNetwork, provider.eth.Contract]);

  return (
    <div className="affiliate">
      <h3 className="title">
        Earn cryptocurrency by publish the referral code.{" "}
      </h3>
      <p className="affiliateInfo">
        Since April 2022 you have invited{" "}
        <span className="referals">{referal}</span> clients and earn{" "}
        <span className="swapTokens">{bonusToken}</span> SWAP
      </p>
      <p className="affiliateContentText">
        Your promocode is{" "}
        <span
          className="affiliateAddress"
          onClick={(e: any) => {
            window.navigator.clipboard.writeText(address);
          }}
        >
          {address}
        </span>{" "}
        (the same as your address). Share your promo code in any suitable way:
        put it on your website or just send it to your friends or other
        potentially interested parties. When someone enters your promocode when
        buying a product using BSC network you will receive SWAP tokens
        immediately. You can use SWAP to earn BNB rewards at
        <a
          className="affiliateLink"
          href="https://farm.onout.org/"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          farm.onout.org
        </a>
        .
      </p>
      <div className="faq">
        <p className="faqText">
          <span className="fagSpan">Q:</span> Why BNB?
        </p>
        <p className="faqText">
          <span className="fagSpan">A:</span> 90% of our clients pay in BNB. In
          Ethereum the gas costs too expensive. But if you know about such
          sale just contact support.
        </p>
      </div>
      <div className="faq">
        <p className="faqText">
          <span className="fagSpan">Q:</span> A customer bought product using my
          promocode, but I haven't received anything.
        </p>
        <p className="faqText">
          <span className="fagSpan">A:</span> Don't worry just send details (transaction link
          and customer's email) to
          <a
            className="affiliateLink"
            href="mailto:support@onout.org"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            support@onout.org{" "}
          </a>
          (or
          <a
            className="affiliateLink"
            href="https://t.me/onoutsupportbot/?start=dash_affiliate"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            Telegram bot
          </a>
          ).
        </p>
      </div>
    </div>
  );
};

export default Affiliate;
