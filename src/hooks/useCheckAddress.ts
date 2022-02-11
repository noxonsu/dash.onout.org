import { useState, useEffect } from "react";
import axios from "../helpers/axios";

export const useCheckAddress = (address: string) => {
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(undefined);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {

    if (!address) {
        return setIsSubscribed(undefined);
    }
    setErrors([]);

    const _checkAddress = async () => {
      try {
        setIsCheckLoading(true);

        const _isSubscribed = await checkAddress(address);
        setIsSubscribed(_isSubscribed);
      } catch (err) {
        console.error(`Error: Can't check subscription. Description: ${err}`);
        setErrors(["Can't check subscription. Please, update page or try later."])
      } finally {
        setIsCheckLoading(false);
      }
    };
    _checkAddress();
  }, [address]);

  return {
    isSubscribed,
    isCheckLoading,
    checkerErrors: errors,
  };
};

export const checkAddress = async (address: string) => {
  const relult = await axios.get('/check', {
    params: {
      address: address
    }
  });

  return relult?.data?.hasAccount;
};
