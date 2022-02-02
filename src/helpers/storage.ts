import { bufferToHex } from "ethereumjs-util";
import { encrypt as encryptUtil } from "@metamask/eth-sig-util";

export const encrypt = (publicKey: string, data: string) => {
  const encrypted = bufferToHex(
    Buffer.from(
      JSON.stringify(
        encryptUtil({
          publicKey,
          data,
          version: "x25519-xsalsa20-poly1305",
        })
      ),
      "utf8"
    )
  );

  return encrypted;
};

export const decrypt = async (account: string, data: string) => {
  const decrypted = await window.ethereum.request({
    method: "eth_decrypt",
    params: [data, account],
  });

  return decrypted;
};
