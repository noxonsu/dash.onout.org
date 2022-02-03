import { createContext, useState } from "react";
import { providers, utils } from 'ethers';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import useUser from "../../hooks/useUser";
import { UserActions } from "../UserProvider";

import './index.css'

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';

type Web3ConnectState = {
  connected: boolean;
  provider: providers.Web3Provider | null;
  address: string;
  signer: providers.JsonRpcSigner | null;
  balance: string;
};

const initialWeb3ConnectState: Web3ConnectState = {
  connected: false,
  provider: null,
  address: '',
  signer: null,
  balance: utils.formatEther(0),
}

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: false, // optional
  disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera
  providerOptions // required
});

type WithModalProps = {
  children?: any;
};

export const Web3ConnecStateContext = createContext({account: initialWeb3ConnectState, isWeb3Loading: false});

const WithWeb3Connect = ({ children }: WithModalProps) => {
  const [account, setAccount] = useState<Web3ConnectState>(initialWeb3ConnectState);
  const [isWeb3Loading, setIsWeb3Loading] = useState(false);
  const {dispatch} = useUser()

  async function connect() {
    const web3ModalProvider = await web3Modal.connect();

    const provider = new providers.Web3Provider(web3ModalProvider);

    async function setAccountFromProvider() {
      setIsWeb3Loading(true);
      try {
        const signer = provider.getSigner(0);
        const address = await signer.getAddress();
        const balance = await signer.getBalance();

        setAccount({
          connected: true,
          provider,
          address,
          signer,
          balance: utils.formatEther(balance)
        });
      } catch (error) {
        console.log(error);
        setAccount(initialWeb3ConnectState)
      } finally {
        setIsWeb3Loading(false);
      }
    }

    setAccountFromProvider();

    web3ModalProvider.on("accountsChanged", () => {
      setAccountFromProvider();
    });

    web3ModalProvider.on("close", () => {
      setAccount(initialWeb3ConnectState);
    });
  };

  async function disconnect() {
    dispatch({
      type: UserActions.signed,
      payload: false,
    })
    dispatch({
      type: UserActions.changeView,
      payload: 'products',
    })
    // @ts-ignore
    if (account?.provider?.close) {
      // @ts-ignore
      await account.provider.close()

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
    }

    setAccount(initialWeb3ConnectState)
  };

  async function signMessage() {
    const signedMessage = await account.signer?.signMessage("Please Login to our website!");
    console.log(signedMessage);
  };

  const web3ConnectContent = (
    <div className="Web3Connect">
      { isWeb3Loading ?
        (
          <p>
            Loading...
          </p>
        )
      : !account.connected
        ? (
          <button
            className="connectButton"
            onClick={connect}
          >
            Connect to Web3!
          </button>
        )
        : (
          <div className="account">
            <div>
              { account.address }
            </div>
            <button className="disconnectButton" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        )
      }
    </div>
  )


  return (
    <Web3ConnecStateContext.Provider value={{account, isWeb3Loading}}>
      {web3ConnectContent}
      {children}
    </Web3ConnecStateContext.Provider>
  );
};

export default WithWeb3Connect;
