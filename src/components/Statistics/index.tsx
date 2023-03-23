import { BsGraphUp, BsGraphDown } from "react-icons/bs";
import { useEffect, useState } from "react";
import { getPrice } from "../../helpers/currency";
import axios from "../../helpers/axios";
import {
  bonusAndDiscountContractsByNetworkId,
  FIAT_TICKER,
  NETWORKS,
  SupportedChainId,
  statisticUrlsDataByNetwork,
  StatisticUrlsData,
} from "../../constants";
import "./index.css";
import NumberOfSales from "../NumberOfSales";
import LastProducts from "../LastProducts";

const Statistics = () => {
  const [salesMonth, setSalesMonth] = useState<{ [sales: string]: number }>({});
  const [isStatisticsLoading, setIsStatisticsLoading] = useState(false);
  const [lastProductId, setLastProductId] = useState<{ [id: string]: any }>({});
  const [numberOfSales, setNumberOfSales] = useState<{ [id: string]: any }>({});
  const [profit, setProfit] = useState(0);
  const millisecund = 1000;

  const decimals = 18;
  const zeros = 10 ** decimals;
  const statisticUrlsDataByNetworkArray = Object.values(statisticUrlsDataByNetwork);
  const getRate = async (networkId: SupportedChainId) => {
    try {
      const { symbol } = NETWORKS[networkId].currency;
      const assetUSDPrice = await getPrice({
        symbol,
        vsCurrency: FIAT_TICKER,
      });
      return assetUSDPrice;
    } catch (error) {
      console.error(error);
    }
  };

  const getTransactionsResult = async (statisticUrlsData: StatisticUrlsData) => {
    try {
      const urlParametres = `/api?module=account&action=txlist&address=${
        bonusAndDiscountContractsByNetworkId[statisticUrlsData.networkId]
      }&startblock=0&endblock=99999999&page=1&sort=asc&apikey=${statisticUrlsData.apiKey}`;

      return await axios({
        url: statisticUrlsData.apiDomain + urlParametres,
        method: "get",
      })
        .then(({ data }) => {
          return data.result;
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  const getLastProducts = async (lastProducts: any) => {
    return lastProducts.map((el: any) => {
      const productInfo = {
        id: el.input[el.input.length - 1],
        date: el.timeStamp,
      };
      return productInfo;
    });
  };

  const getSalesProduct = async (transactions: any) => {
    const transactionFind = transactions.filter((txs: any) => {
      return txs.value > 0;
    });

    return transactionFind.map((txs: any) => {
      return {
        id: txs.input[txs.input.length - 1],
      };
    });
  };

  const getTransationsBalance = async () => {
    const toTimestamp = (strDate: any) => Date.parse(strDate);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const thisMonthTimestamp = toTimestamp(new Date(year, month, 1));
    const lastMonthTimestamp = toTimestamp(new Date(year, month - 1, 1));
    const dateNowTimestamp = Date.now();
    let salesThisMonth = 0;
    let salesLastMonth = 0;
    setIsStatisticsLoading(true);

    await Promise.all(
      statisticUrlsDataByNetworkArray.map(async (urlData: StatisticUrlsData) => {
        const tokenRate = await getRate(urlData.networkId);
        const transactionsResults = await getTransactionsResult(urlData);

        const getMonthTransactions = async (startMonth: any, finishMonth: any) => {
          return await transactionsResults.filter((transactionData: any) => {
            return (
              transactionData.to === bonusAndDiscountContractsByNetworkId[urlData.networkId]?.toLowerCase() &&
              transactionData.timeStamp * millisecund >= startMonth &&
              transactionData.timeStamp * millisecund <= finishMonth &&
              transactionData.value > 0
            );
          });
        };
        const sumOfTransactionValues = (txs: { value: string }[]) =>
          txs.reduce((acc, res) => acc + Number(res.value), 0);
        const formatAmount = (amount: number) => Math.floor((amount / zeros) * tokenRate);

        const transationThisMonth = await getMonthTransactions(thisMonthTimestamp, dateNowTimestamp);
        const transationLastMonth = await getMonthTransactions(lastMonthTimestamp, thisMonthTimestamp);

        if (urlData.name !== "MAINNET") {
          const productId = await getLastProducts(transationThisMonth);
          const numberOfSalesId = await getSalesProduct(transactionsResults);

          setNumberOfSales((prevState) => {
            return {...prevState, ...numberOfSalesId}
          })
          setLastProductId((prevState) => {
            return { ...prevState, ...productId };
          });
        } else {
          return false;
        }
        if (!transationThisMonth || !transationLastMonth) {
          return;
        } else {
          salesThisMonth += formatAmount(sumOfTransactionValues(transationThisMonth));
          salesLastMonth += formatAmount(sumOfTransactionValues(transationLastMonth));
        }

        setSalesMonth((prevState) => {
          return { ...prevState, salesThisMonth, salesLastMonth };
        });
        if (!salesThisMonth && salesLastMonth) {
          setProfit(-100);
          return false;
        }
        const profitPercentage = (salesThisMonth * 100) / (salesLastMonth || 1);
        if (salesThisMonth < salesLastMonth) {
          setProfit(Math.floor(profitPercentage) - 100);
        } else {
          setProfit(Math.floor(profitPercentage) || 0);
        }
      })
    );
    setIsStatisticsLoading(false);
  };

  useEffect(() => {
    getTransationsBalance();
  }, []);

  return (
    <div className="statistics">
      <h3>Sales statistics</h3>
      <div className="statisticsWrapper">
        {isStatisticsLoading ? (
          <p className="pending">Loading data</p>
        ) : (
          <div>
            <p>
              Sales this month: ${salesMonth.salesThisMonth}{" "}
              {!salesMonth.salesThisMonth && !salesMonth.salesLastMonth ? (
                ""
              ) : (
                <span>
                  {`(${profit >= 0 ? "+" : ""}${profit}%)`}{" "}
                  {profit >= 0 ? (
                    <BsGraphUp className="graphUp" size="1rem" />
                  ) : (
                    <BsGraphDown className="graphDown" size="1rem" />
                  )}
                </span>
              )}
            </p>
            <p>Sales last month: ${salesMonth.salesLastMonth}</p>
          </div>
        )}
      </div>
      <LastProducts lastProductId={lastProductId} isStatisticsLoading={isStatisticsLoading} />
      <NumberOfSales numberOfSales={numberOfSales} isStatisticsLoading={isStatisticsLoading} />
    </div>
  );
};

export default Statistics;
