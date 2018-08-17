import { upsertBy } from "./dataUtils";

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
