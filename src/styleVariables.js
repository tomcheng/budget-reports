import tinyColor from "tinycolor2";

export const primaryColor = "#4399ff";
export const positiveColor = "#2cbc2f";
export const plotBandColor = "#f2f2f2";
export const negativeColor = "red";
export const selectedPlotBandColor = tinyColor(primaryColor)
  .lighten(31)
  .desaturate()
  .toHexString();
export const lighterPrimaryColor = tinyColor(primaryColor)
  .lighten(5)
  .desaturate()
  .toHexString();
export const lightPrimaryColor = tinyColor(primaryColor)
  .lighten(23)
  .desaturate()
  .toHexString();
export const negativeChartColor = tinyColor(negativeColor)
  .lighten(30)
  .desaturate(60)
  .toHexString();

export const iconWidth = 60;
