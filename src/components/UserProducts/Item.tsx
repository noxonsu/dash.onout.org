import { PRODUCTS } from "../../constants";
import GA from 'react-ga';
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import { PLUGINS } from "../../assets";
import { FiExternalLink } from "react-icons/fi";

import "./index.css";

type ItemProps = {
  id: string;
};

const Item = ({ id }: ItemProps) => {
  // const { dispatch } = useUser();
  const { name, docsLink } = PRODUCTS[id];
  const MCWalletLicense = "67ae17cd-8cfc-46ff-979c-c1a866fce34c";

  return (
    <div className="userProduct">
      <div className="top">
        <h3 className="title">{name}</h3>

        {docsLink && (
          <a
            href={docsLink}
            target="_blank"
            className="secondaryBtn disconnectButton documentationBtn"
            rel="noreferrer"
            onClick={() => {
              GA.event({
                category: id,
                action: 'Open docs'
              });
            }}
          >
            Docs <FiExternalLink />
          </a>
        )}
      </div>

      {id === "multicurrencywallet" && (
        <p>
          Your plugin licence: <strong>{MCWalletLicense}</strong>
        </p>
      )}

      <div className="bottom">
        <a
          href={PLUGINS[id]}
          className="downloadLink"
          download
          onClick={() => {
            GA.event({
              category: id,
              action: 'Download WP version'
            });
          }}
        >
          WP version
        </a>

        {!!PLUGINS[`${id}Static`] && (
          <a
            href={PLUGINS[`${id}Static`]}
            className="downloadLink"
            download
            onClick={() => {
              GA.event({
                category: id,
                action: 'Download static version'
              });
            }}
          >
            Static version
          </a>
        )}
      </div>
    </div>
  );
};

export default Item;
