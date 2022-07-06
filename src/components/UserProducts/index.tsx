import { useContext } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { PRODUCTS } from "../../constants";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import Item from "./Item";

import "./index.css";

const ACCOUNTS: { [key: string]: string[] } = {
  "0xca8ec694d12a3eba9b5cdb535afe975fb8418550": [
    "multicurrencywallet",
    "definance",
    "farmfactory",
    "daofactory",
    "lotteryfactory",
    "nftmarketplace",
    "crosschain",
  ],
  "0x90ff57fded0af7be9196df3623cd587ad8e7d920": [
    "multicurrencywallet",
    "definance",
    "farmfactory",
    "daofactory",
  ],
  "0xa29ac293edaa5edf46f6af3c5b8885cf98bc5c8e": [
    "multicurrencywallet",
  ],
  "0x2122ec95a2c2173ddd4f0ecc79006a0fb9e1d588": [
    "crosschain",
    "multicurrencywallet",
    "definance",
    "farmfactory",
    "daofactory",
    "nftmarketplace",
  ],
  "0x242235b89475407e1475cb4d411d67aac665279d": [
    "farmfactory",
  ],
  "0x8b7286808a50584ca3ac2a69ed0818c0c0619f19": [
    "farmfactory",
  ],
  "0x597691f48a7219301c47180075421ca497865a4e": [
    "definance",
  ],
  "0x38234eed6740f72dd67bc0e81334dcaf1958c0b7": [
    "definance",
  ],
  "0xf6ecb22aceda5133788a98289852b1bceac8cf40": [
    "farmfactory",
    "definance",
  ],
  "0xc1b67ca020d73b5b40b36df89c80307046521c0f": [
    "multicurrencywallet",
    "lotteryfactory",
  ]
};

const UserProducts = () => {
  const { state, dispatch } = useUser();
  const { products } = state;

  const { account } = useContext(Web3ConnecStateContext);

  const restorePurchases = () => {
    ACCOUNTS[account.address.toLowerCase()]?.forEach((productId) => {
      if (PRODUCTS[productId]) {
        dispatch({
          type: UserActions.paid,
          payload: {
            key: `${account.address}_${productId}`,
            value: `${new Date().toISOString()}`,
          },
        });
        dispatch({
          type: UserActions.addProduct,
          payload: PRODUCTS[productId],
        });
      }
    });
  };

  return (
    <div className="userProducts">
      {products.length ? (
        <>
          <div className="howToUseWrapper">
            <h3 className="howToUseTitle">How to use</h3>

            <p className="howToUseDescription">
              <b>Wordpress version</b> : from your admin panel go to a Plugins
              section. Press the button "Add New" and "Upload Plugin". Press the
              button "Choose File" and select the downloaded WP version of the
              plugin. Press "Install Now".
              <br />
              If you're having problems with instalation, it's probably because
              of the file size:{" "}
              <a
                className="link"
                target="_blank"
                rel="noreferrer"
                href="https://www.wpbeginner.com/wp-tutorials/how-to-increase-the-maximum-file-upload-size-in-wordpress/"
              >
                solve problem with plugin size
              </a>
              .
            </p>
            <p className="howToUseDescription">
              <b>Static version</b>: you need hosting with file manager.
              Download the static version. Open file manager and go to
              "public_html" folder. You need to upload downloaded zip file there
              (or if you have internal folder with your domain name, upload it
              in this folder). After uploading unpack the archive and move all
              unpacked files from the internal zip folder to the "public_html"
              folder (or in the your domain folder).{" "}
            </p>
          </div>

          <div className="productsList">
            {products.map(({ id }) => (
              <Item id={id} key={id} />
            ))}
          </div>
        </>
      ) : ACCOUNTS[account?.address?.toLowerCase()]?.length > 0 ? (
        <>
          <p className="pb-1 textInfo flex-center full-width">
            Looks like your purchases are cleaned
          </p>
          <div className="btn-block flex-center full-width">
            <button
              className="primaryBtn connectButton"
              onClick={restorePurchases}
            >
              Restore Purchases
            </button>
          </div>
        </>
      ) : (
        <p className="textInfo">You do not have any products yet</p>
      )}
    </div>
  );
};

export default UserProducts;
