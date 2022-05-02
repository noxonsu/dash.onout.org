import { BsGraphUp, BsGraphDown } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { getPrice } from "../../helpers/currency";
import axios from "../../helpers/axios";
import {
  FIAT_TICKER,
  NETWORKS,
  statisticUrlsDataByNetwork,
} from "../../constants";
import "./index.css";

interface stateParametres {
  [index: string]: any;
}

const Statistics = () => {
  const {
    account: { networkId, address, provider, wrongNetwork },
  } = useContext(Web3ConnecStateContext);
  const [transationsResult, setTransationsResult] = useState<stateParametres>(
    {}
  );
  const [tokenRate, setTokenRate] = useState<stateParametres>({});
  // const [transactionWeek, setTransactionWeek] = useState({});
  const [salesThisWeek, setSalesThisWeek] = useState(0);
  const [salesLastWeek, setSalesLastWeek] = useState(0);
  const [profit, setProfit] = useState(0);

  let salesThisWeekSum = 0;
  let salesLastWeekSum = 0;

  const WeekInHours = 168;
  const millisecund = 1000;

  const decimals = 18;
  const sum = 10 ** decimals;
  const statisticUrlsDataByNetworkArray = Object.values(
    statisticUrlsDataByNetwork
  );

  const getRate = () => {
    statisticUrlsDataByNetworkArray.map(async (object: any) => {
      let assetId = "";
      if (object.networkId === 1) {
        assetId = NETWORKS[1].currency.id;
      } else if (object.networkId === 56) {
        assetId = NETWORKS[56].currency.id;
      } else if (object.networkId === 137) {
        assetId = NETWORKS[137].currency.id;
      } else {
        return;
      }

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
            setTransationsResult((prevState) => {
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
    const supportedChainIdValue = Object.keys(transationsResult);

    supportedChainIdValue.forEach((networkId) => {
      const transationsResultArray = transationsResult[networkId];

      const transationThisWeek = transationsResultArray.filter(
        (transactionData: any) => {
          return (
            transactionData.timeStamp * millisecund > thisWeek &&
            transactionData.value > 0
          );
        }
      );
      const getSalesBalanceThisWeek = transationThisWeek.reduce(
        (acc: any, res: any) => {
          return acc + res.value * 1;
        },
        0
      );

      salesThisWeekSum += Math.floor(
        (getSalesBalanceThisWeek / sum) * tokenRate[networkId]
      );

      const transationLastWeek = transationsResultArray.filter(
        (transactionData: any) => {
          return (
            transactionData.timeStamp * millisecund > lastWeek &&
            transactionData.timeStamp * millisecund < thisWeek &&
            transactionData.value > 0
          );
        }
      );
      const getSalesBalanceLastWeek = transationLastWeek.reduce(
        (acc: any, res: any) => {
          return acc + res.value * 1;
        },
        0
      );
      salesLastWeekSum += Math.floor(
        (getSalesBalanceLastWeek / sum) * tokenRate[networkId]
      );
    });
  };

  useEffect(() => {
    getRate();
    getTransactionsResult();
    getTransationsBalance();
    setSalesThisWeek(salesThisWeekSum);
    setSalesLastWeek(salesLastWeekSum);
    const profitPercentage =
      ((salesThisWeek - salesLastWeek) * 100) / salesLastWeek;
    setProfit(!profitPercentage ? 0 : Math.floor(profitPercentage));
  }, []);

  return (
    <div className="statistics">
      <h3>Dashboard statistics</h3>
      <p className="thisWeek">
        Sales this week: <span>{salesThisWeek}$</span>{" "}
        <span>{`(${profit >= 0 ? "+" : ""}${profit}%)`}</span>{" "}
        {profit >= 0 ? (
          <BsGraphUp className="graphUp" size="1rem" />
        ) : (
          <BsGraphDown className="graphDown" size="1rem" />
        )}
      </p>
      <p className="lastWeek">
        Sales last week: <span>{salesLastWeek}$</span>
      </p>
    </div>
  );
};

export default Statistics;
