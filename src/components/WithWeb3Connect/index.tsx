import { createContext, useEffect, useState, useCallback } from "react";
import GA from 'react-ga';
import { utils } from "ethers";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { NETWORKS, SupportedChainId } from "../../constants";
import useUser from "../../hooks/useUser";
import { getUserUSDValueOfAddress } from "../../helpers/balance";
import { UserActions } from "../UserProvider";

import "./index.css";

const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

type Web3ConnectState = {
  connected: boolean;
  provider: any | null;
  networkId: SupportedChainId | undefined;
  isBSCNetwork: boolean;
  wrongNetwork: boolean;
  address: string;
  addressUSDValue: number | string | undefined;
  balance: string;
};

const initialWeb3ConnectState: Web3ConnectState = {
  connected: false,
  provider: null,
  networkId: undefined,
  wrongNetwork: false,
  isBSCNetwork: false,
  address: "",
  addressUSDValue: undefined,
  balance: utils.formatEther(0),
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
};

type WithModalProps = {
  children?: any;
};

export const Web3ConnecStateContext = createContext({
  account: initialWeb3ConnectState,
  isWeb3Loading: false,
});

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera
  providerOptions, // required
});

const WithWeb3Connect = ({ children }: WithModalProps) => {
  const [account, setAccount] = useState<Web3ConnectState>(
    initialWeb3ConnectState
  );
  const [isWeb3Loading, setIsWeb3Loading] = useState(false);
  const { dispatch } = useUser();

  const disconnect = useCallback(async () => {
    dispatch({
      type: UserActions.signed,
      payload: false,
    });
    dispatch({
      type: UserActions.changeView,
      payload: "products",
    });
    // @ts-ignore
    if (account?.provider?.close) {
      // @ts-ignore
      await account.provider.close();
    }

    setAccount(initialWeb3ConnectState);

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    web3Modal.clearCachedProvider();
  }, [account.provider, dispatch])

  const connect = useCallback(async () => {
    const web3ModalProvider = await web3Modal.connect();
    const provider = new Web3(web3ModalProvider);

    async function fetchAndSetAddressUSDValue(address: string) {
      try {
        const addressUSDValue = await getUserUSDValueOfAddress(address) as number;

        setAccount((prevState) => ({
          ...prevState,
          addressUSDValue: addressUSDValue || 0,
        }));
      } catch (error) {
        console.log(error);

        setAccount((prevState) => ({
          ...prevState,
          addressUSDValue: "can't fetch usd_value",
        }));
      }
    }

    async function setAccountFromProvider() {
      setIsWeb3Loading(true);
      try {
        const accounts = await provider.eth.getAccounts();
        const address = accounts[0];
        const balance = await provider.eth.getBalance(address);
        const networkId = await provider.eth.net.getId() as SupportedChainId;

        setAccount({
          connected: true,
          provider,
          networkId,
          wrongNetwork: !NETWORKS[networkId],
          isBSCNetwork: networkId === SupportedChainId.BINANCE_SMART_CHAIN,
          address,
          addressUSDValue: undefined,
          balance: utils.formatEther(balance),
        });
        fetchAndSetAddressUSDValue(address);
      } catch (error) {
        console.log(error);
        setAccount(initialWeb3ConnectState);
      } finally {
        setIsWeb3Loading(false);
      }
    }

    setAccountFromProvider();

    web3ModalProvider.on("accountsChanged", (accounts: string[]) => {
      if (accounts[0]?.toLowerCase() !== account.address.toLowerCase()) {
        dispatch({
          type: UserActions.signed,
          payload: false,
        });
      }

      const isUnlocked = web3ModalProvider._state.isUnlocked;

      if (accounts.length > 0 && isUnlocked) {
        setAccountFromProvider();
      } else {
        disconnect();
      }
    });

    web3ModalProvider.on("close", () => {
      disconnect();
    });

    web3ModalProvider.on("chainChanged", (chainId: string) => {
      const networkId = parseInt(chainId) as SupportedChainId;
      setAccount((prevState) => ({
        ...prevState,
        networkId,
        wrongNetwork: !NETWORKS[networkId],
        // isPolygonNetwork: networkId === SupportedChainId.POLYGON,
        isBSCNetwork: networkId === SupportedChainId.BINANCE_SMART_CHAIN,
      }));
    });

    // Subscribe to provider disconnection
    web3ModalProvider.on(
      "disconnect",
      (error: { code: number; message: string }) => {

        if (error?.message.match(/Attempting to connect/g)) return;

        disconnect();
      }
    );
  }, [account, disconnect, dispatch])

  const switchToNetwork = async (chainId: string) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (e) {
      console.error(e);
      alert("Please, change network manually in your wallet app")
    }
  };

  const { address, wrongNetwork } = account;

  const web3ConnectContent = (
    <div className="Web3Connect">
      {isWeb3Loading ? (
        <p className="pending">Loading</p>
      ) : !account.connected ? (
        <div className="btn-block">
          <button
            id="connect-button"
            className="primaryBtn connectButton"
            onClick={() => {
              connect();

              GA.event({
                category: 'Web3',
                action: 'Connect an Account'
              });
            }}
          >
          Connect to wallet
          </button>
        </div>
      ) : (
        <div className="account">
          <div className="accountHeader">
            <span className="address">
              {address.slice(0, 6)}...
              {address.slice(address.length - 4, address.length)}
            </span>
            <div className="disconnect-btn-block">
              <button
                className="secondaryBtn disconnectButton"
                onClick={() => {
                  disconnect();

                  GA.event({
                    category: 'Web3',
                    action: 'Disconnect an Account'
                  })
                }}
              >
                Disconnect
              </button>
            </div>
          </div>

          {wrongNetwork && (
            <div className="warning">
              Please switch to one of the supported networks:
              <div className="networksList">
                {Object.values(NETWORKS).map(({ name, chainId }, index) => (
                  <button
                    className="secondaryBtn externalLink"
                    onClick={() => switchToNetwork(chainId)}
                    key={index}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const web3ConnectCachedProvider = web3Modal.cachedProvider;
    const hasCashedProvider = !!web3ConnectCachedProvider;

    if (!account.connected && !isWeb3Loading && hasCashedProvider) {
      console.log("Try reconnecting");
      dispatch({
        type: UserActions.signed,
        payload: false,
      });
      connect();
    }
  }, [account.connected, connect, isWeb3Loading, dispatch]);

  return (
    <Web3ConnecStateContext.Provider value={{ account, isWeb3Loading }}>
      {web3ConnectContent}
      {children}
    </Web3ConnecStateContext.Provider>
  );
};

export default WithWeb3Connect;