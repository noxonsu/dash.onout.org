import { BsGraphUp, BsGraphDown } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { Web3ConnecStateContext } from "../WithWeb3Connect";
import { getPrice } from "../../helpers/currency";
import axios from "../../helpers/axios";
import { FIAT_TICKER, NETWORKS } from "../../constants";
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

  const date = new Date();
  const thisWeek = date.setHours(date.getHours() - 168);
  const lastWeek = date.setHours(date.getHours() - 336);

  const urlForReceivingTransactionData = [
    {
      networkId: 137,
      url: "https://api.polygonscan.com/api?module=account&action=txlist&address=0xd9f89Dec54CbF10011FDc8D9FA06E1f30c3F74d4&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=4JB4UXHBIE2I5285T18J8SSPUS2M3K7X3V",
    },
    {
      networkId: 56,
      url: "https://api.bscscan.com/api?module=account&action=txlist&address=0xB0A06daCa7F05D86D8fC1e289E08f734398EaE89&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=2JEI3SQQ8VFNVHFC8XSSNBRNCHZP3632QD",
    },
    {
      networkId: 1,
      url: "https://api.etherscan.io/api?module=account&action=txlist&address=0x3B85D38c3A7AEabABA8B7DEb7a73177688270abC&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=RZ7N3TCPHFIU7Q4KA1V93MZWRN4X7F8HIT",
    },
  ];

  useEffect(() => {
    urlForReceivingTransactionData.map(async (e) => {
      let assetId = "";
      if (e.networkId === 1) {
        assetId = NETWORKS[1].currency.id;
        const data = await getPrice({
          assetId,
          vsCurrency: FIAT_TICKER.toLowerCase(),
        });
        setEthTokenRate(data[assetId]?.usd);
      } else if (e.networkId === 56) {
        assetId = NETWORKS[56].currency.id;
        const data = await getPrice({
          assetId,
          vsCurrency: FIAT_TICKER.toLowerCase(),
        });
        setBscTokenRate(data[assetId]?.usd);
      } else if (e.networkId === 137) {
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
    urlForReceivingTransactionData.map(async (e) => {
      try {
        await axios({
          url: `${e.url}`,
          method: "get",
        })
          .then(({ data }) => {
            if (e.networkId === 1) {
              setEthTransationsResult(data.result);
            } else if (e.networkId === 56) {
              setBscTransationsResult(data.result);
            } else if (e.networkId === 137) {
              setPolygonTransationsResult(data.result);
            } else {
              return;
            }
          })
          .catch((e) => console.error(e));
      } catch (e) {
        console.error(e);
      }
    });
  }, [address, networkId, wrongNetwork]);

  const getBalanceEth = () => {
    const transationThisWeek = ethTransationsResult.filter((e: any) => {
      return e.timeStamp * 1000 > thisWeek && e.value > 0;
    });
    const getSalesBalanceThisWeek = transationThisWeek.reduce(
      (acc, res: any) => {
        return acc + res.value * 1;
      },
      0
    );
    salesThisWeekSum += Math.floor(
      (getSalesBalanceThisWeek / 10 ** 18) * ethTokenRate
    );
    const transationLastWeek = ethTransationsResult.filter((e: any) => {
      return (
        e.timeStamp * 1000 > lastWeek &&
        e.timeStamp * 1000 < thisWeek &&
        e.value > 0
      );
    });
    const getSalesBalanceLastWeek = transationLastWeek.reduce(
      (acc, res: any) => {
        return acc + res.value * 1;
      },
      0
    );
    salesLastWeekSum += Math.floor(
      (getSalesBalanceLastWeek / 10 ** 18) * ethTokenRate
    );
  };

  const getBalanceBsc = () => {
    const transationThisWeek = bscTransationsResult.filter((e: any) => {
      return e.timeStamp * 1000 > thisWeek && e.value > 0;
    });
    const getSalesBalanceThisWeek = transationThisWeek.reduce(
      (acc, res: any) => {
        return acc + res.value * 1;
      },
      0
    );
    salesThisWeekSum += Math.floor(
      (getSalesBalanceThisWeek / 10 ** 18) * bscTokenRate
    );
    const transationLastWeek = bscTransationsResult.filter((e: any) => {
      return (
        e.timeStamp * 1000 > lastWeek &&
        e.timeStamp * 1000 < thisWeek &&
        e.value > 0
      );
    });
    const getSalesBalanceLastWeek = transationLastWeek.reduce(
      (acc, res: any) => {
        return acc + res.value * 1;
      },
      0
    );
    salesLastWeekSum += Math.floor(
      (getSalesBalanceLastWeek / 10 ** 18) * bscTokenRate
    );
  };

  const getBalancePolygon = () => {
    const transationThisWeek = polygonTransationsResult.filter((e: any) => {
      return e.timeStamp * 1000 > thisWeek && e.value > 0;
    });
    const getSalesBalanceThisWeek = transationThisWeek.reduce(
      (acc, res: any) => {
        return acc + res.value * 1;
      },
      0
    );
    salesLastWeekSum += Math.floor(
      (getSalesBalanceThisWeek / 10 ** 18) * polygonTokenRate
    );
    const transationLastWeek = polygonTransationsResult.filter((e: any) => {
      return (
        e.timeStamp * 1000 > lastWeek &&
        e.timeStamp * 1000 < thisWeek &&
        e.value > 0
      );
    });
    const getSalesBalanceLastWeek = transationLastWeek.reduce(
      (acc, res: any) => {
        return acc + res.value * 1;
      },
      0
    );
    salesLastWeekSum += Math.floor(
      (getSalesBalanceLastWeek / 10 ** 18) * bscTokenRate
    );
  };

  useEffect(() => {
    getBalanceEth();
    getBalanceBsc();
    getBalancePolygon();

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
