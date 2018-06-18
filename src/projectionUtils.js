import compose from "lodash/fp/compose";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import last from "lodash/fp/last";
import matches from "lodash/fp/matches";
import prop from "lodash/fp/prop";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import takeWhile from "lodash/fp/takeWhile";
import takeRightWhile from "lodash/fp/takeRightWhile";

export const getMortgageRate = ({
  accounts,
  transactions: allTransactions
}) => {
  const mortgageAccount = find(matches({ type: "mortgage" }))(accounts);

  if (!mortgageAccount) {
    return null;
  }

  const transactions = compose([
    sortBy("date"),
    filter(matches({ accountId: mortgageAccount.id }))
  ])(allTransactions);
  const lastMonth = compose([t => t.date.slice(0, 7), last])(transactions);
  const lastMonthTransactions = takeRightWhile(
    t => t.date.slice(0, 7) === lastMonth
  )(transactions);

  const P = -compose([
    sumBy("amount"),
    takeWhile(t => t.date.slice(0, 7) !== lastMonth)
  ])(transactions);
  const P1 = P - sumBy("amount")(lastMonthTransactions);
  const c = compose([prop("amount"), find(prop("transferAccountId"))])(
    lastMonthTransactions
  );
  const r = (P1 + c) / P - 1;
  const N = -Math.log(1 - r * P / c) / Math.log(1 + r);

  const rate = r * 12;
  const paymentsLeft = N - 1;

  return { rate, paymentsLeft };
};
