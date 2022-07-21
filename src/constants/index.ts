import { COVERS } from "../assets";

export const FEEDBACK_URL = "https://noxon.wpmix.net/counter.php";
export const PAYMENT_ADDRESS = "0x3B85D38c3A7AEabABA8B7DEb7a73177688270abC";
export const EVM_ADDRESS_REGEXP = /^0x[A-Fa-f0-9]{40}$/;

export enum SupportedChainId {
  MAINNET = 1,
  BINANCE_SMART_CHAIN = 56,
  POLYGON = 137,
}

export const bonusAndDiscountContractsByNetworkId = {
  [SupportedChainId.POLYGON]: "0xd9f89Dec54CbF10011FDc8D9FA06E1f30c3F74d4",
  [SupportedChainId.BINANCE_SMART_CHAIN]: "0xB0A06daCa7F05D86D8fC1e289E08f734398EaE89",
  [SupportedChainId.MAINNET]: PAYMENT_ADDRESS,
};

export interface StatisticUrlsData {
  name: string;
  networkId: SupportedChainId;
  apiKey: string;
  apiDomain: string;
}

export const statisticUrlsDataByNetwork: {
  [key in SupportedChainId]: StatisticUrlsData;
} = {
  [SupportedChainId.POLYGON]: {
    name: "POLYGON",
    networkId: SupportedChainId.POLYGON,
    apiKey: "4JB4UXHBIE2I5285T18J8SSPUS2M3K7X3V",
    apiDomain: "https://api.polygonscan.com",
  },
  [SupportedChainId.BINANCE_SMART_CHAIN]: {
    name: "BINANCE_SMART_CHAIN",
    networkId: SupportedChainId.BINANCE_SMART_CHAIN,
    apiKey: "2JEI3SQQ8VFNVHFC8XSSNBRNCHZP3632QD",
    apiDomain: "https://api.bscscan.com",
  },
  [SupportedChainId.MAINNET]: {
    name: "MAINNET",
    networkId: SupportedChainId.MAINNET,
    apiKey: "RZ7N3TCPHFIU7Q4KA1V93MZWRN4X7F8HIT",
    apiDomain: "https://api.etherscan.io",
  },
};

export const cashbackTokenAddresses = {
  [SupportedChainId.POLYGON]: "0x654496319F438A59FEE9557940393cf818753ee9",
  [SupportedChainId.BINANCE_SMART_CHAIN]: "0x92648e4537CdFa1EE743A244465a31AA034B1ce8",
  [SupportedChainId.MAINNET]: "",
};

// 50 calls per minute
export const PRICE_ENDPOINT = "https://api.coingecko.com/api/v3";

export const FIAT_TICKER = "USD";

// Google analytics Tracking ID
export const GA_TRACKING_ID = "UA-219725401-1";

// Checking address cache
export const SUBSCRIPTION_POSTFIX_KEY = "::subscriptionCheckingDate";
export const ONE_DAY = 86400000; // in milliseconds
export const ONE_MONTH = ONE_DAY * 30;

// https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0

export interface Network {
  id: number;
  chainId: string;
  name: string;
  currency: {
    id: string;
    symbol: string;
    binancePurchaseKey: string;
  };
  tokens: {
    [key: string]: {
      address: string;
      id: string;
    };
  };
}

