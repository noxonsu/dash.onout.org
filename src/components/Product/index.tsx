import { useContext, useState, useEffect } from "react";
import { ImArrowUpRight2 } from "react-icons/im";
import { BigNumber } from "bignumber.js";
import { PRODUCTS, PAYMENT_ADDRESS, NETWORKS } from "../../constants";
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
  const [wrongNetwork, setWrongNetwork] = useState(false);
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

    // TODO: find better solution. Use a different connection way
    // quick fix the problem when user can switch to testnet and pay there
    // with current provider we can get a network error if user on a
    // different network then on first connection
    try {
      await account.provider.getNetwork();
    } catch (error) {
      // Error: underlying network changed...
      console.group("%c payment", "color: red");
      console.error(error);
      console.groupEnd();
      setWrongNetwork(true);
      return;
    }

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
      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          iframeSource={promoPageLink}
          iframeTitle={name}
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
      {wrongNetwork && (
        <p className="error">
          You cannot pay on this network. Switch to supported network and reload
          this page
        </p>
      )}
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
