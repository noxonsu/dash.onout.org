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
  const [account, setAccount] = useState<IAccount>({
    connected: false,
    provider: null,
    address: '',
    signer: null,
    balance: utils.formatEther(0),
  });

  async function connect() {
    const web3ModalProvider = await web3Modal.connect();

    const provider = new providers.Web3Provider(web3ModalProvider);

    async function setAccountFromProvider() {
      const signer = await provider.getSigner(0);
      const address = await signer.getAddress();
      const balance = await signer.getBalance();

      setAccount({
        connected: true,
        provider,
        address,
        signer,
        balance: utils.formatEther(balance)
      });
    }

    setAccountFromProvider();

    web3ModalProvider.on("accountsChanged", () => {
      setAccountFromProvider();
    });
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

        <div className="button" onClick={signMessage}>
          Sign Message
        </div>
      </div>
    )
  }

}


export default App;