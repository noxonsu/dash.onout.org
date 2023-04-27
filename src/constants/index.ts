import { COVERS } from "../assets";

export const FEEDBACK_URL = "https://noxon.wpmix.net/counter.php";
export const PAYMENT_ADDRESS = "0x873351e707257C28eC6fAB1ADbc850480f6e0633";
export const EVM_ADDRESS_REGEXP = /^0x[A-Fa-f0-9]{40}$/;

export enum SupportedChainId {
  MAINNET = 1,
  BINANCE_SMART_CHAIN = 56,
  // POLYGON = 137,
  // POLYGON_TESTNET = 80001,
}

export const bonusAndDiscountContractsByNetworkId: {
  [k in SupportedChainId]?: string;
} = {
  //   [SupportedChainId.POLYGON]: "0xd9f89Dec54CbF10011FDc8D9FA06E1f30c3F74d4",
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
  // [SupportedChainId.POLYGON]: {
  //   name: "POLYGON",
  //   networkId: SupportedChainId.POLYGON,
  //   apiKey: "4JB4UXHBIE2I5285T18J8SSPUS2M3K7X3V",
  //   apiDomain: "https://api.polygonscan.com",
  // },
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
  // [SupportedChainId.POLYGON_TESTNET]: {
  //   name: "POLYGON TESTNET",
  //   networkId: SupportedChainId.POLYGON_TESTNET,
  //   apiKey: "4JB4UXHBIE2I5285T18J8SSPUS2M3K7X3V",
  //   apiDomain: "https://api-testnet.polygonscan.com",
  // },
};

export const cashbackTokenAddresses: {
  [k in SupportedChainId]?: string;
} = {
  // [SupportedChainId.POLYGON]: "0x654496319F438A59FEE9557940393cf818753ee9",
  [SupportedChainId.BINANCE_SMART_CHAIN]: "0x92648e4537CdFa1EE743A244465a31AA034B1ce8",
  [SupportedChainId.MAINNET]: "",
};

// 50 calls per minute
export const PRICE_ENDPOINT = "https://noxon.wpmix.net/cursAll.php";

export const FIAT_TICKER = "USD";

// Google analytics Tracking ID
export const GA_TRACKING_ID = "UA-219725401-1";

// Checking address cache
export const SUBSCRIPTION_POSTFIX_KEY = "::subscriptionCheckingDate";
export const ONE_HOUR = 3600000; // in milliseconds
export const ONE_DAY = ONE_HOUR * 24;
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
  [SupportedChainId.MAINNET]: {
    id: 1,
    chainId: `0x${(1).toString(16)}`,
    name: "Ethereum",
    currency: {
      id: "ethereum",
      symbol: "ETH",
      binancePurchaseKey: "ethereum",
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
      binancePurchaseKey: "BNB",
    },
    tokens: {
      usdt: {
        address: "0x55d398326f99059fF775485246999027B3197955",
        id: "",
      },
    },
  },
  // [SupportedChainId.POLYGON]: {
  //   id: 137,
  //   chainId: `0x${(137).toString(16)}`,
  //   name: "Polygon",
  //   currency: {
  //     id: "aave-polygon-wmatic",
  //     symbol: "MATIC",
  //     binancePurchaseKey: 'polygon-matic',
  //   },
  //   tokens: {
  //     usdt: {
  //       address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  //       id: "",
  //     },
  //   },
  // },
  // [SupportedChainId.POLYGON_TESTNET]: {
  //   id: SupportedChainId.POLYGON_TESTNET,
  //   chainId: `0x${SupportedChainId.POLYGON_TESTNET.toString(16)}`,
  //   name: "Polygon testnet",
  //   currency: {
  //     id: "blabla",
  //     symbol: "MATIC",
  //     binancePurchaseKey: "polygon-testnet-matic",
  //   },
  //   tokens: {},
  // },
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
  license?: string;
  codecanyonLink?: string;
  price: number | undefined; // USD
  howToEarn?: string;
  adminCanEdit?: string;
  videos?: string;
  lables: string[];
  isFee?: boolean;
  freeDesc?: string;
  static_link?: string;
  wp_link?: string;
}

export interface Category {
  [id: string]: Product;
}

