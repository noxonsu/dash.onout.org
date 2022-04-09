import { useLocation } from 'react-router-dom';
import { PRODUCTS } from "../../constants";

import IdeaList from '../IdeasList';
import ProductCard from './ProductCard';

import "./index.css";

const ProductList = () => {
  const location = useLocation();

  let status = '';
  if(location.pathname === '/presale'){
    status = 'development';
  } else if(location.pathname === '' || location.pathname === '/') {
    status = 'ready';
  } else {
    status = '';
  }

  return (
    <section>
      <div className="products">
        {Object.keys(PRODUCTS).map((id) => {
          if(PRODUCTS[id].status === status) return <ProductCard id={id} />
        })}
      </div>
      {status === 'development' && <IdeaList/>}
    </section>
  );
};

export default ProductList;
