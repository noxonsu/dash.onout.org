import useUser from "../../hooks/useUser";
import Item from "./Item";

import "./index.css";

const UserProducts = () => {
  const { state } = useUser();
  const { products } = state;

  return (
    <div className="userProducts">
      {products.length ? (
        <>
          {products.map(({ id }) => (
            <Item id={id} key={id} />
          ))}
        </>
      ) : (
        <p>You do not have any products yet</p>
      )}
    </div>
  );
};

export default UserProducts;
