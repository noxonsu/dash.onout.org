import { useState, useEffect } from "react";
import axios from "../helpers/axios";
import { getLocal, saveLocal } from "../helpers/storage";

const SUBSCRIPTION_POSTFIX_KEY = "::subscriptionCheckingDate";
const ONE_DAY = 86400000; // in milliseconds

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

        saveLocal({ key: `${address}${SUBSCRIPTION_POSTFIX_KEY}`, value: (Date.now() + ONE_DAY).toString() });
      } catch (err) {
        console.error(`Error: Can't check subscription. Description: ${err}`);
        setErrors(["Can't check subscription. Please, update page or try later."])
      } finally {
        setIsCheckLoading(false);
      }
    };

    checkSubscriptionSavedAndActive(address)
      ? setIsSubscribed(true)
      : _checkAddress();
  }, [address]);

  return {
    isSubscribed,
    isCheckLoading,
    checkerErrors: errors,
  };
};

export const checkSubscriptionSavedAndActive = (address: string) => {
  const subscriptionCheckingDate = getLocal(`${address}${SUBSCRIPTION_POSTFIX_KEY}`);

  if (!subscriptionCheckingDate) return false;

  return parseInt(subscriptionCheckingDate) > Date.now();

};

export const checkAddress = async (address: string) => {
  const relult = await axios.get('/check', {
    params: {
      address: address
    }
  });

  return relult?.data?.hasAccount;
};
