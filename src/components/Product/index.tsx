import { useContext, useState, useEffect, useCallback } from "react";
import GA from "react-ga";
import { BigNumber } from "bignumber.js";
import {
  PRODUCTS,
  PAYMENT_ADDRESS,
  NETWORKS,
  FIAT_TICKER,
  EVM_ADDRESS_REGEXP,
  bonusAndDiscountContractsByNetworkId,
  cashbackTokenAddresses,
} from "../../constants";
import { send, importToken } from "../../helpers/transaction";
import { sendMessage, STATUS } from "../../helpers/feedback";
// import { stringFromHex, stringToHex } from "../../helpers/format";
import { getPrice } from "../../helpers/currency";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import Modal from "../Modal";
import bscIcon from "../../assets/images/bsc.svg";
import ploygonIcon from "../../assets/images/polygon.svg";
import swapIcon from "../../assets/images/swap.svg";

import "./index.css";

type ProductProps = {
  id: string;
};

const Product = ({ id }: ProductProps) => {
  const {
    account,
    account: {
      isPolygonNetwork,
      isBSCNetwork,
      networkId,
      address,
      addressUSDValue,
      provider,
      wrongNetwork,
    },
    isWeb3Loading,
  } = useContext(Web3ConnecStateContext);

  const { dispatch, state } = useUser();
  const { products, signed } = state;

  const [paymentPending, setPaymentPending] = useState(false);
  const [paidFor, setPaidFor] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [wantToEnterPromoCode, setWantToEnterPromoCode] = useState(false);
  const [promoAddress, setPromoAddress] = useState("");

  const {
    name,
    promoPageLink,
    description,
    price: USDPrice,
    productId,
  } = PRODUCTS[id];

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

  const sendFeedback = useCallback(
    ({
      amount,
      prefix,
      status,
      extra,
    }: {
      amount?: number;
      prefix: string;
      status: STATUS;
      extra?: string;
    }) => {
      sendMessage({
        msg: `
        ${prefix} from: ${address};
        usd_value: ${addressUSDValue || "don't have usd_value"}
        Network: ${networkId || "unsupported"};
        Product id: ${id};
        USD cost: ${USDPrice};
        Crypto cost: ${amount || "don't have amount"};
        Date: ${new Date().toISOString()};
        ${extra || ""}
      `,
      status,
    });
  }, [address, networkId, addressUSDValue, USDPrice, id]);

  const getPaymentParameters = useCallback(async () => {
    if (!PAYMENT_ADDRESS || !USDPrice || !networkId) return;

    const assetId = NETWORKS[networkId].currency.id;
    const data = await getPrice({
      assetId,
      vsCurrency: FIAT_TICKER.toLowerCase(),
    });

    if (!data) return;
    BigNumber.config({
      ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN,
      DECIMAL_PLACES: 18,
    });

    const bonusAndDiscountContract =
      bonusAndDiscountContractsByNetworkId[networkId];
    const cashbackTokenAddress = cashbackTokenAddresses[networkId];

    const hasValidPromoCode = !!(
      bonusAndDiscountContract && promoAddress?.match(EVM_ADDRESS_REGEXP)
    );
    const canGetDiscount = hasValidPromoCode && USDPrice > 100;

    const finalProductPriceInUSD = canGetDiscount ? USDPrice - 50 : USDPrice;

    const assetUSDPrice = data[assetId]?.usd;
    const amount = new BigNumber(finalProductPriceInUSD)
      .div(assetUSDPrice)
      .toNumber();
      
    return {
      provider,
      networkId,
      from: address,
      to: PAYMENT_ADDRESS,
      amount,
      bonusAndDiscountContract,
      cashbackTokenAddress,
      promocode: hasValidPromoCode && promoAddress,
      productId,
      onHash: (hash: any) => {
        sendFeedback({
          amount,
          prefix: "Successful payment",
          status: STATUS.success,
          extra: `tx hash: ${hash}`,
        });
      },
    };
  }, [networkId, promoAddress, address, sendFeedback, USDPrice, productId, provider]);

  const payForProduct = useCallback(async () => {
    if (!networkId) return;

    setErrorMessage("");
    setPaymentPending(true);

    if (wrongNetwork) {
      setErrorMessage("Wrong network");
      return setPaymentPending(false);
    }

    const params = await getPaymentParameters();

    if (params) {
      sendFeedback({
        prefix: "START payment",
        amount: params.amount,
        status: STATUS.attention,
      });
      try {
        const confirmedTx = await send(params);

        if (confirmedTx?.status) {
          dispatch({
            type: UserActions.paid,
            payload: {
              key: `${address}_${id}`,
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
          amount: params.amount,
          prefix: "FAIL",
          status: STATUS.danger,
          extra: `Error: (${error.code} ${error.message})`,
        });

        if (error?.code !== 4001) {
          setErrorMessage(error.message);
        }
      }
    }
    setPaymentPending(false);
  }, [networkId, wrongNetwork, getPaymentParameters, address, sendFeedback, dispatch, id]);

  const switchToNetwork = async (chainId: string) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (e) {
      console.error(e);
    }
  }

  const switchToPolygon = () => switchToNetwork(NETWORKS[137].chainId)
  const switchToBinance = () => switchToNetwork(NETWORKS[56].chainId)

  const importSwapToken = () => {
    if (networkId) {
      importToken(cashbackTokenAddresses[networkId], address)
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

  const promoFormHandle = useCallback((e: any) => {
    e.preventDefault();
    payForProduct();
    GA.event({
      category: id,
      action: 'Press on the "Buy" button',
    });
  }, [payForProduct, id]);

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
      {paidFor && <p>You already have this product</p>}
      {paymentPending && (
        <>
          <p className="warning">
            Do not leave this page until successful payment. If you have any
            problems with the payment, please contact us.
          </p>
          <p className="notice">The price may vary slightly</p>
        </>
      )}

      {errorMessage && <p className="error">Error: {errorMessage}</p>}

      <form className="pomoCodeForm" onSubmit={promoFormHandle}>
        {!paidFor && (
          <>
            <span
              className={`promoCodeText ${
                wantToEnterPromoCode ? "active" : ""
              }`}
              onClick={() => {
                setWantToEnterPromoCode(!wantToEnterPromoCode);
              }}
            >
              {!wantToEnterPromoCode
                ? "I have a promo code"
                : "I don't have a promo code"}
            </span>
            {isPolygonNetwork || isBSCNetwork ? (
              <input
                className={`promoCodeInput ${
                  wantToEnterPromoCode ? "active" : ""
                }`}
                onChange={(e) => setPromoAddress(e.target.value)}
                type="text"
                placeholder="Enter the promo code to get $50 discount"
                autoFocus
              />
            ) : (
              <span
                className={`linkToNetworkPolygon ${
                  wantToEnterPromoCode ? "active" : ""
                }`}
              >
                To use the promocode pay with{" "}
                <span
                  className={`notesSpan ${isPolygonNetwork ? "active" : ""}`}
                  onClick={switchToPolygon}
                >
                  <img
                    className="tokenIcon"
                    src={ploygonIcon}
                    alt="polygon-icon"
                  />
                  Polygon
                </span>{" "}
                or{" "}
                <span
                  className={`notesSpan ${isBSCNetwork ? "active" : ""}`}
                  onClick={switchToBinance}
                >
                  <img className="tokenIcon" src={bscIcon} alt="bsc-icon" />
                  BSC
                </span>
              </span>
            )}
          </>
        )}
        <button
          className={`primaryBtn paymentBtn ${paymentPending ? "pending" : ""}`}
          disabled={!paymentAvailable}
        >
          {paymentPending
            ? "Pending"
            : USDPrice
            ? `Buy for $${USDPrice}`
            : "Not available"}
        </button>
      </form>
      <p className="polygonNotice">
        Use{" "}
        <span
          className={`notesSpan ${isPolygonNetwork ? "active" : ""}`}
          onClick={switchToPolygon}
        >
          {" "}
          <img className="tokenIcon" src={ploygonIcon} alt="polygon-icon" />
          Polygon
        </span>{" "}
        or{" "}
        <span
          className={`notesSpan ${isBSCNetwork ? "active" : ""}`}
          onClick={switchToBinance}
        >
          <img className="tokenIcon" src={bscIcon} alt="bsc-icon" />
          BSC
        </span>{" "}
        to get 50
        <button className="transparentButton" onClick={importSwapToken}>
          <img className="tokenIcon" src={swapIcon} alt="swap-token-icon" />
          SWAP
        </button>
        tokens as a bonus.
      </p>
    </div>
  );
};

export default Product;
