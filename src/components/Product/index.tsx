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
  SupportedChainId,
} from "../../constants";
import { send } from "../../helpers/transaction";
import { sendMessage, STATUS } from "../../helpers/feedback";
import { getPrice } from "../../helpers/currency";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import PaymentModal from "./PaymentModal";
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
    account: { isBSCNetwork, networkId, address, addressUSDValue, provider, wrongNetwork },
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

  const {
    name,
    promoPageLink,
    description,
    price: USDPrice,
    productId,
    demo,
    videos,
    isFee,
    freeDesc,
    static_link,
    wp_link,
  } = PRODUCTS[id];

  useEffect(() => {
    const inProducts = !!products.length && products.find((product) => product.id === id);

    if (inProducts) setPaidFor(true);
  }, [id, products]);

  const toProducts = () => {
    dispatch({
      type: UserActions.changeView,
      payload: "products",
    });
  };

  const sendFeedback = useCallback(
    ({ amount, prefix, status, extra }: { amount?: number; prefix: string; status: STATUS; extra?: string }) => {
      sendMessage({
        msg: `
        ${prefix} from: ${address};
        usd_value: ${addressUSDValue}
        Network: ${networkId || "unsupported"};
        Product id: ${id};
        USD cost: ${USDPrice};
        Crypto cost: ${amount || "don't have amount"};
        Date: ${new Date().toISOString()};
        ${extra || ""}
      `,
        status,
      });
    },
    [address, networkId, addressUSDValue, USDPrice, id]
  );

  const getPaymentParameters = useCallback(async () => {
    if (!PAYMENT_ADDRESS || !USDPrice || !networkId) return;

    const { symbol } = NETWORKS[networkId].currency;
    const assetUSDPrice = await getPrice({
      symbol,
      vsCurrency: FIAT_TICKER,
    });

    if (!assetUSDPrice) return;
    BigNumber.config({
      ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN,
      DECIMAL_PLACES: 18,
    });

    const bonusAndDiscountContract = "";
    //   networkId !== SupportedChainId.MAINNET ? bonusAndDiscountContractsByNetworkId[networkId] : "";
    const cashbackTokenAddress = "" // cashbackTokenAddresses[networkId];

    const hasValidPromoCode = ''; // !!(bonusAndDiscountContract && promoAddress?.match(EVM_ADDRESS_REGEXP));
    const canGetDiscount = hasValidPromoCode && USDPrice > 100;

    const finalProductPriceInUSD = canGetDiscount ? USDPrice - 50 : USDPrice;

    const amount = new BigNumber(finalProductPriceInUSD).div(assetUSDPrice).toNumber();

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
      action: "Start payment from the modal",
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

        const canceledError = error?.message?.match("canceled");
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
  };

  const [paymentAvailable, setPaymentAvailable] = useState(false);

  useEffect(() => {
    setPaymentAvailable(
      !!USDPrice && !paymentPending && !paidFor && signed && !isWeb3Loading && account && !account.wrongNetwork
    );
  }, [paymentPending, paidFor, signed, isWeb3Loading, account, USDPrice]);

  const [paymentModalIsOpen, setPaymentModalIsOpen] = useState(false);

  const openPaymentModal = () => {
    setPaymentModalIsOpen(true);
    GA.event({
      category: id,
      action: "Product payment modal was OPENED",
    });
  };

  const closePaymentModal = () => {
    setPaymentModalIsOpen(false);
    GA.event({
      category: id,
      action: "Product payment modal was CLOSED",
    });
  };

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

      <PaymentModal
        isOpen={paymentModalIsOpen}
        pending={paymentPending}
        onClose={closePaymentModal}
        startPayment={payForProduct}
        usdPrice={USDPrice}
        error={errorMessage}
      />

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

      <div className="buttonsContaner">
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
            More details ℹ️
          </button>
        )}
        {videos && (
          <a
            className="secondaryBtn externalLink"
            type="button"
            href={videos}
            target="_blank"
            rel="noreferrer"
          >
            Videos 📺
          </a>
        )}
        {demo && (
          <>
            {demo === `-` ? (
              <span
                className="secondaryBtn externalLink"
              >
                Demo coming soon
              </span>
            ) : (
              <a
                className="secondaryBtn externalLink"
                type="button"
                href={demo}
                target="_blank"
                rel="noreferrer"
              >
                Demo 👀
              </a>
            )}
          </>
        )}
      </div>

      {description && <p>{description}</p>}
      {paidFor && <p>You already have this product</p>}

      {/* {!paidFor && (
        <>
          <span
            className={`promoCodeText ${wantToEnterPromoCode ? "active" : ""}`}
            onClick={() => {
              setWantToEnterPromoCode(!wantToEnterPromoCode);
            }}
          >
            {!wantToEnterPromoCode ? "I have a promo code" : "I don't have a promo code"}
          </span>
          {isBSCNetwork ? (
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
                name="BSC"
                icon={bscIcon}
                alt="binance smart chain button"
                onClick={() => switchToNetwork(NETWORKS[SupportedChainId.BINANCE_SMART_CHAIN].chainId)}
                inactive={isBSCNetwork}
              />
            </span>
          )}
        </>
      )} */}
      {isFee ? (
        <>
          <h4 className="youWillGetTitle">
            Free or ~{USDPrice} USD
          </h4>
          {freeDesc && (<p dangerouslySetInnerHTML={{ __html: freeDesc }} />)}

          {static_link && (
            <div className="downloadLinkHolder">
              <a className="downloadLink" target="_blank" href={static_link}>Run static version (RECOMMENDED)</a>
            </div>
          )}

          {wp_link && (
            <div className="downloadLinkHolder">
              <a className="downloadLink" target="_blank" href={wp_link}>Download WordPress version</a>
            </div>
          )}
        </>
      ) : (
        <button
          className={`primaryBtn paymentBtn ${paymentPending ? "pending" : ""}`}
          disabled={!paymentAvailable}
          onClick={openPaymentModal}
        >
          Buy
        </button>
      )}

      <div className="youWillGet">
        <h4 className="youWillGetTitle">
          {isFee
            ? `Premium version support includes:`
            : `Item support includes:`
          }
        </h4>
        <ul className="youWillGetItems">
          <li className="youWillGetItem">
            <p className="youWillGetText">Any future update made available by the team is included with every purchase.</p>
          </li>
          <li className="youWillGetItem">
            <p className="youWillGetText">Availability of the team to answer questions</p>
          </li>
          <li className="youWillGetItem">
            <p className="youWillGetText">
              Get assistance with reported bugs and issues (
              <a className="youWillGetLink" href="mailto:support@onout.org">
                support@onout.org
              </a> or in <a className="youWillGetLink" href="https://t.me/onoutsupportbot">telegram</a>
              )
            </p>
          </li>
          
        </ul>
        <h4 className="youWillGetTitle">Additional (contact support for prices):</h4>
        <ul className="youWillGetItems">
          <li className="youWillGetItem">
            <p className="youWillGetText">Adding new networks</p>
          </li>
          <li className="youWillGetItem">
            <p className="youWillGetText">Installation</p>
          </li>
        </ul>
      </div>
      {/* <BonusNotice switchToNetwork={switchToNetwork} /> */}
    </div>
  );
};

export default Product;
