import { BsGraphUp, BsGraphDown } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { getPrice } from "../../helpers/currency";
import axios from "../../helpers/axios";
import {
  FIAT_TICKER,
  NETWORKS,
  urlForReceivingTransactionData,
  SupportedChainId,
} from "../../constants";
import "./index.css";

const Statistics = () => {
  const {
    account: { networkId, address, provider, wrongNetwork },
  } = useContext(Web3ConnecStateContext);
  const [ethTransationsResult, setEthTransationsResult] = useState([]);
  const [bscTransationsResult, setBscTransationsResult] = useState([]);
  const [polygonTransationsResult, setPolygonTransationsResult] = useState([]);

  const [ethTokenRate, setEthTokenRate] = useState(0);
  const [bscTokenRate, setBscTokenRate] = useState(0);
  const [polygonTokenRate, setPolygonTokenRate] = useState(0);

  const [salesThisWeek, setSalesThisWeek] = useState(0);
  const [salesLastWeek, setSalesLastWeek] = useState(0);
  const [profit, setProfit] = useState(0);

  let salesThisWeekSum = 0;
  let salesLastWeekSum = 0;

  const WeekInHours = 168;
  const millisecund = 1000;
  const decimals = 18;
  const sum = 10 ** decimals;

  useEffect(() => {
    urlForReceivingTransactionData.map(async (urlObject) => {
      let assetId = "";
      if (Object.keys(urlObject)[0] === "1") {
        assetId = NETWORKS[1].currency.id;
        const data = await getPrice({
          assetId,
          vsCurrency: FIAT_TICKER.toLowerCase(),
        });
        setEthTokenRate(data[assetId]?.usd);
      } else if (Object.keys(urlObject)[0] === "56") {
        assetId = NETWORKS[56].currency.id;
        const data = await getPrice({
          assetId,
          vsCurrency: FIAT_TICKER.toLowerCase(),
        });
        setBscTokenRate(data[assetId]?.usd);
      } else if (Object.keys(urlObject)[0] === "137") {
        assetId = NETWORKS[137].currency.id;
        const data = await getPrice({
          assetId,
          vsCurrency: FIAT_TICKER.toLowerCase(),
        });
        setPolygonTokenRate(data[assetId]?.usd);
      } else {
        return;
      }
    });
  }, [address, networkId, wrongNetwork]);

  useEffect(() => {
    urlForReceivingTransactionData.map(async (urlObject: any) => {
      const objectValue = Object.values(urlObject);
      try {
        await axios({
          url: `${objectValue[0]}`,
          method: "get",
        })
          .then(({ data }) => {
            if (Object.keys(urlObject)[0] === "1") {
              setEthTransationsResult(data.result);
            } else if (Object.keys(urlObject)[0] === "56") {
              setBscTransationsResult(data.result);
            } else if (Object.keys(urlObject)[0] === "137") {
              setPolygonTransationsResult(data.result);
            } else {
              return;
            }
          })
          .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }
    });
  }, [address, networkId, wrongNetwork]);

  const supportedChainIdValue = Object.values(SupportedChainId).filter((supportedChainId) =>
    Number(supportedChainId)
  );

  useEffect(() => {
    const date = new Date();
    const thisWeek = date.setHours(date.getHours() - WeekInHours);
    const lastWeek = date.setHours(date.getHours() - WeekInHours * 2);
    supportedChainIdValue.map((chainId) => {
      let transationThisWeek = [""];
      let transationLastWeek = [""];
      if (chainId === 1) {
        transationThisWeek = ethTransationsResult.filter(
          (transactionData: any) => {
            return (
              transactionData.timeStamp * millisecund > thisWeek &&
              transactionData.value > 0
            );
          }
        );
        transationLastWeek = ethTransationsResult.filter(
          (transactionData: any) => {
            return (
              transactionData.timeStamp * millisecund > lastWeek &&
              transactionData.timeStamp * millisecund < thisWeek &&
              transactionData.value > 0
            );
          }
        );
      } else if (chainId === 56) {
        transationThisWeek = bscTransationsResult.filter(
          (transactionData: any) => {
            return (
              transactionData.timeStamp * millisecund > thisWeek &&
              transactionData.value > 0
            );
          }
        );
        transationLastWeek = bscTransationsResult.filter(
          (transactionData: any) => {
            return (
              transactionData.timeStamp * millisecund > lastWeek &&
              transactionData.timeStamp * millisecund < thisWeek &&
              transactionData.value > 0
            );
          }
        );
      } else if (chainId === 137) {
        transationThisWeek = polygonTransationsResult.filter(
          (transactionData: any) => {
            return (
              transactionData.timeStamp * millisecund > thisWeek &&
              transactionData.value > 0
            );
          }
        );
        transationLastWeek = polygonTransationsResult.filter(
          (transactionData: any) => {
            return (
              transactionData.timeStamp * millisecund > lastWeek &&
              transactionData.timeStamp * millisecund < thisWeek &&
              transactionData.value > 0
            );
          }
        );
      }
      const getSalesBalanceThisWeek = transationThisWeek.reduce(
        (acc, res: any) => {
          return acc + res.value * 1;
        },
        0
      );

      const getSalesBalanceLastWeek = transationLastWeek.reduce(
        (acc, res: any) => {
          return acc + res.value * 1;
        },
        0
      );
      if (chainId === 1) {
        salesThisWeekSum += Math.floor(
          (getSalesBalanceThisWeek / sum) * ethTokenRate
        );
        salesLastWeekSum += Math.floor(
          (getSalesBalanceLastWeek / sum) * ethTokenRate
        );
      } else if (chainId === 56) {
        salesThisWeekSum += Math.floor(
          (getSalesBalanceThisWeek / sum) * bscTokenRate
        );
        salesLastWeekSum += Math.floor(
          (getSalesBalanceLastWeek / sum) * bscTokenRate
        );
      } else if (chainId === 137) {
        salesThisWeekSum += Math.floor(
          (getSalesBalanceThisWeek / sum) * polygonTokenRate
        );
        salesLastWeekSum += Math.floor(
          (getSalesBalanceLastWeek / sum) * polygonTokenRate
        );
      } else {
        return;
      }
    });
  });

  useEffect(() => {
    setSalesThisWeek(salesThisWeekSum);
    setSalesLastWeek(salesLastWeekSum);
    
    try {
      const profitPercentage =
        ((salesThisWeek - salesLastWeek) * 100) / salesLastWeek;
      setProfit(!profitPercentage ? 0 : Math.floor(profitPercentage));
    } catch (error) {
      console.error(error);
    }
  });

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
