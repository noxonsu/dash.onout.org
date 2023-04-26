import GA from 'react-ga';
import { Link,  } from 'react-router-dom';

import { IMAGES } from "../../../assets";
import { PRODUCTS,  } from "../../../constants";
import { UserActions } from "../../UserProvider";
import useUser from "../../../hooks/useUser";

import "../index.css";

const ProductCard = (props: { id: string }) => {
  const { id } = props;

  const { dispatch } = useUser();

  const openDetails = () => {
    dispatch({
      type: UserActions.changeView,
      payload: id,
    });
  };

  const {
    name,
    howToEarn,
    adminCanEdit,
    description,
    imgSrc,
    imgAlt,
    price,
    lables,
    isFee,
  } = PRODUCTS[id];

  return (
    <div
      key={id}
      className={`productCard ${id}ProductCard`}
      onClick={() => {
      window.location.assign(`#/products/${id}`);
        openDetails();
        GA.event({
          category: 'Product list',
          action: `Open ${id}`,
        });
      }}
    >
      <>
        <img src={imgSrc} alt={imgAlt} className="promoImage" />
        {lables.includes('new') && (
          <div className='newProduct'>
            <img
              src={IMAGES.newProduct}
              alt="New Product"
            />
          </div>
        )}
        <div className={`textContent${price ? ' hasBuyButton' : ''}`}>
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
      </>

      {price && (
        <div className='boxLink'>
          <Link to={`/products/${id}`}  className="primaryBtn buyBtn">
            {isFee ? `Try it Free` : `Buy for $${price}`}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;