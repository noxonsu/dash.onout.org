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
          const { name, howToEarn, adminCanEdit, description, imgSrc, imgAlt } =
            PRODUCTS[id];

          return (
            <div
              key={id}
              className="productCard"
              onClick={() => openDetails(id)}
            >
              <img src={imgSrc} alt={imgAlt} />
              <div className="textContent">
                <h3 className="contentTitle">{name}</h3>
                {description && <p className="description">{description}</p>}
                {howToEarn && (
                  <div className="subsection">
                    <h4 className="subtitle">How to earn</h4>
                    <p className="subdescription">{howToEarn}</p>
                  </div>
                )}
                {adminCanEdit && (
                  <div className="subsection">
                    <h4 className="subtitle">Admin can edit</h4>
                    <p className="subdescription">{adminCanEdit}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
