import { BsGraphUp, BsGraphDown } from "react-icons/bs";
import { useEffect, useState } from "react";
import { getPrice } from "../../helpers/currency";
import axios from "../../helpers/axios";
import {
  bonusAndDiscountContractsByNetworkId,
  FIAT_TICKER,
  NETWORKS,
  PAYMENT_ADDRESS,
  statisticUrlsDataByNetwork,
} from "../../constants";
import "./index.css";

interface stateParametres {
  [index: string]: any;
}
interface stateSalesParametres {
  [index: string]: number;
}

const Statistics = () => {
  const [transactionsResult, setTransactionsResult] = useState<stateParametres>({});
  const [tokenRate, setTokenRate] = useState<stateParametres>({});
  const [salesWeek, setSalesWeek] = useState<stateSalesParametres>({});
  const [profit, setProfit] = useState(0);
  const WeekInHours = 168;
  const millisecund = 1000;
  const decimals = 18;
  const zeros = 10 ** decimals;
  const statisticUrlsDataByNetworkArray = Object.values(statisticUrlsDataByNetwork);

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

  const getTransactionResutl = () => {
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
    const supportedChainIdValue = Object.keys(transactionsResult);
    let salesThisWeek = 0;
    let salesLastWeek = 0;
    supportedChainIdValue.forEach((networkId) => {
      const transactionsResultArray = transactionsResult[networkId];
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
        });
      };
      getTransactionsWeek();

      const getSalesBalanceThisWeek = transationThisWeek.reduce((acc: any, res: any) => {
        return acc + res.value * 1;
      }, 0);

      salesThisWeek += Math.floor((getSalesBalanceThisWeek / zeros) * tokenRate[networkId]);

      setSalesWeek((prevState) => {
        return { ...prevState, salesThisWeek };
      });

      const getSalesBalanceLastWeek = transationLastWeek.reduce((acc: any, res: any) => {
        return acc + res.value * 1;
      }, 0);

      salesLastWeek += Math.floor((getSalesBalanceLastWeek / zeros) * tokenRate[networkId]);
      setSalesWeek((prevState) => {
        return { ...prevState, salesLastWeek };
      });
    });
  };

  useEffect(() => {
    getRate();
    getTransactionResutl();
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
