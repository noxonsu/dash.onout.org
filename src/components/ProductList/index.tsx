import { useLocation } from "react-router-dom";
import { PRODUCTS_BY_CATEGORY } from "../../constants";

import IdeaList from "../IdeaList";
import ProductCategory from "./ProductCategory";

import "./index.css";

const ProductList = () => {
  const location = useLocation();

  let currentStatus = "";

  if (location.pathname === "/presale") {
    currentStatus = "development";
  } else if (location.pathname === "" || location.pathname === "/") {
    currentStatus = "ready";
  } else {
    currentStatus = "";
  }

  return (
    <div>
      <div className="products">
        <ProductCategory
          currentStatus={currentStatus}
          title="Web3 Apps"
          products={PRODUCTS_BY_CATEGORY.WEB3_PRODUCTS}
        />
        <ProductCategory currentStatus={currentStatus} title="AI Apps" products={PRODUCTS_BY_CATEGORY.AI_PRODUCTS} />
      </div>
      {currentStatus === "development" && <IdeaList />}
    </div>
  );
};

export default ProductList;
