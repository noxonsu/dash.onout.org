export const stringToHex = (str: string) => {
  return Array.from(str)
    .map((c) =>
      c.charCodeAt(0) < 128
        ? c.charCodeAt(0).toString(16)
        : encodeURIComponent(c).replace(/\%/g, "").toLowerCase()
    )
    .join("");
};

export const stringFromHex = (hex: string) => {
  return decodeURIComponent("%" + hex.match(/.{1,2}/g)?.join("%"));
};
