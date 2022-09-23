import { useCallback, useContext, useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import { FIAT_TICKER, IDEAS, NETWORKS, PAYMENT_ADDRESS } from "../../constants";
import { getPrice } from "../../helpers/currency";
import { sendMessage, STATUS } from "../../helpers/feedback";
import { getLocal, saveLocal } from "../../helpers/storage";
import { send } from "../../helpers/transaction";
import { Web3ConnecStateContext } from "../WithWeb3Connect";

import "./index.css";

const votedIdeasStorageItemKeyPostfix = '::votedIdeas';
const initialVotedJSON = '[]';

const IdeaList = () => {
  const {
    account: {
      address,
      addressUSDValue,
      networkId,
      provider,
      wrongNetwork,
    }
  } = useContext(Web3ConnecStateContext);

  const ideasKeys = Object.keys(IDEAS);

  const savedVotedIdeas = JSON.parse(address ? (getLocal(`${address}${votedIdeasStorageItemKeyPostfix}`) || initialVotedJSON) : initialVotedJSON);
  const [votedIdeas, setVotedIdeas] = useState<string[]>(savedVotedIdeas);

  useEffect(() => {
    const newSavedVotedIdeas = JSON.parse(address ? (getLocal(`${address}${votedIdeasStorageItemKeyPostfix}`) || initialVotedJSON) : initialVotedJSON);
    setVotedIdeas(newSavedVotedIdeas);
  }, [address]);

  const onVoteIdea = useCallback(async (ideaId: string) => {
    const getParams = async () => {
      const { id, price } = IDEAS[ideaId];
      if (!PAYMENT_ADDRESS || !price || !networkId || !provider || wrongNetwork) throw new Error("Can't generate params for transaction");

      const { symbol } = NETWORKS[networkId].currency;
      const assetUSDPrice = await getPrice({
        symbol,
        vsCurrency: FIAT_TICKER,
      });

      if (!assetUSDPrice) throw new Error("Can't generate amount of asset without price");

      BigNumber.config({
        ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN,
        DECIMAL_PLACES: 18,
      });

      const amount = new BigNumber(price)
        .div(assetUSDPrice)
        .toNumber();

      const params = {
        from: address,
        to: PAYMENT_ADDRESS,
        amount,
        provider,
        networkId,
        onHash: (hash: any) => {
          sendMessage({
            msg: `
              Vote for idea: ${id};
              txId: ${hash};
              from: ${address};
              amount: ${amount};
              networkId: ${networkId};
              usd_value: ${addressUSDValue};
              date: ${new Date().toISOString()};
            `,
            status: STATUS.voteIdea,
          });

          const newVotedIdeas = [...votedIdeas, id];
          setVotedIdeas(newVotedIdeas);
          saveLocal({
            key: `${address}${votedIdeasStorageItemKeyPostfix}`,
            value: JSON.stringify(newVotedIdeas),
          });
        },
      }

      return params
    }

    if (!votedIdeas.includes(ideaId)) {
      try {
        const params = await getParams();

        await send(params);

      } catch (error: any) {
        console.error(error?.message || error)
      }
    }
  }, [address, addressUSDValue, networkId, provider, votedIdeas, wrongNetwork]);

  return (
    ideasKeys.length > 0
      ? (
        <>
          <div className='ideaListHeader'>
            <h2>Ideas</h2>
            <p>
              Here are ideas for future development. What you want to see on our marketplace next?
              <br/>
              Click on ideas and we will hear your vote!
              {" "}
              <a className="defaultLink" href="https://discord.gg/VwKEmHEgVN" target="_blank" rel="noreferrer">Discuss in discord</a>
            </p>
          </div>
          <div className="ideaList">
            {
              ideasKeys.map((ideaId) => {
                const { id, name, link } = IDEAS[ideaId];

                const hasVoted = votedIdeas.includes(id);

                return (
                  <div className="ideaCard" key={ideaId}>
                    <h3 className="contentTitle">{name}</h3>
                    <div className='boxLink'>
                      {
                        link
                        ? <a className="secondaryBtn ideaActionBtn" type="button" href={link} target="_blank" rel="noreferrer">More Info</a>
                        : hasVoted
                          ? <button className="secondaryBtn ideaActionBtn" type="button" disabled>Voted</button>
                          : <button className="primaryBtn ideaActionBtn" type="button" onClick={() => onVoteIdea(id)}>Vote</button>
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </>
      )
      : null
  );
};

export default IdeaList;
