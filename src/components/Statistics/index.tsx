import { BsGraphUp, BsGraphDown } from "react-icons/bs";
import { useEffect, useState } from "react";
import { getPrice } from "../../helpers/currency";
import axios from "../../helpers/axios";
import {
  bonusAndDiscountContractsByNetworkId,
  FIAT_TICKER,
  NETWORKS,
  SupportedChainId,
  PAYMENT_ADDRESS,
  statisticUrlsDataByNetwork,
} from "../../constants";
import "./index.css";

const Statistics = () => {
  const [transactionsResult, setTransactionsResult] = useState<{ [networkName: string]: any[] }>({});
  const [tokenRate, setTokenRate] = useState<{ [coinPrice: string]: any }>({});
  const [salesWeek, setSalesWeek] = useState<{ [sales: string]: number }>({});
  const [profit, setProfit] = useState(0);
  const WeekInHours = 168;
  const millisecund = 1000;
  const decimals = 18;
  const zeros = 10 ** decimals;
  const statisticUrlsDataByNetworkArray = Object.values(statisticUrlsDataByNetwork);

  const getRate = () => {
    statisticUrlsDataByNetworkArray.map(async (object: any) => {
      const assetId = NETWORKS[object.networkId as SupportedChainId].currency.id;
      const data = await getPrice({
        assetId,
        vsCurrency: FIAT_TICKER.toLowerCase(),
      });
      setTokenRate((prevState) => {
        return { ...prevState, [object.name]: data[assetId]?.usd };
      });
    });
  };

  const getTransactionsResult = () => {
    statisticUrlsDataByNetworkArray.map(async (object: any) => {
      try {
        await axios({
          url: `${object.apiLink}`,
          method: "get",
        })
          .then(({ data }) => {
            setTransactionsResult((prevState) => {
              return { ...prevState, [object.name]: data.result };
            });
          })
          .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }
    });
  };

  const getTransationsBalance = () => {
    const date = new Date();
    const thisWeek = date.setHours(date.getHours() - WeekInHours);
    const lastWeek = date.setHours(date.getHours() - WeekInHours * 2);
    const supportedChainIdKeys = Object.keys(transactionsResult);
    let salesThisWeek = 0;
    let salesLastWeek = 0;
    supportedChainIdKeys.forEach((name) => {
      const transactionsResultArray = transactionsResult[name];
      let transationThisWeek: any = [];
      let transationLastWeek: any = [];

      const getTransactionsWeek = () => {
        transactionsResultArray.filter((transactionData: any) => {
          if (
            transactionData.to === PAYMENT_ADDRESS.toLowerCase() ||
            transactionData.to === bonusAndDiscountContractsByNetworkId[56].toLowerCase() ||
            transactionData.to === bonusAndDiscountContractsByNetworkId[137].toLowerCase()
          ) {
            if (transactionData.timeStamp * millisecund > thisWeek && transactionData.value > 0) {
              transationThisWeek.push(transactionData);
            } else if (
              transactionData.timeStamp * millisecund > lastWeek &&
              transactionData.timeStamp * millisecund < thisWeek &&
              transactionData.value > 0
            ) {
              transationLastWeek.push(transactionData);
            }
          }
          return false;
        });
      };
      getTransactionsWeek();

      const sumOfTransactionValues = (txs: { value: string }[]) => txs.reduce((acc, res) => acc + Number(res.value), 0);
      const formatAmount = (amount: number) => Math.floor((amount / zeros) * tokenRate[name]);

      salesThisWeek += formatAmount(sumOfTransactionValues(transationThisWeek));
      salesLastWeek += formatAmount(sumOfTransactionValues(transationLastWeek));

      setSalesWeek((prevState) => {
        return { ...prevState, salesThisWeek, salesLastWeek };
      });
    });
  };

  useEffect(() => {
    getRate();
    getTransactionsResult();
  }, []);

  useEffect(() => {
    getTransationsBalance();
  }, [transactionsResult, tokenRate, profit]);

  useEffect(() => {
    const profitPercentage = ((salesWeek.salesThisWeek - salesWeek.salesLastWeek) * 100) / salesWeek.salesLastWeek;
    setProfit(!profitPercentage ? 0 : Math.floor(profitPercentage));
  }, [salesWeek]);

  return (
    <div className="statistics">
      <h3>Dashboard statistics</h3>
      {!salesWeek.salesThisWeek ? (
        <p className="pending">Sales this week: Loading</p>
      ) : (
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
      )}
      {!salesWeek.salesLastWeek ? (
        <p className="pending">Sales last week: Loading</p>
      ) : (
        <p>Sales last week: {salesWeek.salesLastWeek}$</p>
      )}
    </div>
  );
};

export default Statistics;
