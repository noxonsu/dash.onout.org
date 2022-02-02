import { COVERS } from "../images";

export interface Product {
  name: string;
  demo: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
  promoPage: string;
  promoPageLink: string;
  buyLink: string;
  price: number; // USD
}

export const PRODUCTS: { [id: string]: Product } = {
  multicyrrencyWallet: {
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
    price: 999,
  },
  definance: {
    name: "DeFinance (DEX)",
    demo: "definance.wpmix.net",
    description: "",
    imgSrc: COVERS.dexCover,
    imgAlt: "",
    promoPage: "OnOut DEX",
    promoPageLink: "https://tools.onout.org/dex/",
    buyLink:
      "https://codecanyon.net/item/definance-ethereum-defi-plugin-for-wordpress/29099232",
    price: 899,
  },
  farmfactory: {
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
    price: 799,
  },
  daofactory: {
    name: "DaoFactory",
    demo: "dao.wpmix.net",
    description: "",
    imgSrc: COVERS.daoCover,
    imgAlt: "",
    promoPage: "OnOut DAO",
    promoPageLink: "https://tools.onout.org/dao/",
    buyLink:
      "https://codecanyon.net/item/dao-factory-governance-and-proposals-plugin-for-your-token-for-wordpress/35608699",
    price: 499,
  },
  lotteryFactory: {
    name: "LotteryFactory",
    demo: "lottery.wpmix.net",
    description: "",
    imgSrc: COVERS.lotteryCover,
    imgAlt: "",
    promoPage: "OnOut Lottery",
    promoPageLink: "https://tools.onout.org/lottery/",
    buyLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
    price: 999,
  },
};
