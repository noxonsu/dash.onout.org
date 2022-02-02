import { PRODUCTS } from "../../constants";
import { UserActions } from "../UserProvider";
import useUser from "../../hooks/useUser";

import "./index.css";

const ProductList = () => {
  const { dispatch } = useUser();

  const openDetails = (id: string) => {
    dispatch({
      type: UserActions.changeView,
      payload: id,
    });
  };

  return (
    <section>
      <div className="products">
        {Object.keys(PRODUCTS).map((id) => {
          const { name, description, imgSrc, imgAlt } = PRODUCTS[id];

          return (
            <div
              key={id}
              className="productCard"
              onClick={() => openDetails(id)}
            >
              <img src={imgSrc} alt={imgAlt} />
              <div className="textContent">
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