export const NETWORKS: { [key in SupportedChainId]: Network } = {
/* 4: {
    id: 1,
    name: "Rinkeby",
    currency: {
      id: "ethereum",
      symbol: "ETH",
    },
    tokens: {
      usdt: {
        address: "",
        id: "",
      },
    },
  }, */
  [SupportedChainId.MAINNET]: {
    id: 1,
    chainId: `0x${(1).toString(16)}`,
    name: "Ethereum",
    currency: {
      id: "ethereum",
      symbol: "ETH",
      binancePurchaseKey: 'ethereum',
    },
    tokens: {
      usdt: {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        id: "",
      },
    },
  },
  [SupportedChainId.BINANCE_SMART_CHAIN]: {
    id: 56,
    chainId: `0x${(56).toString(16)}`,
    name: "BSC",
    currency: {
      id: "binancecoin",
      symbol: "BNB",
      binancePurchaseKey: 'BNB',
    },
    tokens: {
      usdt: {
        address: "0x55d398326f99059fF775485246999027B3197955",
        id: "",
      },
    },
  },
  [SupportedChainId.POLYGON]: {
    id: 137,
    chainId: `0x${(137).toString(16)}`,
    name: "Polygon",
    currency: {
      id: "aave-polygon-wmatic",
      symbol: "MATIC",
      binancePurchaseKey: 'polygon-matic',
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
  productId: Number;
  name: string;
  status: string;
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
    productId: 1,
    name: "CROSS-CHAIN exchange",
    status: "ready",
    demo: "crosschain.onout.org",
    howToEarn: "Set up commission on all your multichain liquidity pair of tokens and each trade between them",
    adminCanEdit: "Project name, logo, colors, social links, list of assets, tokens' swap config (includes fee percent)",
    description: "",
    imgSrc: COVERS.crossChainCover,
    imgAlt: "crosschain bridge promo",
    promoPage: "OnOut cross-chain",
    promoPageLink: "https://tools.onout.org/crosschain/",
    docsLink: "https://support.onout.org/hc/1331700057/category/7",
    codecanyonLink: "",
    lables: ["new"],
    price: 1000,
  },
  multicurrencywallet: {
    id: "multicurrencywallet",
    productId: 2,
    name: "MCW (Wallet + Exchange)",
    status: "ready",
    demo: "wallet.wpmix.net",
    howToEarn: "Add 'Withdraw' comission (BTC, ETH, Tokens), exchange comission (0x.org connected)",
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
    productId: 3,
    name: "DeFinance (DEX)",
    status: "ready",
    demo: "definance.wpmix.net",
    howToEarn: "0.01% - 99% each trade",
    adminCanEdit: "Logo, colors, list of assets, links, fee percent, admin and fee addresses",
    description: "",
    imgSrc: COVERS.dexCover,
    imgAlt: "DeFinance promo",
    promoPage: "OnOut DEX",
    promoPageLink: "https://tools.onout.org/dex/",
    docsLink: "https://support.onout.org/hc/1331700057/category/2",
    codecanyonLink: "https://codecanyon.net/item/definance-ethereum-defi-plugin-for-wordpress/29099232",
    lables: [],
    price: 899,
  },
  farmfactory: {
    id: "farmfactory",
    productId: 4,
    name: "FarmFactory",
    status: "ready",
    demo: "farm.wpmix.net",
    howToEarn: "No comissions",
    description: "",
    imgSrc: COVERS.farmingCover,
    imgAlt: "Farmfactory promo",
    promoPage: "Codecanyon",
    promoPageLink: "https://tools.onout.org/farming/",
    docsLink: "https://support.onout.org/hc/1331700057/category/3",
    codecanyonLink: "https://codecanyon.net/item/farmfactory-ethereum-assets-staking-yield-farming/29987071",
    lables: [],
    price: 799,
  },
  daofactory: {
    id: "daofactory",
    productId: 5,
    name: "DaoFactory",
    status: "ready",
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
    productId: 6,
    name: "LotteryFactory",
    status: "ready",
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
    price: 1500,
  },
  nftmarketplace: {
    id: "nftmarketplace",
    productId: 7,
    name: "NFT Marketplace",
    status: "ready",
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
  lenda: {
    id: "lenda",
    productId: 8,
    name: "Lenda",
    status: "development",
    demo: "lenda.onout.xyz",
    description: "",
    howToEarn: "Use your own token for a collateral",
    adminCanEdit: "Logo, colors, styles, list of assets (ETH, Tokens)",
    imgSrc: COVERS.lendaCover,
    imgAlt: "Lenda promo",
    promoPage: "OnOut lenda",
    promoPageLink: "https://tools.onout.org/lenda/",
    docsLink: "",
    codecanyonLink: "",
    lables: ["new"],
    price: 1000,
  },
};

interface Idea {
  id: string;
  name: string;
  link: string;
  price: number;
}

export const IDEAS: { [id: string]: Idea } = {
  launchpad: {
    id: "launchpad",
    name: "A launchpad",
    link: "",
    price: 1,
  },
  iphoneapp: {
    id: "iphoneapp",
    name: "iPhone App",
    link: "",
    price: 1,
  },
  apponsolana: {
    id: "apponsolana",
    name: "Something on Solana",
    link: "",
    price: 1,
  },
  gambling: {
    id: "gambling",
    name: "More gambling (dice etc)",
    link: "",
    price: 1,
  },
  fiatramp: {
    id: "fiatramp",
    name: "Fiat on/off ramp (visa, p2p or something to buy/sell crypto for fiat)",
    link: "",
    price: 1,
  },
  other: {
    id: "other",
    name: "Other",
    link: "https://tools.onout.org/sponsor.md",
    price: 0,
  },
};
