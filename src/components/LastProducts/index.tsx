import { PRODUCTS } from "../../constants";
import "./index.css";

const LastProducts = ({ lastProductId, isStatisticsLoading }: any) => {
  const products = Object.values(PRODUCTS);
  const lastProducts = Object.values(lastProductId);

  const productLast = lastProducts.map((el: any) => {
    const findProduct = products.filter((product) => {
      return product.productId === el.id;
    });
    const newDate = new Date(el.date * 1000);

    return {
      productName: findProduct[0].name,
      date: newDate.toLocaleString(),
    };
  });

  return (
    <div>
      <div>
        {isStatisticsLoading ? null : (
          <div>
            <h3>Last sold products</h3>
            <div className="lastProducts">
              {productLast.reverse().map((el) => (
                <div className="blockProduct" key={el.date}>
                  <p className="productName">{el.productName}</p>
                  <p className="productDate">{el.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastProducts;
