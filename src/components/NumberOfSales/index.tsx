import { useEffect, useState } from "react";
import { PRODUCTS } from "../../constants";
import "./index.css";

interface CountSalesInreface {
  [id: string]: Number;
}

const NumberOfSales = ({ numberOfSales, isStatisticsLoading }: any) => {
  const [countSales, setCountSales] = useState<CountSalesInreface>({});

  const getCountSales = async () => {
    const numberOfSalesArray = Object.values(numberOfSales);
    if (numberOfSalesArray.length === 0) return false;

    const uniq = numberOfSalesArray.reduce((acc: any, res: any) => {
      acc[res.id] = (acc[res.id] || 0) + 1;
      return acc;
    }, {});
    setCountSales(uniq as CountSalesInreface);
  };
  useEffect(() => {
    getCountSales();
  }, [numberOfSales]);

  return (
    <div className="productStatistics">
      {isStatisticsLoading ? (
        ""
      ) : (
        <div>
          <h3>Number of sales</h3>
          <ul className="productsItems">
            {!countSales
              ? ""
              : Object.values(PRODUCTS).map((el: any) =>
                  !countSales[el.productId] ? (
                    <li className="productsItem" key={el.productId}>
                      <p className="productName">{el.name}</p>
                      <p className="productCount">0</p>
                    </li>
                  ) : (
                    <li className="productsItem" key={el.productId}>
                      <p className="productName">{el.name}</p>
                      <p className="productCount">{countSales[el.productId]}</p>
                    </li>
                  )
                )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NumberOfSales;
