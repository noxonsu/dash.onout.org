import axios from "axios";
import { FEEDBACK_URL } from "../constants";

const MARKS = {
  danger: "🔴",
  warning: "🔥",
  attention: "💥",
  unimportant: "💤",
};

export const sendMessage = ({ msg }: { msg: string }) => {
  let host = window.location.hostname || document.location.host;

  const textToSend = [
    host === "localhost" ? `${MARKS.unimportant} ` : "",
    `[${host}] `,
    msg,
  ].join("");

  try {
    axios({
      url: `${FEEDBACK_URL}?msg=${encodeURI(textToSend)}&todevs=1`,
      method: "post",
    }).catch((e) => console.error(e));
  } catch (error) {
    console.error(error);
  }
};
