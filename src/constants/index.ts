import { COVERS } from "../assets";

export const FEEDBACK_URL = "https://noxon.wpmix.net/counter.php";
export const PAYMENT_ADDRESS = "0x3B85D38c3A7AEabABA8B7DEb7a73177688270abC";
export const CONTRACT_ADDRESS_POLYGON = '0xb4e3F3716Eb11f58ad16Ac6400068D171A9e465F';
// 50 calls per minute
export const PRICE_ENDPOINT = "https://api.coingecko.com/api/v3";

export const FIAT_TICKER = "USD";

// Google analytics Tracking ID
export const GA_TRACKING_ID = "UA-219725401-1";

// https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0
export const NETWORKS = {
  // 4: {
  //   id: 1,
  //   name: "Rinkeby",
  //   currency: {
  //     id: "ethereum",
  //   },
  //   tokens: {
  //     usdt: {
  //       address: "",
  //       id: "",
  //     },
  //   },
  // },
  1: {
    id: 1,
    name: "Ethereum",
    currency: {
      id: "ethereum",
    },
    tokens: {
      usdt: {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        id: "",
      },
    },
  },
  56: {
    id: 56,
    name: "BSC",
    currency: {
      id: "binancecoin",
    },
    tokens: {
      usdt: {
        address: "0x55d398326f99059fF775485246999027B3197955",
        id: "",
      },
    },
  },
  137: {
    id: 137,
    name: "Polygon",
    currency: {
      id: "aave-polygon-wmatic",
    },
    tokens: {
      usdt: {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        id: "",
      },
    },
  },
};

export interface Product {
  id: string;
  name: string;
  process: string;
  demo: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
  promoPage: string;
  promoPageLink: string;
  docsLink?: string;
  codecanyonLink?: string;
  price: number | undefined; // USD
  howToEarn?: string;
  adminCanEdit?: string;
  lables: string[];
}

export const PRODUCTS: { [id: string]: Product } = {
  crosschain: {
    id: "crosschain",
    name: "CROSS-CHAIN exchange",
    process: "development-in-progress",
    demo: "",
    howToEarn: "On commission for each trade",
    adminCanEdit:
      "Logo, colors, list of assets, links, fee percent, admin and fee addresses",
    description: "Presale... Development in progress. Pay now to fix the price. (ETA: 1 month)",
    imgSrc: COVERS.crossChainCover,
    imgAlt: "crosschain wallet promo",
    promoPage: "OnOut cross-chain",
    promoPageLink: "",
    docsLink: "",
    codecanyonLink: "",
    lables: ['new'],
    price: 1000,
  },
  multicurrencywallet: {
    id: "multicurrencywallet",
    name: "MCW (Wallet + Exchange)",
    process: "ready",
    demo: "wallet.wpmix.net",
    howToEarn:
      "Add 'Withdraw' comission (BTC, ETH, Tokens), exchange comission (0x.org connected)",
    adminCanEdit: "Logo, colors, styles, list of assets (BTC, ETH, Tokens)",
    description: "",
    imgSrc: COVERS.walletCover,
    imgAlt: "multicurrency wallet promo",
    promoPage: "OnOut wallet",
    promoPageLink: "https://tools.onout.org/wallet/",
    docsLink: "https://support.onout.org/hc/1331700057/category/1",
    codecanyonLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
    lables: [],
    price: 999,
  },
  definance: {
    id: "definance",
    name: "DeFinance (DEX)",
    process: "ready",
    demo: "definance.wpmix.net",
    howToEarn: "0.01% - 99% each trade",
    adminCanEdit:
      "Logo, colors, list of assets, links, fee percent, admin and fee addresses",
    description: "",
    imgSrc: COVERS.dexCover,
    imgAlt: "DeFinance promo",
    promoPage: "OnOut DEX",
    promoPageLink: "https://tools.onout.org/dex/",
    docsLink: "https://support.onout.org/hc/1331700057/category/2",
    codecanyonLink:
      "https://codecanyon.net/item/definance-ethereum-defi-plugin-for-wordpress/29099232",
    lables: [],
    price: 899,
  },
  farmfactory: {
    id: "farmfactory",
    name: "FarmFactory",
    process: "ready",
    demo: "farm.wpmix.net",
    howToEarn: "No comissions",
    description: "",
    imgSrc: COVERS.farmingCover,
    imgAlt: "Farmfactory promo",
    promoPage: "Codecanyon",
    promoPageLink: "https://tools.onout.org/farming/",
    docsLink: "https://support.onout.org/hc/1331700057/category/3",
    codecanyonLink:
      "https://codecanyon.net/item/farmfactory-ethereum-assets-staking-yield-farming/29987071",
    lables: [],
    price: 799,
  },
  daofactory: {
    id: "daofactory",
    name: "DaoFactory",
    process: "ready",
    demo: "dao.wpmix.net",
    howToEarn: "No comissions",
    description: "",
    imgSrc: COVERS.daoCover,
    imgAlt: "Daofactory promo",
    promoPage: "OnOut DAO",
    promoPageLink: "https://tools.onout.org/dao/",
    docsLink: "https://support.onout.org/hc/1331700057/category/4",
    codecanyonLink:
      "https://codecanyon.net/item/dao-factory-governance-and-proposals-plugin-for-your-token-for-wordpress/35608699",
    lables: [],
    price: 600,
  },
  lotteryfactory: {
    id: "lotteryfactory",
    name: "LotteryFactory",
    process: "ready",
    howToEarn: "0 - 30% from selling tickets",
    demo: "lottery.wpmix.net",
    description: "",
    imgSrc: COVERS.lotteryCover,
    imgAlt: "Lotteryfactory promo",
    promoPage: "OnOut Lottery",
    promoPageLink: "https://tools.onout.org/lottery/",
    docsLink: "https://support.onout.org/hc/1331700057/category/6",
    codecanyonLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
    lables: [],
    price: 999,
  },
  nftmarketplace: {
    id: "nftmarketplace",
    name: "NFT Marketplace",
    process: "ready",
    howToEarn: "",
    demo: "https://nft.wpmix.net/",
    description: "",
    imgSrc: COVERS.nftsyCover,
    imgAlt: "NFT Marketplace promo",
    promoPage: "OnOut NFT Marketplace",
    promoPageLink: "https://tools.onout.org/nft/",
    docsLink: "",
    lables: [],
    price: 500,
  },
};
