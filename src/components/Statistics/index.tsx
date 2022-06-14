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

const Statistics = () => {
  const [salesWeek, setSalesWeek] = useState<{ [sales: string]: number }>({});
  const [isStatisticsLoading, setIsStatisticsLoading] = useState(false);
  const [profit, setProfit] = useState(0);
  const millisecund = 1000;
  const decimals = 18;
  const zeros = 10 ** decimals;
  const statisticUrlsDataByNetworkArray = Object.values(statisticUrlsDataByNetwork);

  const getRate = async (networkId: SupportedChainId) => {
    try {
      const assetId = NETWORKS[networkId].currency.id;
      const data = await getPrice({
        assetId,
        vsCurrency: FIAT_TICKER.toLowerCase(),
      });
      return data[assetId]?.usd;
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

  const getWeek = (date: any, days: number) => {
    const sunday = 0;
    const minusSixDays = -6;
    const oneDay = 1;
    const day = date.getDay() + days;
    const daysOfTheWeek = date.getDate() - day + (day === sunday ? minusSixDays : oneDay);
    return new Date(date.setDate(daysOfTheWeek));
  };

  const getTransationsBalance = async () => {
    const toTimestamp = (strDate: any) => Date.parse(strDate);
    const date = new Date();
    const thisWeekDate = getWeek(date, 1);
    const lastWeekDate = getWeek(date, 8);
    const thisWeekTimestamp = toTimestamp(thisWeekDate);
    const lastWeekTimestamp = toTimestamp(lastWeekDate);
    const dateNowTimestamp = Date.now();
    let salesThisWeek = 0;
    let salesLastWeek = 0;
    setIsStatisticsLoading(true);

    await Promise.all(
      statisticUrlsDataByNetworkArray.map(async (urlData: StatisticUrlsData) => {
        const tokenRate = await getRate(urlData.networkId);
        const transactionsResults = await getTransactionsResult(urlData);

        const getWeekTransactions = async (startWeek: any, finishWeek: any) => {
          return await transactionsResults.filter((transactionData: any) => {
            return (
              transactionData.to === bonusAndDiscountContractsByNetworkId[urlData.networkId].toLowerCase() &&
              transactionData.timeStamp * millisecund >= startWeek &&
              transactionData.timeStamp * millisecund <= finishWeek &&
              transactionData.value > 0
            );
          });
        };
        const sumOfTransactionValues = (txs: { value: string }[]) =>
          txs.reduce((acc, res) => acc + Number(res.value), 0);
        const formatAmount = (amount: number) => Math.floor((amount / zeros) * tokenRate);

        const transationThisWeek = await getWeekTransactions(thisWeekTimestamp, dateNowTimestamp);
        const transationLastWeek = await getWeekTransactions(lastWeekTimestamp, thisWeekTimestamp);
        if (!transationThisWeek || !transationLastWeek) {
          return;
        } else {
          salesThisWeek += formatAmount(sumOfTransactionValues(transationThisWeek));
          salesLastWeek += formatAmount(sumOfTransactionValues(transationLastWeek));
        }

        setSalesWeek((prevState) => {
          return { ...prevState, salesThisWeek, salesLastWeek };
        });
        if (!salesThisWeek && salesLastWeek) {
          setProfit(-100);
          return false;
        }
        const profitPercentage = (salesThisWeek * 100) / (salesLastWeek || 1);
        if (salesThisWeek < salesLastWeek) {
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
      {isStatisticsLoading ? (
        <p className="pending">Loading data</p>
      ) : (
        <div>
          <p>
            Sales this week: ${salesWeek.salesThisWeek}{" "}
            {!salesWeek.salesThisWeek && !salesWeek.salesLastWeek ? (
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
          <p>Sales last week: ${salesWeek.salesLastWeek}</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
