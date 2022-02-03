import { useCallback, useEffect, useContext, useState } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { PRODUCTS, NETWORKS } from "../../constants";
import useUser from "../../hooks/useUser";
import { UserActions } from "../UserProvider";
import ProductList from "../ProductList";
import UserProducts from "../UserProducts";
import Product from "../Product";

import "./index.css";

const Sections = () => {
  const { account } = useContext(Web3ConnecStateContext);
  const { state, dispatch } = useUser();
  const { signed, view, products } = state;

  // For now, while we save it in localStorage, retrive all saved user products from here
  const retriveSavedProducts = useCallback(() => {
    if (signed && Object.keys(window.localStorage).length && !products.length) {
      const paymentRegExp = new RegExp(`${account.address}_*`, "g");

      Object.keys(window.localStorage).forEach((key) => {
        const match = key.match(paymentRegExp);

        if (match) {
          // + 1 for underscore
          const id = key.slice(account.address.length + 1);

          if (PRODUCTS[id]) {
            dispatch({
              type: UserActions.addProduct,
              payload: PRODUCTS[id],
            });
          }
        }
      });
    }
  }, [account, dispatch, signed, products.length]);

  useEffect(() => retriveSavedProducts(), [retriveSavedProducts]);

  const Tabs = (
    <div className="tabs">
      <button
        className={`${view === "products" ? "active" : ""}`}
        onClick={() => {
          dispatch({
            type: UserActions.changeView,
            payload: "products",
          });
        }}
      >
        Products
      </button>
      {signed && (
        <button
          className={`${view === "userProducts" ? "active" : ""}`}
          onClick={() => {
            dispatch({
              type: UserActions.changeView,
              payload: "userProducts",
            });
          }}
        >
          My products
        </button>
      )}
    </div>
  );

  const [wrongNetwork, setWrongNetwork] = useState(true);

  useEffect(() => {
    //@ts-ignore
    if (NETWORKS[account.networkId]) {
      setWrongNetwork(false);
    }
  }, [account]);

  if (!signed || wrongNetwork) return null;

  return (
    <div>
      {Tabs}

      {view === "products" && <ProductList />}
      {view === "userProducts" && signed && <UserProducts />}
      {!!PRODUCTS[view] && <Product id={view} />}
    </div>
  );
};

export default Sections;
