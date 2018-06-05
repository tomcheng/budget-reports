import tinyColor from "tinycolor2";

export const primaryColor = "#4399ff";
export const positiveColor = "#2cbc2f";
export const plotBandColor = "#f8f8f8";
export const lightPrimaryColor = tinyColor(primaryColor)
  .lighten(25)
  .desaturate()
  .toHexString();
export const negativeChartColor = tinyColor("red")
  .lighten(30)
  .desaturate(60)
  .toHexString();
