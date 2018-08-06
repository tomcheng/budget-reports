import { addCommas } from "./Amount";

describe("adding commas", () => {
  it("adds commas", () => {
    expect(addCommas("1000.00")).toEqual("1,000.00");
    expect(addCommas("100.11")).toEqual("100.11");
    expect(addCommas("5")).toEqual("5");
    expect(addCommas("123456789.10")).toEqual("123,456,789.10");
  });
});