import { PRODUCTS } from "../../constants";
import "./index.css";

const NumberOfSales = () => {
  return (
    <div className="productStatistics">
      <h3>Number of sales</h3>
      <ul className="productsItems">
        {Object.values(PRODUCTS).map((el) => (
          <li className="productsItem" key={el.id}>
            <p className="productName">{el.name}</p>
            <span className="numberOfSales" title="Number of sales">
              {el.numberOfSales}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NumberOfSales;
