import { useContext, useState } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { Route, Routes, useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser";
import ProductList from "../ProductList";
import UserProducts from "../UserProducts";
import Product from "../Product";
import Tabs from "../Tabs"
import Affiliate from "../Affiliate";

import "./index.css";

const Sections = () => {
  const location = useLocation();

  const { account } = useContext(Web3ConnecStateContext);
  const { state } = useUser();
  const { signed, subscribed, view, products } = state;

  // For now, while we save it in localStorage, retrive all saved user products from here

  if (!signed || !subscribed || account.wrongNetwork) return null;

  const locationArr = location.pathname.split("/");
  let newView;
  if (locationArr !== undefined || null) {
    newView = locationArr[locationArr.length - 1];
  } else {
    newView = view;
  }

  return (
    <div>
      <Tabs newView={newView} />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/presale" element={<ProductList />} />
        <Route path="/user-products" element={<UserProducts />} />
        <Route
          path={`/products/${newView}`}
          element={<Product id={newView} />}
        />
        <Route path={`/affiliate`} element={<Affiliate />} />
      </Routes>
    </div>
  );
};

export default Sections;
