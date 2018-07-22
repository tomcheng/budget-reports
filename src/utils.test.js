import { mapKeysDeep, upsertBy, getProcessedPayees } from "./utils";
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

describe("getProcessedPayees", () => {
  it("processes payees and sorts by transactions", () => {
    const budget = {
      accountsById: {
        acc: { onBudget: true }
      },
      payeesById: {
        foo: { id: "foo" },
        bar: { id: "bar" }
      },
      transactions: [
        { payeeId: "foo", amount: -1, accountId: "acc" },
        { payeeId: "foo", amount: -1, accountId: "acc" },
        { payeeId: "bar", amount: -10, accountId: "acc" }
      ]
    };
    const payees = getProcessedPayees({ budget, sort: "transactions" });

    expect(payees).toHaveLength(2);
    expect(payees.map(p => p.id)).toEqual(["foo", "bar"]);
    expect(payees[0].transactions).toEqual(2);
    expect(payees[1].transactions).toEqual(1);
  });

  it("ignores off budget transactions", () => {
    const budget = {
      accountsById: {
        off: { onBudget: false }
      },
      payeesById: {
        foo: { id: "foo" }
      },
      transactions: [{ payeeId: "foo", amount: -1, accountId: "off" }]
    };
    const payees = getProcessedPayees({ budget, sort: "name" });

    expect(payees).toHaveLength(0);
  });

  it("ignores transfers to on budget accounts", () => {
    const budget = {
      accountsById: {
        acc1: { onBudget: true },
        acc2: { onBudget: true }
      },
      payeesById: {
        foo: { id: "foo" }
      },
      transactions: [{ payeeId: "foo", amount: -1, accountId: "acc1", transferAccountId: "acc2" }]
    };
    const payees = getProcessedPayees({ budget, sort: "name" });

    expect(payees).toHaveLength(0);
  });

  it("ignores starting balances", () => {
    const budget = {
      accountsById: {
        acc: { onBudget: true },
      },
      payeesById: {
        foo: { id: "foo", name: "Starting Balance" }
      },
      transactions: [{ payeeId: "foo", amount: 100, accountId: "acc" }]
    };
    const payees = getProcessedPayees({ budget, sort: "name" });

    expect(payees).toHaveLength(0);
  });
});
