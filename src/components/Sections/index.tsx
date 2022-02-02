import { PRODUCTS } from "../../constants";
import useUser from "../../hooks/useUser";
import { UserActions } from "../UserProvider";
import ProductList from "../ProductList";
import UserProducts from "../UserProducts";
import Product from "../Product";

import "./index.css";

const Sections = () => {
  const { state, dispatch } = useUser();
  const { signed, view } = state;

  const Tabs = (
    <div className="tabs">
      <button
        className={`${view === "products" ? "active" : ""}`}
        onClick={() => {
          dispatch({
            type: UserActions.changeView,
            payload: "products",
          });
        }}
      >
        Products
      </button>
      {signed && (
        <button
          className={`${view === "userProducts" ? "active" : ""}`}
          onClick={() => {
            dispatch({
              type: UserActions.changeView,
              payload: "userProducts",
            });
          }}
        >
          My products
        </button>
      )}
    </div>
  );

  if (!signed) return null;

  return (
    <div>
      {Tabs}

      {view === "products" && <ProductList />}
      {view === "userProducts" && signed && <UserProducts />}
      {!!PRODUCTS[view] && <Product id={view} />}
    </div>
  );
};

export default Sections;
