import { COVERS } from "../assets";

export const FEEDBACK_URL = "https://noxon.wpmix.net/counter.php";
export const PAYMENT_ADDRESS = "0x3B85D38c3A7AEabABA8B7DEb7a73177688270abC";
// 50 calls per minute
export const PRICE_ENDPOINT = "https://api.coingecko.com/api/v3";

export const FIAT_TICKER = "USD";

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
  demo: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
  promoPage: string;
  promoPageLink: string;
  codecanyonLink?: string;
  price: number | undefined; // USD
  howToEarn?: string;
  adminCanEdit?: string;
}

export const PRODUCTS: { [id: string]: Product } = {
  multicurrencywallet: {
    id: "multicurrencywallet",
    name: "MCW (Wallet + Exchange)",
    demo: "wallet.wpmix.net",
    howToEarn:
      "Add 'Withdraw' comission (BTC, ETH, Tokens), exchange comission (0x.org connected)",
    adminCanEdit: "Logo, colors, styles, list of assets (BTC, ETH, Tokens)",
    description: "",
    imgSrc: COVERS.walletCover,
    imgAlt: "multicurrency wallet promo",
    promoPage: "OnOut wallet",
    promoPageLink: "https://tools.onout.org/wallet/",
    codecanyonLink:
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
    imgAlt: "DeFinance promo",
    promoPage: "OnOut DEX",
    promoPageLink: "https://tools.onout.org/dex/",
    codecanyonLink:
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
    imgAlt: "Farmfactory promo",
    promoPage: "Codecanyon",
    promoPageLink: "https://tools.onout.org/farming/",
    codecanyonLink:
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
    imgAlt: "Daofactory promo",
    promoPage: "OnOut DAO",
    promoPageLink: "https://tools.onout.org/dao/",
    codecanyonLink:
      "https://codecanyon.net/item/dao-factory-governance-and-proposals-plugin-for-your-token-for-wordpress/35608699",
    price: 600,
  },
  lotteryfactory: {
    id: "lotteryfactory",
    name: "LotteryFactory",
    howToEarn: "0 - 30% from selling tickets",
    demo: "lottery.wpmix.net",
    description: "",
    imgSrc: COVERS.lotteryCover,
    imgAlt: "Lotteryfactory promo",
    promoPage: "OnOut Lottery",
    promoPageLink: "https://tools.onout.org/lottery/",
    codecanyonLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
    price: 999,
  },
  nftmarketplace: {
    id: "nftmarketplace",
    name: "NFT Marketplace",
    howToEarn: "",
    demo: "https://nft.wpmix.net/",
    description: "",
    imgSrc: COVERS.nftsyCover,
    imgAlt: "NFT Marketplace promo",
    promoPage: "OnOut NFT Marketplace",
    promoPageLink: "https://tools.onout.org/nft/",
    price: 500,
  },
};