export const WEB3_PRODUCTS: Category = {
  nftstaking: {
    id: "nftstaking",
    productId: 10,
    name: "NFTStake",
    status: "ready",
    demo: "https://shendel.github.io/nftstakedemo/",
    videos:
      "https://www.youtube.com/watch?v=jXwLpPIrDVQ&list=PLLtijyRvdwnbPVFWQHma7IwPniAKOWN0h&index=1&ab_channel=Onouttools",
    description: "White-label NFTStake Platform",
    howToEarn:
      "NFT staking is a new way to earn passive income in the crypto world. It lets NFT holders lock their assets in DeFi platforms to receive rewards. All without the need to sell their NFT collections",
    adminCanEdit: "Logo, title, colors, social links",
    imgSrc: COVERS.nftstakCover,
    imgAlt: "NFTStake promo",
    promoPage: "OnOut NFTStake",
    promoPageLink: "https://onout.org/nftstake/",
    docsLink: "",
    codecanyonLink: "",
    lables: ["new"],
    price: 500,
  },
  launchpad: {
    id: "launchpad",
    productId: 9,
    name: "IDOFactory",
    status: "ready",
    demo: "https://launchpad.onout.org/",
    videos: "https://www.youtube.com/watch?v=jiJBoMpr5tQ&list=PLLtijyRvdwnYDfXZnpaFDe2KNBB4r0FmD&index=1",
    description: "White-label Decentralized IDO Launchpad Platform",
    howToEarn: "Use your own token to creating IDO pools. Use native coin (ETH, BNB etc.) to create Token Lockers",
    adminCanEdit: "Logo, title, social links, services' fees, admin and fee addresses",
    imgSrc: COVERS.launchpadCover,
    imgAlt: "Launchpad promo",
    promoPage: "OnOut IDOFactory",
    promoPageLink: "https://onout.org/launchpad/",
    docsLink: "https://support.onout.org/hc/1331700057/category/9",
    codecanyonLink:
      "https://codecanyon.net/item/idofactory-crypto-launchpad-create-ido-pools-with-token-lockers-on/39882380",
    lables: ["new"],
    price: 950,
  },
  crosschain: {
    id: "crosschain",
    productId: 1,
    name: "CROSS-CHAIN exchange",
    status: "ready",
    demo: "https://crosschain.onout.org",
    videos: "https://www.youtube.com/playlist?list=PLLtijyRvdwnYqXwOpiiDvS55NCp13ZqGT",
    howToEarn: "Set up commission on all your multichain liquidity pair of tokens and each trade between them",
    adminCanEdit:
      "Project name, logo, colors, social links, list of assets, tokens' swap config (includes fee percent)",
    description: "",
    imgSrc: COVERS.crossChainCover,
    imgAlt: "crosschain bridge promo",
    promoPage: "OnOut cross-chain",
    promoPageLink: "https://onout.org/crosschain/",
    docsLink: "https://support.onout.org/hc/1331700057/category/7",
    codecanyonLink: "",
    lables: [],
    price: 1000,
  },
  multicurrencywallet: {
    id: "multicurrencywallet",
    productId: 2,
    name: "MCW (Wallet + Exchange)",
    status: "ready",
    demo: "https://wallet.wpmix.net",
    videos: "",
    howToEarn: "Add 'Withdraw' comission (BTC, ETH, Tokens), exchange comission (0x.org connected)",
    adminCanEdit: "Logo, colors, styles, list of assets (BTC, ETH, Tokens)",
    description: "",
    imgSrc: COVERS.walletCover,
    imgAlt: "multicurrency wallet promo",
    promoPage: "OnOut wallet",
    promoPageLink: "https://onout.org/wallet/",
    docsLink: "https://support.onout.org/hc/1331700057/category/1",
    license: "67ae17cd-8cfc-46ff-979c-c1a866fce34c",
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
    demo: "https://dex.onout.org",
    videos: "https://www.youtube.com/playlist?list=PLLtijyRvdwnbsmFWRSktrBCLMovcPEb3b",
    howToEarn: "0.01% - 99% each trade",
    adminCanEdit: "Logo, colors, list of assets, links, fee percent, admin and fee addresses",
    description: "",
    imgSrc: COVERS.dexCover,
    imgAlt: "DeFinance promo",
    promoPage: "OnOut DEX",
    promoPageLink: "https://onout.org/dex/",
    docsLink: "https://support.onout.org/hc/1331700057/category/2",
    codecanyonLink: "https://codecanyon.net/item/definance-ethereum-defi-plugin-for-wordpress/29099232",
    lables: [],
    price: 1000,
    isFee: true,
    static_link: "https://github.com/appsource/dex",
  },
  farmfactory: {
    id: "farmfactory",
    productId: 4,
    name: "FarmFactory",
    status: "ready",
    demo: "https://farm.wpmix.net",
    videos: "https://www.youtube.com/playlist?list=PLLtijyRvdwna70oHXNG-oAdKnaJBfg26C",
    howToEarn: "No comissions",
    description: "",
    imgSrc: COVERS.farmingCover,
    imgAlt: "Farmfactory promo",
    promoPage: "Codecanyon",
    promoPageLink: "https://onout.org/farming/",
    docsLink: "https://support.onout.org/hc/1331700057/category/3",
    license: "45bd94ca-b3fe-a34e-8b3c-4dc202ad7cf5",
    codecanyonLink: "https://codecanyon.net/item/farmfactory-ethereum-assets-staking-yield-farming/29987071",
    lables: [],
    price: 799,
  },
  daofactory: {
    id: "daofactory",
    productId: 5,
    name: "DaoFactory",
    status: "ready",
    demo: "https://dao.wpmix.net",
    videos: "https://www.youtube.com/playlist?list=PLLtijyRvdwnb1L4nnoIrU0uAmsRbDHtxp",
    howToEarn: "No comissions",
    description: "",
    imgSrc: COVERS.daoCover,
    imgAlt: "Daofactory promo",
    promoPage: "OnOut DAO",
    promoPageLink: "https://onout.org/dao/",
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
    demo: "https://lottery.wpmix.net",
    videos: "https://www.youtube.com/playlist?list=PLLtijyRvdwnYLjAdHtCthK3vRXf1CHpij",
    description: "",
    imgSrc: COVERS.lotteryCover,
    imgAlt: "Lotteryfactory promo",
    promoPage: "OnOut Lottery",
    promoPageLink: "https://onout.org/lottery/",
    docsLink: "https://support.onout.org/hc/1331700057/category/6",
    codecanyonLink:
      "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
    lables: [],
    price: 1500,
    freeDesc: `As an administrator, you have two options to manage the fees associated with the lottery service:<br><br>
    1) Service fee: You have the option to set a service fee for each round of the lottery. The service fee is transferred to your wallet address, and a portion of this fee, equal to 1/5 of the service fee, is deducted as the "onout.org" fee. This fee can be removed by purchasing the premium version of the lottery service.<br><br>
    2) Unclaimed funds: You have the option to withdraw unclaimed funds from the bank after one months have passed since the last round of the lottery. However, please be aware that a portion of the withdrawal, equal to 1/5 of the total amount, will be deducted as the OnOut fee. If you wish to avoid this fee, you can purchase the premium version of the lottery service.`,
    isFee: true,
    static_link: "https://github.com/appsource/StaticLotteryBuilded",
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
    promoPageLink: "https://onout.org/nft/",
    docsLink: "",
    lables: [],
    price: 500,
  },
};

export const AI_PRODUCTS: Category = {
  aigram: {
    id: "aigram",
    productId: 11,
    name: "AiGram",
    status: "ready",
    demo: "",
    description: "AiGram - a simple and fast way to deploy your own ChatGPT bot on Telegram",
    howToEarn: "You can charge for access to the bot, offer premium features for a fee.",
    adminCanEdit: "Amount of free messages, payment source, activation code",
    videos: "https://www.youtube.com/watch?v=sQBNriNoMY4&list=PLLtijyRvdwnas9R43VIhD8r2cdT2dyEW2&index=3",
    imgSrc: COVERS.aigram,
    imgAlt: "AiGram promo",
    promoPage: "OnOut AiGram",
    promoPageLink: "https://onout.org/AiGram/",
    docsLink: "https://support.onout.org/hc/1331700057/category/10",
    lables: ["new"],
    price: 100,
  },
};

export const PRODUCTS_BY_CATEGORY = {
  WEB3_PRODUCTS,
  AI_PRODUCTS,
};

export const PRODUCTS = Object.values(PRODUCTS_BY_CATEGORY).reduce((acc, category) => {
  return { ...acc, ...category };
}, {});

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
    link: "https://onout.org/sponsor.md",
    price: 0,
  },
};
