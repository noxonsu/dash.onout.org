import { useState, useEffect } from "react";
import axios from "../helpers/axios";

export const useCheckAddress = (address: string) => {
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(undefined);

  useEffect(() => {

    if (!address) {
        return setIsSubscribed(undefined);
    }

    const _checkAddress = async () => {
      try {
        setIsCheckLoading(true);

        const _isSubscribed = await checkAddress(address);
        setIsSubscribed(_isSubscribed);
      } catch (err) {
        console.error(`Error: Can't fetch space list. Description: ${err}`);
      } finally {
        setIsCheckLoading(false);
      }
    };
    _checkAddress();
  }, [address]);

  return {
    isSubscribed,
    isCheckLoading,
  };
};

export const checkAddress = async (address: string) => {
  const relult = await axios.get('/check', {
    params: {
      address: address
    }
  });

  return relult?.data?.response?.result?.length > 0;
};
