import { COVERS } from "../images";

export const PAYMENT_ADDRESS = "0xDA873Ff72bd4eA9c122C51a837DA3f88307D1DB5";
// 50 calls per minute
export const PRICE_ENDPOINT = "https://api.coingecko.com/api/v3";

// https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0
export const NETWORKS = {
  1: {
    currency: {
      id: "ethereum",
    },
  },
  56: {
    currency: {
      id: "binancecoin",
    },
  },
  137: {
    currency: {
      id: "aave-polygon-wmatic",
    },
  },
};

export interface Product {
  id: string;
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
    id: "multicyrrencyWallet",
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
    id: "definance",
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
    id: "farmfactory",
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
    id: "daofactory",
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
    id: "lotteryFactory",
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
