import { useContext, useState, useEffect } from "react";
import { BigNumber } from "bignumber.js";
import { PRODUCTS, PAYMENT_ADDRESS, NETWORKS } from "../../constants";
import { send } from "../../helpers/transaction";
import { getPrice } from "../../helpers/currency";
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
  const { name, description, price: USDPrice } = PRODUCTS[id];

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

  const getPaymentParameters = async () => {
    BigNumber.config({
      ROUNDING_MODE: BigNumber.ROUND_CEIL,
      DECIMAL_PLACES: 0,
    });
    //@ts-ignore
    if (!NETWORKS[account?.networkId]) return;
    //@ts-ignore
    const assetId = NETWORKS[account.networkId].currency.id;
    const data = await getPrice({
      assetId,
      vsCurrency: "usd",
    });

    if (data) {
      const cryptoPrice = new BigNumber(USDPrice)
        .div(data[assetId]?.usd)
        .toNumber();

      const params = {
        // use a Web3 provider for trouble-free sending
        provider: account.web3Provider,
        from: account.address,
        to: PAYMENT_ADDRESS,
        amount: cryptoPrice,
        // tokenAddress: "",
        // decimals: ,
      };

      return params;
    }

    return false;
  };

  const payForProduct = async () => {
    if (!account.provider) return;

    setPaymentPending(true);

    const params = await getPaymentParameters();

    if (params) {
      const confirmedTx = await send(params);

      if (confirmedTx?.status) {
        dispatch({
          type: UserActions.paid,
          payload: {
            key: `${account.address}_${id}`,
            value: `${new Date().toISOString()}`,
          },
        });
        dispatch({
          type: UserActions.addProduct,
          payload: PRODUCTS[id],
        });
      }
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
      {paidFor ? (
        <p>You already have this product</p>
      ) : (
        <p className="warning">
          Do not leave this page until successful payment
        </p>
      )}
      <button
        onClick={payForProduct}
        className={`paymentBtn ${paymentPending ? "pending" : ""}`}
        disabled={
          paymentPending || paidFor || !signed || isWeb3Loading || !account
        }
      >
        {paymentPending ? "Pending" : `Buy for $${USDPrice}`}
      </button>
    </div>
  );
};

export default Product;
