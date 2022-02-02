import { PRODUCTS } from "../../constants";
import useUser from "../../hooks/useUser";
import { UserActions } from "../User";
import ProductList from "../ProductList";
import UserProducts from "../UserProducts";
import Product from "../Product";

const Sections = () => {
  const { state, dispatch } = useUser();
  const { signed, view } = state;

  const Tabs = (
    <div>
      <button
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
