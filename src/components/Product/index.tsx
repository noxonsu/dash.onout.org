import { useContext, useState, useEffect } from "react";
import GA from "react-ga";
import { BigNumber } from "bignumber.js";
import { PRODUCTS, PAYMENT_ADDRESS, NETWORKS } from "../../constants";
import { send } from "../../helpers/transaction";
import { sendMessage, STATUS } from "../../helpers/feedback";
// import { stringFromHex, stringToHex } from "../../helpers/format";
import { getOracleNativePrice } from "../../helpers/currency";
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

  const getPaymentParameters = async (chainId: number) => {
    if (!PAYMENT_ADDRESS || !USDPrice) return;

    const { provider, address } = account;
    const nativePrice = await getOracleNativePrice({
      provider,
      from: address,
      chainId,
    });

    if (nativePrice && nativePrice > 0) {
      BigNumber.config({
        ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN,
        DECIMAL_PLACES: 18,
      });

      return {
        provider: account.provider,
        from: account.address,
        to: PAYMENT_ADDRESS,
        amount: new BigNumber(USDPrice).div(nativePrice).toNumber(),
      };
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
    } else {
      // TODO: show something about payment: "Payment unavailable because of ..."
      // maybe in modal
    }
    setPaymentPending(false);
  };

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
    </div>
  );
};

export default Product;
