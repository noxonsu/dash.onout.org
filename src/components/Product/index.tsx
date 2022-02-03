import { useContext, useState, useEffect } from "react";
import { PRODUCTS, PAYMENT_ADDRESS } from "../../constants";
import { send } from "../../helpers/transaction";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";

import "./index.css";

type ProductProps = { id: string };

const Product = ({ id }: ProductProps) => {
  const { account, isWeb3Loading } = useContext(Web3ConnecStateContext);
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

  const payForProduct = async () => {
    if (!account.provider) return;

    setPaymentPending(true);

    // TODO: calc the price from USD to Crypto
    const amount = 0.001;

    const result = await send({
      provider: account.provider,
      from: account.address,
      to: PAYMENT_ADDRESS,
      amount,
      //
      tokenAddress: "0x8b979c2DEF34A53608004e00aC5f7dE4dd32Cf79",
      decimals: 18,
    });

    console.group("%c payment result", "color: orange; font-size: 14px");
    console.log("result: ", result);
    console.groupEnd();

    if (result) {
      dispatch({
        type: UserActions.addProduct,
        payload: PRODUCTS[id],
      });
    }

    setPaymentPending(false);
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
        disabled={
          paymentPending || paidFor || !signed || isWeb3Loading || !account
        }
      >
        {paymentPending ? "Pending..." : `Buy for $${price}`}
      </button>
    </div>
  );
};

export default Product;
