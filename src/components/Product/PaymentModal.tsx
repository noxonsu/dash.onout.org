import { useEffect, useState, useContext } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { NETWORKS, Network } from "../../constants";
import Modal from "../Modal";

const PaymentModal = ({
  isOpen,
  pending,
  onClose,
  startPayment,
  usdPrice,
  error,
}: {
  isOpen: boolean;
  pending: boolean;
  onClose: () => void;
  startPayment: () => void;
  usdPrice?: number;
  error?: string;
}) => {
  const {
    account: { networkId },
  } = useContext(Web3ConnecStateContext);

  const [activeNetwork, setActiveNetwork] = useState<Network | null>(null);

  useEffect(() => {
    const knownNetwork = networkId && !!NETWORKS[networkId];

    setActiveNetwork(knownNetwork ? NETWORKS[networkId] : null);
  }, [networkId]);

  return isOpen ? (
    <Modal
      onClose={onClose}
      title={"Payment"}
      style={{
        width: "100%",
        maxWidth: "45rem",
        height: "fit-content",
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
          <a
            className="link paymentLink"
            href={`https://www.binance.com/en/buy-${activeNetwork?.currency.binancePurchaseKey}`}
            target="_blank"
            rel="noreferrer"
          >
            Buy {activeNetwork?.currency.symbol} on Binance
          </a>

          <p className="notice">The price may vary slightly</p>

          {pending && (
            <>
              <p className="warning">
                Do not leave this page until successful payment. If you have any problems with the payment, please
                contact us.
              </p>
            </>
          )}
          {error && <p className="error">Error: {error}</p>}

          <button
            className={`primaryBtn paymentBtn ${pending ? "pending" : ""}`}
            onClick={startPayment}
            disabled={pending || !usdPrice}
          >
            {pending ? "Pending" : usdPrice ? `Buy for $${usdPrice}` : "Not available"}
          </button>
        </>
      }
    />
  ) : null;
};

export default PaymentModal;
