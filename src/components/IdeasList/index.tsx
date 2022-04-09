import { IDEAS } from "../../constants";

import "./index.css";


const IdeaList = () => {
  return (
    IDEAS.length > 0
      ? (
        <>
          <div className='ideasHeader'>
            <h2>Ideas</h2>
            <p>Here are ideas for future development. What you want to see on our marketplace next? Click on ideas and we will hear your vote! Discuss in discord: https://discord.gg/VwKEmHEgVN</p>
          </div>
          <div className="ideaList">
            {
              IDEAS.map((idea, index) => {
                return (
                  <div key={index}>
                    {idea.name}
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
