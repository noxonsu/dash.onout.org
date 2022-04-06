import { useContext, useState, useEffect } from "react";
import ERC20_ABI from "../../constants/erc20abi.json";
import { CONTRACT_ADDRESS_POLYGON } from "../../constants";
import { Web3ConnecStateContext } from "../WithWeb3Connect";

import "./index.css";


const Affiliate = () => {
  const { account } = useContext(Web3ConnecStateContext)
	
	const [bonusToken, setBonusToken] = useState();
	const [referal, setReferal] = useState();


(async function () {
    try{
			const provider = account.provider;
			const from = account.address;
			const contract = new provider.eth.Contract(ERC20_ABI, CONTRACT_ADDRESS_POLYGON, {
				from,
			});
			await contract.methods.getReferalInfo(from).call()
			.then((res:any) => {
				setBonusToken(res[1])
				setReferal(res[2])
			})
		} catch (error) {
			console.log(error)
		}
  }())

  return (
    <div className='affiliate'>
        <h3 className="title">Earn cryptocurrency by publish the referral code. </h3>
        <p className="affiliateInfo">Since April 2022 you have invited <span className="referals">{!referal ? 0 : referal}</span> clients and earn <span className="swapTokens">{!bonusToken ? 0 : bonusToken}</span> SWAP</p>
        <p className="affiliateContentText">
            Your promocode is <span 
            className="affiliateAddress"
            onClick={(e:any) => {
                window.navigator.clipboard.writeText(account.address)
            }}>{`{${account.address.slice(0, 20)} ${account.address.slice(20, account.address.length)}}`}</span> (the same as your address). Share your promo code in any suitable way: put it on your website or just send it to your friends or other potentially interested parties; When someone enters your promocode when buying a product using BNB network you will receive SWAP tokens immediately. You can use swap to earn BNB rewards at
            <a className="affiliateLink" href="https://farm.onout.org/" target="_blank"> farm.onout.org</a> 
        .</p>
        <div className="faq">
            <p className="faqText"><span className="fagSpan">Q:</span> Why BNB?</p>
            <p className="faqText"><span className="fagSpan">A:</span> 90% of our clients pay in BNB. In Ethereum the gas costs too expensive. But if you are know about such sale just contact support.</p>
        </div>
        <div className="faq">
            <p className="faqText"><span className="fagSpan">Q:</span> A customer bought product using my promocode, but i haven't received anything</p>
            <p className="faqText"><span className="fagSpan">A:</span> don't worry just send details (tx and customer's email) to
            	<a className="affiliateLink" href="mailto:support@onout.org" target="_blank"> support@onout.org </a>
            	(or
            	<a className="affiliateLink" href="https://t.me/onoutsupportbot/?start=dash_affiliate" target="_blank"> https://t.me/onoutsupportbot/?start=dash_affiliate</a>)
            </p>
        </div>
    </div> 
  );
};

export default Affiliate;
