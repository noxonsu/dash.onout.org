import { useCallback, useEffect, useContext, useState } from "react";
import GA from "react-ga";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { PRODUCTS } from "../../constants";
import useUser from "../../hooks/useUser";
import { UserActions } from "../UserProvider";
import { Link } from "react-router-dom";

import "./index.css";

const Tabs = ({ newView }: any) => {
  const { account } = useContext(Web3ConnecStateContext);
  const { state, dispatch } = useUser();
  const { signed, subscribed, view, products } = state;

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

  if (!signed || !subscribed || account.wrongNetwork) return null;

  return (
    <div className="tabs">
      <Link
        to="/"
        className={`tabBtn ${newView === "" ? "active" : ""}`}
        onClick={() => {
          dispatch({
            type: UserActions.changeView,
            payload: "products",
          });

          GA.event({
            category: "Pages Section",
            action: "Open Product list",
          });
        }}
      >
        Products
      </Link>
      <Link
        to="/presale"
        className={`tabBtn ${newView === "presale" ? "active" : ""}`}
        onClick={() => {
          dispatch({
            type: UserActions.changeView,
            payload: "presale",
          });

          GA.event({
            category: "Pages Section",
            action: "Open Presale list",
          });
        }}
      >
        Presale
      </Link>
      {signed && (
        <Link
          to="/user-products"
          className={`tabBtn ${newView === "user-products" ? "active" : ""}`}
          onClick={() => {
            dispatch({
              type: UserActions.changeView,
              payload: "userProducts",
            });

            GA.event({
              category: "Page Sections",
              action: `Open User's Products`,
            });
          }}
        >
          My products
        </Link>
      )}
    </div>
  );
};

export default Tabs;
