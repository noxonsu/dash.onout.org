import { useContext, useState, useEffect } from "react";
import { BigNumber } from "bignumber.js";
import {
  PRODUCTS,
  PAYMENT_ADDRESS,
  NETWORKS,
  FIAT_TICKER,
} from "../../constants";
import { send } from "../../helpers/transaction";
import { getPrice } from "../../helpers/currency";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import Modal from "../Modal";

import "./index.css";

type ProductProps = { id: string };

const Product = ({ id }: ProductProps) => {
  const { account, isWeb3Loading } = useContext(Web3ConnecStateContext);
  const [paymentPending, setPaymentPending] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paidFor, setPaidFor] = useState(false);
  const { dispatch, state } = useUser();
  const { products, signed } = state;
  const { name, promoPageLink, description, price: USDPrice } = PRODUCTS[id];

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
    if (!PAYMENT_ADDRESS) return;

    BigNumber.config({
      ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN,
      DECIMAL_PLACES: 18,
    });
    //@ts-ignore
    if (!NETWORKS[account?.networkId]) return;
    //@ts-ignore
    const assetId = NETWORKS[account.networkId].currency.id;
    const data = await getPrice({
      assetId,
      vsCurrency: FIAT_TICKER.toLowerCase(),
    });

    if (data) {
      const cryptoPrice = new BigNumber(USDPrice)
        .div(data[assetId]?.usd)
        .toNumber();

      const params = {
        provider: account.provider,
        from: account.address,
        to: PAYMENT_ADDRESS,
        amount: cryptoPrice,
        // tokenAddress: "",
      };

      return params;
    }

    return false;
  };

  const payForProduct = async () => {
    if (!account.provider || account.wrongNetwork) return;

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

  const [paymentAvailable, setPaymentAvailable] = useState(false);

  useEffect(() => {
    setPaymentAvailable(
      !paymentPending &&
        !paidFor &&
        signed &&
        !isWeb3Loading &&
        account &&
        !account.wrongNetwork
    );
  }, [paymentPending, paidFor, signed, isWeb3Loading, account]);

  return (
    <div className="product">
      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          title={name}
          content={
            <>
              <iframe title={name} src={promoPageLink} frameBorder="0"></iframe>
            </>
          }
        />
      )}

      <div className="header">
        <h3 className="title">{name}</h3>
        <button onClick={toProducts} className="secondaryBtn backBtn">
          Back
        </button>
      </div>

      {!promoPageLink.match(/codecanyon\.net/) && (
        <button className="secondaryBtn" onClick={() => setModalOpen(true)}>
          More details
        </button>
      )}

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
        className={`primaryBtn paymentBtn ${paymentPending ? "pending" : ""}`}
        disabled={!paymentAvailable}
      >
        {paymentPending ? "Pending" : `Buy for $${USDPrice}`}
      </button>
    </div>
  );
};

export default Product;
