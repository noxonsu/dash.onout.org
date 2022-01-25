import { createContext, useState } from "react";
import { providers, utils } from 'ethers';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';

type Web3ConnectState = {
  connected: boolean;
  provider: providers.Web3Provider | null;
  address: string;
  signer: providers.JsonRpcSigner | null;
  balance: string;
};

const initialWeb3ConnectState = {
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

type SetWeb3ConnectState = (state: Web3ConnectState) => void;

type WithModalProps = {
  children?: any;
};


export const Web3ConnectUpdaterContext = createContext({} as SetWeb3ConnectState);
export const Web3ConnecStateContext = createContext({} as Web3ConnectState);

const WithWeb3Connect = ({ children }: WithModalProps) => {
  const [account, setAccount] = useState<Web3ConnectState>(initialWeb3ConnectState);

  async function connect() {
    const web3ModalProvider = await web3Modal.connect();

    const provider = new providers.Web3Provider(web3ModalProvider);

    async function setAccountFromProvider() {
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

  const web3ModalContent = !account.connected
    ? (
      <div
        className="button"
        onClick={connect}
      >
        Connect to Web3!
      </div>
    )
    : (
      <div className="account">
        { account.address } - { account.balance }
        <div className="button" onClick={disconnect}>
          Disconnect
        </div>
      </div>
    )


  return (
    <Web3ConnectUpdaterContext.Provider value={setAccount}>
      <Web3ConnecStateContext.Provider value={account}>
        {web3ModalContent}
        {children}
      </Web3ConnecStateContext.Provider>
    </Web3ConnectUpdaterContext.Provider>
  );
};

export default WithWeb3Connect;
