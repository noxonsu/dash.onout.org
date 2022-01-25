import { useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers, utils } from 'ethers';

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';

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

interface IAccount {
  connected: boolean;
  provider: providers.Web3Provider | null;
  address: string;
  signer: providers.JsonRpcSigner | null;
  balance: string;
}

const initialAccountState = {
  connected: false,
  provider: null,
  address: '',
  signer: null,
  balance: utils.formatEther(0),
}


function App() {
  return (
    <div className="App">
      <div className="App-header">
        <Web3 />
      </div>
    </div>
  );
}

function Web3() {
  const [account, setAccount] = useState<IAccount>(initialAccountState);

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
        setAccount(initialAccountState)
      }
    }

    setAccountFromProvider();

    web3ModalProvider.on("accountsChanged", () => {
      setAccountFromProvider();
    });

    web3ModalProvider.on("close", () => {
      setAccount(initialAccountState);
    });
  }

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

    setAccount(initialAccountState)
  }

  async function signMessage() {
    const signedMessage = await account.signer?.signMessage("Please Login to our website!");
    console.log(signedMessage);
  }

  if(!account.connected) {
    return (
      <div className="button" onClick={connect}>
        Connect to Web3!
      </div>
    )
  }
  else {
    return (
      <div className="account">
        { account.address } - { account.balance }

        <div className="button" onClick={disconnect}>
          Disconnect
        </div>
      </div>
    )
  }

}


export default App;