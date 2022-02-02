import { useState, useEffect } from "react";
import { PRODUCTS } from "../../constants";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";

import "./index.css";

type ProductProps = { id: string };

const Product = ({ id }: ProductProps) => {
  const [paymentPending, setPaymentPending] = useState(false);
  const [paidFor, setPaidFor] = useState(false);
  const { dispatch, state } = useUser();
  const { products, signed } = state;
  const { name, description, price } = PRODUCTS[id];

  useEffect(() => {
    const inProducts =
      !!products.length && products.find((product) => product.id === id);

    if (inProducts) setPaidFor(true);
  }, [id, products]);

  const toProducts = () => {
    dispatch({
      type: UserActions.changeView,
      payload: "products",
    });
  };

  const payForProduct = () => {
    setPaymentPending(true);

    // TODO: payment and confirmation
    const isOk = true;

    setTimeout(() => {
      if (isOk) {
        dispatch({
          type: UserActions.addProduct,
          payload: PRODUCTS[id],
        });
      }

      setPaymentPending(false);
    }, 2000);
  };

  return (
    <div className="product">
      <div className="header">
        <h3 className="title">{name}</h3>
        <button onClick={toProducts} className="backBtn">
          Back
        </button>
      </div>
      <p>{description}</p>
      {paidFor && <p>You already have this product</p>}
      <button
        onClick={payForProduct}
        className="paymentBtn"
        disabled={paymentPending || paidFor || !signed}
      >
        {paymentPending ? "Pending..." : `Buy for $${price}`}
      </button>
    </div>
  );
};

export default Product;
