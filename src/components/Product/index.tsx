import { PRODUCTS } from "../../constants";

type ProductProps = { id: string };

const Product = ({ id }: ProductProps) => {
  const { name, price } = PRODUCTS[id];

  return (
    <div>
      <h3>{name}</h3>
      ...
      <button>Buy for {price}</button>
    </div>
  );
};

export default Product;
