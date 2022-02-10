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

  return (
    <div className="userProduct">
      <div className="top">
        <h3 className="title">{name}</h3>
      </div>

      <div className="bottom">
        <a href={PLUGINS[id]} className="downloadLink" download>
          Download
        </a>
      </div>
    </div>
  );
};

export default Item;
