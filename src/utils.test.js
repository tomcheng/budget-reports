import { mapKeysDeep, upsertBy } from "./utils";
import camelCase from "lodash/fp/camelCase";

describe("mapKeysDeep", () => {
  it("maps keys of an object", () => {
    const obj = { foo_bar: 1 };
    const result = mapKeysDeep((val, key) => camelCase(key))(obj);

    expect(result).toEqual({ fooBar: 1 });
  });

  it("maps keys of a nested object", () => {
    const obj = { foo_bar: { baz_qux: 1 } };
    const result = mapKeysDeep((val, key) => camelCase(key))(obj);

    expect(result).toEqual({ fooBar: { bazQux: 1 } });
  });

  it("skips mapping keys of array on top level", () => {
    const obj = [{ foo_bar: { baz_qux: 1 } }];
    const result = mapKeysDeep((val, key) => camelCase(key))(obj);

    expect(result).toEqual([{ fooBar: { bazQux: 1 } }]);
  });

  it("skips mapping keys of array on second level", () => {
    const obj = { foo_bar: [{ baz_qux: 1 }] };
    const result = mapKeysDeep((val, key) => camelCase(key))(obj);

    expect(result).toEqual({ fooBar: [{ bazQux: 1 }] });
  });
});

describe("upsertBy", () => {
  it("modifies an existing object", () => {
    const arr = [{ id: 1, val: "foo" }];
    const obj = { id: 1, val: "bar" };
    const result = upsertBy(arr, "id", obj);

    expect(result).toEqual([{ id: 1, val: "bar" }]);
  });

  it("adds to array if exiting object not found", () => {
    const arr = [{ id: 1, val: "foo" }];
    const obj = { id: 2, val: "bar" };
    const result = upsertBy(arr, "id", obj);

    expect(result).toEqual([{ id: 1, val: "foo" }, { id: 2, val: "bar" }]);
  });
});
