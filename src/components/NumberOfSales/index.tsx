import { useEffect, useState } from "react";
import { PRODUCTS } from "../../constants";
import "./index.css";

const NumberOfSales = ({ numberOfSales, isStatisticsLoading }: any) => {
  const [countSales, setCountSales] = useState<{ [id: string]: Number }>({});

  const getCountSales = async () => {
    const numberOfSalesArray = await Object.values(numberOfSales);
    if (numberOfSalesArray.length === 0) return false;

    const uniq = numberOfSalesArray
      .map((objId: any) => {
        return { count: 1, objId: objId.id };
      })
      .reduce((a: any, b: any) => {
        a[b.objId] = (a[b.objId] || 0) + b.count;
        return a;
      }, {});
    setCountSales(uniq);
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
