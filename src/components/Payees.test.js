import { getPayeesWithMetadata } from "./Payees";

describe("getProcessedPayees", () => {
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
    const payees = getPayeesWithMetadata(budget);

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
      transactions: [
        {
          payeeId: "foo",
          amount: -1,
          accountId: "acc1",
          transferAccountId: "acc2"
        }
      ]
    };
    const payees = getPayeesWithMetadata(budget);

    expect(payees).toHaveLength(0);
  });

  it("ignores starting balances", () => {
    const budget = {
      accountsById: {
        acc: { onBudget: true }
      },
      payeesById: {
        foo: { id: "foo", name: "Starting Balance" }
      },
      transactions: [{ payeeId: "foo", amount: 100, accountId: "acc" }]
    };
    const payees = getPayeesWithMetadata(budget);

    expect(payees).toHaveLength(0);
  });
});
