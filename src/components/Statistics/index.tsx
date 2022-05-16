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
} from "../../constants";
import "./index.css";

const Statistics = () => {
  const [salesWeek, setSalesWeek] = useState<{ [sales: string]: number }>({});
  const [profit, setProfit] = useState(0);
  const millisecund = 1000;
  const decimals = 18;
  const zeros = 10 ** decimals;
  const statisticUrlsDataByNetworkArray = Object.values(statisticUrlsDataByNetwork);

  const getRate = async (networkId: any) => {
    const assetId = NETWORKS[networkId as SupportedChainId].currency.id;
    const data = await getPrice({
      assetId,
      vsCurrency: FIAT_TICKER.toLowerCase(),
    });
    return data[assetId]?.usd;
  };

  const getTransactionsResult = async (object: any) => {
    const urlParametres = `/api?module=account&action=txlist&address=${object.fetchingAddress}&startblock=0&endblock=99999999&page=1&sort=asc&apikey=${object.apiKey}`;
    return await axios({
      url: object.apiDomen + urlParametres,
      method: "get",
    })
      .then(({ data }) => {
        return data.result;
      })
      .catch((error) => console.error(error));
  };

  const getWeek = (date: any, days: number) => {
    date = new Date(date);
    const day = date.getDay() + days;
    const daysOfTheWeek = date.getDate() - day + (day === 0 ? -6 : 1);
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

    statisticUrlsDataByNetworkArray.map(async (Object) => {
      const tokenRate = await getRate(Object.networkId);
      const transactionsResults = await getTransactionsResult(Object);

      const getWeekTransactions = async (startWeek: any, finishWeek: any) => {
        return await transactionsResults.filter((transactionData: any) => {
          return (
            transactionData.to ===
              bonusAndDiscountContractsByNetworkId[Object.networkId as SupportedChainId].toLowerCase() &&
            transactionData.timeStamp * millisecund >= startWeek &&
            transactionData.timeStamp * millisecund <= finishWeek &&
            transactionData.value > 0
          );
        });
      };
      const sumOfTransactionValues = (txs: { value: string }[]) => txs.reduce((acc, res) => acc + Number(res.value), 0);
      const formatAmount = (amount: number) => Math.floor((amount / zeros) * tokenRate);
      const transationThisWeek = await getWeekTransactions(thisWeekTimestamp, dateNowTimestamp);
      const transationLastWeek = await getWeekTransactions(lastWeekTimestamp, thisWeekTimestamp);
      salesThisWeek += formatAmount(sumOfTransactionValues(transationThisWeek));
      salesLastWeek += formatAmount(sumOfTransactionValues(transationLastWeek));

      setSalesWeek((prevState) => {
        return { ...prevState, salesThisWeek, salesLastWeek };
      });

      const profitPercentage = ((salesThisWeek - salesLastWeek) * 100) / salesThisWeek;
      setProfit(!profitPercentage ? 0 : Math.floor(profitPercentage));
    });
  };

  useEffect(() => {
    getTransationsBalance();
  }, []);

  return (
    <div className="statistics">
      <h3>Dashboard statistics</h3>
      {salesWeek.salesThisWeek >= 0 ? (
        <p>
          Sales this week: {salesWeek.salesThisWeek}${" "}
          <span>
            {`(${profit >= 0 ? "+" : ""}${profit}%)`}{" "}
            {profit >= 0 ? (
              <BsGraphUp className="graphUp" size="1rem" />
            ) : (
              <BsGraphDown className="graphDown" size="1rem" />
            )}
          </span>
        </p>
      ) : (
        <p className="pending">Sales this week: Loading</p>
      )}
      {salesWeek.salesLastWeek >= 0 ? (
        <p>Sales last week: {salesWeek.salesLastWeek}$</p>
      ) : (
        <p className="pending">Sales last week: Loading</p>
      )}
    </div>
  );
};

export default Statistics;
