import { useState, useEffect } from "react";
import { PRODUCTS } from "../../constants";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";

import "./index.css";

type ItemProps = {
  id: string;
};

const Item = ({ id }: ItemProps) => {
  const { state, dispatch } = useUser();
  const { name } = PRODUCTS[id];

  const download = () => {
    // TODO
  };

  const removeProduct = () => {
    dispatch({
      type: UserActions.removeProduct,
      payload: id,
    });
  };

  return (
    <div className="userProduct">
      <div className="top">
        <h3 className="title">{name}</h3>
      </div>

      <div className="bottom">
        <button onClick={download} className="downloadBtn">
          Download
        </button>
      </div>
    </div>
  );
};

export default Item;
