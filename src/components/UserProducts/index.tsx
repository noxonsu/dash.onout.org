import { useContext } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { PRODUCTS } from "../../constants";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";
import Item from "./Item";

import "./index.css";

const ACCOUNTS: {[key: string]: string[]} = {
  "0xCa8Ec694d12a3Eba9b5CDB535AfE975FB8418550": ['multicurrencywallet', 'definance', 'farmfactory', 'daofactory', 'lotteryfactory', 'nftmarketplace'],
  "0x90FF57Fded0af7bE9196Df3623Cd587aD8E7D920": ['multicurrencywallet', 'definance', 'farmfactory', 'daofactory'],
}

const UserProducts = () => {
  const { state, dispatch } = useUser();
  const { products } = state;

  const { account } = useContext(Web3ConnecStateContext);

  const restorePurchases = () => {
    ACCOUNTS[account.address]?.forEach(productId => {
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
    })

  };

  return (
    <div className="userProducts">
      {
        products.length ? (
          <>
            {products.map(({ id }) => (
              <Item id={id} key={id} />
            ))}
          </>
        )
        : ACCOUNTS[account?.address]?.length > 0 ? (
          <>
            <p className="pb-1 textInfo flex-center full-width">Looks like your purchases are cleaned</p>
            <div className="btn-block flex-center full-width">
              <button className="primaryBtn connectButton" onClick={restorePurchases}>
                Restore Purchases
              </button>
            </div>
          </>
        )
        :(
          <p className="textInfo">You do not have any products yet</p>
        )
      }
    </div>
  );
};

export default UserProducts;

