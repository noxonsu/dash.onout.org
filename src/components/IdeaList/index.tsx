import { useState } from "react";
import { IDEAS } from "../../constants";
import { getLocal, saveLocal } from "../../helpers/storage";

import "./index.css";

const votedIdeasStorageItemKey = 'VOTED_IDEAS';
const savedVotedIdeas = JSON.parse(getLocal(votedIdeasStorageItemKey) || '[]') ;

const IdeaList = () => {
  const [votedIdeas, setVotedIdeas] = useState<string[]>(savedVotedIdeas);

  const onVoteIdea = (id: string) => {
    if (!votedIdeas.includes(id)) {
      const newVotedIdeas = [...votedIdeas, id];
      setVotedIdeas(newVotedIdeas);
      saveLocal({
        key: votedIdeasStorageItemKey,
        value: JSON.stringify(newVotedIdeas),
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
