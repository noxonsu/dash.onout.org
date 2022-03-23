import { useContext, useState, useEffect } from "react";
import GA from "react-ga";
import { BigNumber } from "bignumber.js";
import {
  PRODUCTS,
  PAYMENT_ADDRESS,
  CONTRACT_ADDRESS_POLYGON,
  NETWORKS,
  FIAT_TICKER,
} from "../../constants";
import { send } from "../../helpers/transaction";
import { sendMessage, STATUS } from "../../helpers/feedback";
// import { stringFromHex, stringToHex } from "../../helpers/format";
import { getPrice } from "../../helpers/currency";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import Modal from "../Modal";

import "./index.css";

type ProductProps = { 
  id: string,
  networkPolygon: any,
  setNetworkPolygon:  any,
};


const Product = ({ id, networkPolygon, setNetworkPolygon }: ProductProps) => {
  const { account, isWeb3Loading } = useContext(Web3ConnecStateContext);
  const [paymentPending, setPaymentPending] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paidFor, setPaidFor] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const sendFeedback = ({
    networkId,
    amount,
    prefix,
    status,
    extra,
  }: {
    networkId?: number;
    amount?: number;
    prefix: string;
    status: STATUS;
    extra?: string;
  }) => {
    sendMessage({
      msg: `(${prefix} from: ${account.address}) ${
        networkId ? `network: ${networkId}; ` : ""
      }product id: ${id}; USD cost: ${USDPrice}; ${
        amount ? `crypto cost: ${amount}; ` : ""
      }date: ${new Date().toISOString()};${extra ? ` ${extra}` : ""}`,
      status,
    });
  };

  const getPaymentParameters = async (networkId: number) => {
    if (!PAYMENT_ADDRESS || !USDPrice) return;
    //@ts-ignore
    const assetId = NETWORKS[networkId].currency.id;
    const data = await getPrice({
      assetId,
      vsCurrency: FIAT_TICKER.toLowerCase(),
    });

    if (data) {
      BigNumber.config({
        ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN,
        DECIMAL_PLACES: 18,
      });

      if (networkId === 137) {
        return {
          provider: account.provider,
          from: account.address,
          to: PAYMENT_ADDRESS,
          amount: new BigNumber(USDPrice).div(data[assetId]?.usd).toNumber(),
          contractAddress: CONTRACT_ADDRESS_POLYGON,
        };
      } else {
        return {
          provider: account.provider,
          from: account.address,
          to: PAYMENT_ADDRESS,
          amount: new BigNumber(USDPrice).div(data[assetId]?.usd).toNumber(),
          // tokenAddress: "",
        };
      }
    }

    return false;
  };

  const payForProduct = async () => {
    if (!account.provider || account.wrongNetwork) return;

    setErrorMessage("");
    setPaymentPending(true);

    // fetch the current id right before prices to be sure of the correct currency for this network
    const networkId = await account.provider.eth.net.getId();
    //@ts-ignore
    if (!NETWORKS[networkId]) {
      setErrorMessage("Wrong network");
      return setPaymentPending(false);
    }

    const params = await getPaymentParameters(networkId);

    if (params) {
      try {
        const confirmedTx = await send({
          ...params,
          onHash: (hash) => {
            sendFeedback({
              networkId,
              amount: params.amount,
              prefix: "Successful payment",
              status: STATUS.success,
              extra: `tx hash: ${hash}`,
            });
          },
        });

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
      } catch (error: any) {
        console.error(error);
        sendFeedback({
          networkId,
          amount: params.amount,
          prefix: "FAIL",
          status: STATUS.danger,
          extra: `error: ${error.code} ${error.message}`,
        });

        if (error?.code !== 4001) {
          setErrorMessage(error.message);
        }
      }
    }
    setPaymentPending(false);
  };

  const changeNetworks = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });
      setNetworkPolygon(true);
    } catch (err) {
      console.log('error');
    }
  }

  const [paymentAvailable, setPaymentAvailable] = useState(false);

  useEffect(() => {
    setPaymentAvailable(
      !!USDPrice &&
        !paymentPending &&
        !paidFor &&
        signed &&
        !isWeb3Loading &&
        account &&
        !account.wrongNetwork
    );
  }, [paymentPending, paidFor, signed, isWeb3Loading, account, USDPrice]);


  return (
    <div className="product">
      {modalOpen && (
        <Modal
          onClose={() => {
            setModalOpen(false);

            GA.event({
              category: id,
              action: `Close more info`,
            });
          }}
          title={name}
          content={
            promoPageLink ? (
              <iframe title={name} src={promoPageLink} frameBorder="0"></iframe>
            ) : (
              <h1 style={{ textAlign: "center" }}>Coming soon...</h1>
            )
          }
        />
      )}

      <div className="header">
        <h3 className="title">{name}</h3>
        <button
          onClick={() => {
            toProducts();
          window.history.back();
            
            GA.event({
              category: id,
              action: "Back to Product list",
            });
          }}
          className="secondaryBtn backBtn"
        >
          Back
        </button>
      </div>

      {!promoPageLink.match(/codecanyon\.net/) && (
        <button
          className="secondaryBtn"
          onClick={() => {
            setModalOpen(true);

            GA.event({
              category: id,
              action: `Open more info`,
            });
          }}
        >
          More details
        </button>
      )}

      {description && <p>{description}</p>}
      {paidFor ? (
        <p>You already have this product</p>
      ) : (
        <p className="warning">
          Do not leave this page until successful payment. If you have any
          problems with the payment, please contact us.
        </p>
      )}
      <p className="notice">The price may vary slightly</p>

      {errorMessage && <p className="error">Error: {errorMessage}</p>}

      <button
        onClick={() => {
          payForProduct();
          GA.event({
            category: id,
            action: 'Press on the "Buy" button',
          });
          sendFeedback({
            networkId: account?.networkId,
            prefix: "START payment",
            status: STATUS.attention,
          });
        }}
        className={`primaryBtn paymentBtn ${paymentPending ? "pending" : ""}`}
        disabled={!paymentAvailable}
      >
        {paymentPending
          ? "Pending"
          : USDPrice
          ? `Buy for $${USDPrice}`
          : "Not available"}
      </button>
      <p className="notes">Use <span
          className={`notesSpan ${networkPolygon ? "active" : ""}`}
          onClick={() => {
            changeNetworks()
          }} 
        > Polygon</span> to get 50 SWAP tokens as bonus</p>
    </div>
  );
};

export default Product;
