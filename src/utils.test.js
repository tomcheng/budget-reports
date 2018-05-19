import { mapKeysDeep } from "./utils";
import camelCase from "lodash/camelCase";

describe("mapKeysDeep", () => {
  it("maps keys of an object", () => {
    const obj = { foo_bar: 1 };
    const result = mapKeysDeep(obj, (val, key) => camelCase(key));
    const expected = { fooBar: 1 };

    expect(result).toEqual(expected);
  });

  it("maps keys of a nested object", () => {
    const obj = { foo_bar: { baz_qux: 1 } };
    const result = mapKeysDeep(obj, (val, key) => camelCase(key));
    const expected = { fooBar: { bazQux: 1 } };

    expect(result).toEqual(expected);
  });

  it("skips mapping keys of array on top level", () => {
    const obj = [{ foo_bar: { baz_qux: 1 } }];
    const result = mapKeysDeep(obj, (val, key) => camelCase(key));
    const expected = [{ fooBar: { bazQux: 1 } }];

    expect(result).toEqual(expected);
  });

  it("skips mapping keys of array on second level", () => {
    const obj = { foo_bar: [{ baz_qux: 1 }] };
    const result = mapKeysDeep(obj, (val, key) => camelCase(key));
    const expected = { fooBar: [{ bazQux: 1 }] };

    expect(result).toEqual(expected);
  });
});
