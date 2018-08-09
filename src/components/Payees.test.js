import { getPayeesWithMetadata } from "./Payees";

describe("getProcessedPayees", () => {
  it("ignores off budget transactions", () => {
    const budget = {
      accountsById: {
        off: { on_budget: false }
      },
      payeesById: {
        foo: { id: "foo" }
      },
      transactions: [{ payeeId: "foo", amount: -1, account_id: "off" }]
    };
    const payees = getPayeesWithMetadata(budget);

    expect(payees).toHaveLength(0);
  });

  it("ignores transfers to on budget accounts", () => {
    const budget = {
      accountsById: {
        acc1: { on_budget: true },
        acc2: { on_budget: true }
      },
      payeesById: {
        foo: { id: "foo" }
      },
      transactions: [
        {
          payeeId: "foo",
          amount: -1,
          account_id: "acc1",
          transfer_account_id: "acc2"
        }
      ]
    };
    const payees = getPayeesWithMetadata(budget);

    expect(payees).toHaveLength(0);
  });

  it("ignores starting balances", () => {
    const budget = {
      accountsById: {
        acc: { on_budget: true }
      },
      payeesById: {
        foo: { id: "foo", name: "Starting Balance" }
      },
      transactions: [{ payeeId: "foo", amount: 100, account_id: "acc" }]
    };
    const payees = getPayeesWithMetadata(budget);

    expect(payees).toHaveLength(0);
  });
});
