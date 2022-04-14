import { useContext, useEffect, useState } from "react";
import { IDEAS } from "../../constants";
import { getUserUSDValueOfAddress } from "../../helpers/balance";
import { sendMessage, STATUS } from "../../helpers/feedback";
import { getLocal, saveLocal } from "../../helpers/storage";
import { Web3ConnecStateContext } from "../WithWeb3Connect";

import "./index.css";

const votedIdeasStorageItemKeyPostfix = '::votedIdeas';
const initialVotedJSON = '[]';

const IdeaList = () => {
  const { account: { address } } = useContext(Web3ConnecStateContext);

  const savedVotedIdeas = JSON.parse(address ? (getLocal(`${address}${votedIdeasStorageItemKeyPostfix}`) || initialVotedJSON) : initialVotedJSON);
  const [votedIdeas, setVotedIdeas] = useState<string[]>(savedVotedIdeas);

  useEffect(() => {
    const newSavedVotedIdeas = JSON.parse(address ? (getLocal(`${address}${votedIdeasStorageItemKeyPostfix}`) || initialVotedJSON) : initialVotedJSON);
    setVotedIdeas(newSavedVotedIdeas);
  }, [address]);

  const onVoteIdea = async (id: string) => {
    if (!votedIdeas.includes(id)) {
      const newVotedIdeas = [...votedIdeas, id];
      setVotedIdeas(newVotedIdeas);
      saveLocal({
        key: `${address}${votedIdeasStorageItemKeyPostfix}`,
        value: JSON.stringify(newVotedIdeas),
      });

      const addressUSDValue = await getUserUSDValueOfAddress(address);

      sendMessage({
        msg: `
          Vote for idea: ${id};
          from: ${address};
          usd_value: ${addressUSDValue || 0};
          date: ${new Date().toISOString()};
        `,
        status: STATUS.voteIdea,
      });
    }
  };

  return (
    IDEAS.length > 0
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
              IDEAS.map((idea, index) => {
                const { id, name, link } = idea;

                const hasVoted = votedIdeas.includes(id);

                return (
                  <div className="ideaCard" key={index}>
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
