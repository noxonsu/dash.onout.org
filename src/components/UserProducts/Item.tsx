import { PRODUCTS } from "../../constants";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import { PLUGINS } from "../../assets";

import "./index.css";

type ItemProps = {
  id: string;
};

const Item = ({ id }: ItemProps) => {
  // const { dispatch } = useUser();
  const { name } = PRODUCTS[id];
  const MCWalletLicense = "67ae17cd-8cfc-46ff-979c-c1a866fce34c";

  return (
    <div className="userProduct">
      <div className="top">
        <h3 className="title">{name}</h3>
      </div>

      {id === "multicurrencywallet" && <p>Your plugin licence: <strong>{MCWalletLicense}</strong></p>}

      <div className="bottom">
        <a href={PLUGINS[id]} className="downloadLink" download>
          Download
        </a>
      </div>
    </div>
  );
};

export default Item;
