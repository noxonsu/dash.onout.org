import { COVERS } from "../images";

export const PAYMENT_ADDRESS = "0x3B85D38c3A7AEabABA8B7DEb7a73177688270abC";
// 50 calls per minute
export const PRICE_ENDPOINT = "https://api.coingecko.com/api/v3";

export const FIAT_TICKER = "USD";

// https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0
export const NETWORKS = {
  1: {
    name: "Ethereum",
    currency: {
      id: "ethereum",
    },
  },
  56: {
    name: "Binance Smart Chain",
    currency: {
      id: "binancecoin",
    },
  },
  137: {
    name: "Polygon",
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
  howToEarn?: string;
  adminCanEdit?: string;
}

export const PRODUCTS: { [id: string]: Product } = {
  multicyrrencywallet: {
    id: "multicyrrencywallet",
    name: "MCW (Wallet + Exchange)",
    demo: "wallet.wpmix.net",
    howToEarn:
      "Add 'Withdraw' comission (BTC, ETH, Tokens), exchange comission (0x.org connected)",
    adminCanEdit: "Logo, colors, styles, list of assets (BTC, ETH, Tokens)",
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
    howToEarn: "0.01% - 99% each trade",
    adminCanEdit:
      "Logo, colors, list of assets, links, fee percent, admin and fee addresses",
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
    howToEarn: "No comissions",
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
    howToEarn: "No comissions",
    description: "",
    imgSrc: COVERS.daoCover,
    imgAlt: "",
    promoPage: "OnOut DAO",
    promoPageLink: "https://tools.onout.org/dao/",
    buyLink:
      "https://codecanyon.net/item/dao-factory-governance-and-proposals-plugin-for-your-token-for-wordpress/35608699",
    price: 499,
  },
  lotteryfactory: {
    id: "lotteryfactory",
    name: "LotteryFactory",
    howToEarn: "No comissions",
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
