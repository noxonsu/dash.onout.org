import { useContext, useState, useEffect, useCallback } from "react";
import GA from "react-ga";
import { BigNumber } from "bignumber.js";
import {
  PRODUCTS,
  PAYMENT_ADDRESS,
  NETWORKS,
  Network,
  FIAT_TICKER,
  EVM_ADDRESS_REGEXP,
  bonusAndDiscountContractsByNetworkId,
  cashbackTokenAddresses,
  SupportedChainId,
} from "../../constants";
import { send } from "../../helpers/transaction";
import { sendMessage, STATUS } from "../../helpers/feedback";
import { getPrice } from "../../helpers/currency";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import IconButton from "./IconButton";
import BonusNotice from "./BonusNotice";
import Modal from "../Modal";
import bscIcon from "../../assets/images/bsc.svg";
import ploygonIcon from "../../assets/images/polygon.svg";
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
  const [landingModalIsOpen, setLandingModalIsOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [wantToEnterPromoCode, setWantToEnterPromoCode] = useState(false);
  const [promoAddress, setPromoAddress] = useState("");

  const [activeNetwork, setActiveNetwork] = useState<Network | null>(null)

  useEffect(() => {
    const knownNetwork = networkId && !!NETWORKS[networkId]

    setActiveNetwork(knownNetwork ? NETWORKS[networkId] : null)
  }, [networkId])

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

    const bonusAndDiscountContract = (networkId !== SupportedChainId.MAINNET) ?
      bonusAndDiscountContractsByNetworkId[networkId] : '';
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

    GA.event({
      category: id,
      action: 'Start payment from the modal',
    });

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

        const canceledError = error?.message?.match('canceled');
        const sendFeedbackError = error?.code !== 4001 && !canceledError;

        if (sendFeedbackError) {
          sendFeedback({
            amount: params.amount,
            prefix: "FAIL",
            status: STATUS.danger,
            extra: `Error: (${error.code} ${error.message})`,
          });
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

  const [paymentModalIsOpen, setPaymentModalIsOpen] = useState(false)

  const openPaymentModal = () => {
    setPaymentModalIsOpen(true)
    GA.event({
      category: id,
      action: 'Product payment modal was OPENED',
    });
  }

  const closePaymentModal = () => {
    setPaymentModalIsOpen(false)
    GA.event({
      category: id,
      action: 'Product payment modal was CLOSED',
    });
  }

  return (
    <div className="product">
      {landingModalIsOpen && (
        <Modal
          onClose={() => {
            setLandingModalIsOpen(false);

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

      {paymentModalIsOpen && (
        <Modal
          onClose={closePaymentModal}
          title={"Payment"}
          style={{
            width: 'fit-content',
            height: 'fit-content'
          }}
          content={
            <>
              <p>You can use this links to buy crypto with a bank card:</p>
              <a
                className="link paymentLink"
                href={`https://changelly.com/buy/${activeNetwork?.currency.symbol}`}
                target="_blank"
                rel="noreferrer"
              >
                Buy {activeNetwork?.currency.symbol} on Changelly
              </a>
              {/* @todo which binance url can be changed depending on symbol? */}
              <a className="link paymentLink" href="https://www.binance.com/en/buy-BNB" target="_blank" rel="noreferrer">
                Buy {activeNetwork?.currency.symbol} on Binance
              </a>
              <button
                className={`primaryBtn paymentBtn ${paymentPending ? "pending" : ""}`}
                onClick={payForProduct}
              >
                {paymentPending ? "Pending" : USDPrice ? `Buy for $${USDPrice}` : "Not available"}
              </button>
            </>
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
            setLandingModalIsOpen(true);

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

      {!paidFor && (
        <>
          <span
            className={`promoCodeText ${wantToEnterPromoCode ? "active" : ""}`}
            onClick={() => {
              setWantToEnterPromoCode(!wantToEnterPromoCode);
            }}
          >
            {!wantToEnterPromoCode ? "I have a promo code" : "I don't have a promo code"}
          </span>
          {isPolygonNetwork || isBSCNetwork ? (
            <input
              className={`promoCodeInput ${wantToEnterPromoCode ? "active" : ""}`}
              onChange={(e) => setPromoAddress(e.target.value)}
              type="text"
              placeholder="Enter the promo code to get $50 discount"
              autoFocus
            />
          ) : (
            <span className={`linkToNetworkPolygon ${wantToEnterPromoCode ? "active" : ""}`}>
              To use the promocode pay with{" "}
              <IconButton
                name="Polygon"
                icon={ploygonIcon}
                alt="polygon button"
                onClick={switchToPolygon}
                inactive={isPolygonNetwork}
              />{" "}
              or{" "}
              <IconButton
                name="BSC"
                icon={bscIcon}
                alt="binance smart chain button"
                onClick={switchToBinance}
                inactive={isBSCNetwork}
              />
            </span>
          )}
        </>
      )}
      <button
        className={`primaryBtn paymentBtn ${paymentPending ? "pending" : ""}`}
        disabled={!paymentAvailable}
        onClick={openPaymentModal}
      >
        Buy
      </button>

      <BonusNotice switchToNetwork={switchToNetwork} />
    </div>
  );
};

export default Product;
