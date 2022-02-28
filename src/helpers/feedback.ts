import axios from "axios";

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
      url: `https://noxon.wpmix.net/counter.php?msg=${encodeURI(
        textToSend
      )}&todevs=1`,
      method: "post",
    }).catch((e) => console.error(e));
  } catch (error) {
    console.error(error);
  }
};
