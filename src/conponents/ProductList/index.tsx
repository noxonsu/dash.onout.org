import { COVERS } from "../../images";

import "./index.css";

const ProductTableData = [
  {
    name: "MCW (Wallet + Exchange)",
    demo: "wallet.wpmix.net",
    description: "",
    imgSrc: COVERS.walletCover,
    imgAlt: "multicurrency wallet promo",
    promoPage: "Codecanyon",
    promoPageLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
    buyLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
  },
  {
    name: "DeFinance (DEX)",
    demo: "definance.wpmix.net",
    description: "",
    imgSrc: COVERS.dexCover,
    imgAlt: "",
    promoPage: "OnOut DEX",
    promoPageLink: "https://tools.onout.org/dex/",
    buyLink:
      "https://codecanyon.net/item/definance-ethereum-defi-plugin-for-wordpress/29099232",
  },
  {
    name: "FarmFactory",
    demo: "farm.wpmix.net",
    description: "",
    imgSrc: COVERS.farmingCover,
    imgAlt: "",
    promoPage: "Codecanyon",
    promoPageLink:
      "https://codecanyon.net/item/farmfactory-ethereum-assets-staking-yield-farming/29987071",
    buyLink:
      "https://codecanyon.net/item/farmfactory-ethereum-assets-staking-yield-farming/29987071",
  },
  {
    name: "DaoFactory",
    demo: "dao.wpmix.net",
    description: "",
    imgSrc: COVERS.daoCover,
    imgAlt: "",
    promoPage: "OnOut DAO",
    promoPageLink: "https://tools.onout.org/dao/",
    buyLink:
      "https://codecanyon.net/item/dao-factory-governance-and-proposals-plugin-for-your-token-for-wordpress/35608699",
  },
  {
    name: "LotteryFactory",
    demo: "lottery.wpmix.net",
    description: "",
    imgSrc: COVERS.lotteryCover,
    imgAlt: "",
    promoPage: "OnOut Lottery",
    promoPageLink: "https://tools.onout.org/lottery/",
    buyLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
  },
];

const ProductList = () => {
  const openDetails = () => {};

  return (
    <section>
      <h2 className="title">PRODUCTS</h2>

      <div className="products">
        {ProductTableData.map((product, i) => {
          const { name, description, imgSrc, imgAlt } = product;

          return (
            <div
              key={i}
              className="productCard"
              onClick={() => {
                openDetails();
              }}
            >
              <img src={imgSrc} alt={imgAlt} />
              <div className="textContent">
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
