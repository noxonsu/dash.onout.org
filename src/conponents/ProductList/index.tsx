const ProductTableData = [
  {
    name: "MCW (Wallet + Exchange)",
    demo: "wallet.wpmix.net",
    promoPage: "Codecanyon",
    promoPageLink: "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064",
    buyLink: "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064"
  },
  {
    name: "DeFinance (DEX)",
    demo: "definance.wpmix.net",
    promoPage: "OnOut DEX",
    promoPageLink: "https://tools.onout.org/dex/",
    buyLink: "https://codecanyon.net/item/definance-ethereum-defi-plugin-for-wordpress/29099232"
  },
  {
    name: "FarmFactory",
    demo: "farm.wpmix.net",
    promoPage: "Codecanyon",
    promoPageLink: "https://codecanyon.net/item/farmfactory-ethereum-assets-staking-yield-farming/29987071",
    buyLink: "https://codecanyon.net/item/farmfactory-ethereum-assets-staking-yield-farming/29987071"
  },
  {
    name: "DaoFactory",
    demo: "dao.wpmix.net",
    promoPage: "OnOut DAO",
    promoPageLink: "https://tools.onout.org/dao/",
    buyLink: "https://codecanyon.net/item/dao-factory-governance-and-proposals-plugin-for-your-token-for-wordpress/35608699"
  },
  {
    name: "LotteryFactory",
    demo: "lottery.wpmix.net",
    promoPage: "OnOut Lottery",
    promoPageLink: "https://tools.onout.org/lottery/",
    buyLink: "https://codecanyon.net/item/multicurrency-crypto-wallet-and-exchange-widgets-for-wordpress/23532064"
  },
]

const ProductList = () => {

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{border: "1px solid"}}>Name</th>
            <th style={{border: "1px solid"}}>Demo</th>
            <th style={{border: "1px solid"}}>Promo Page</th>
            <th style={{border: "1px solid"}}>Buy Link</th>
          </tr>
        </thead>
        <tbody>
          {
            ProductTableData.map((product, i) => {
              return (
                <tr key={i}>
                  <td style={{border: "1px solid"}}>{product.name}</td>
                  <td style={{border: "1px solid"}}>
                    <a href={`https://${product.demo}`} target="_blank" rel="noreferrer">{product.demo}</a>
                  </td>
                  <td style={{border: "1px solid"}}>
                    <a href={product.promoPageLink} target="_blank" rel="noreferrer">{product.promoPage}</a>
                  </td>
                  <td style={{border: "1px solid"}}>
                    <a href={product.buyLink} target="_blank" rel="noreferrer">link</a>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
};

export default ProductList;