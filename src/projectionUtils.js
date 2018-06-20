import moment from "moment";
import add from "lodash/fp/add";
import compose from "lodash/fp/compose";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import includes from "lodash/fp/includes";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import map from "lodash/fp/map";
import matches from "lodash/fp/matches";
import multiply from "lodash/fp/multiply";
import prop from "lodash/fp/prop";
import reduce from "lodash/fp/reduce";
import reject from "lodash/fp/reject";
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

export const getReturnOnInvestments = ({
  accounts,
  payees,
  transactions: allTransactions
}) => {
  const investmentAccountIds = compose([
    map("id"),
    filter(matches({ type: "investmentAccount" }))
  ])(accounts);

  const transactionsByMonth = compose([
    groupBy(tr => tr.date.slice(0, 7)),
    reject(t => includes(t.transferAccountId)(investmentAccountIds)), // remove transfers between investment accounts
    filter(t => includes(t.accountId)(investmentAccountIds))
  ])(allTransactions);

  let startForMonth = 0;
  const returnRates = [];

  const months = compose([sortBy(identity), keys])(transactionsByMonth);
  map(month => transactionsByMonth[month])(months).forEach(trs => {
    const contributions = compose([
      sumBy("amount"),
      filter(prop("transferAccountId"))
    ])(trs);
    const gains = reject(prop("transferAccountId"))(trs);
    const returns = sumBy("amount")(gains);

    if (startForMonth && gains.length) {
      returnRates.push(returns / (startForMonth + 0.5 * contributions));
    }

    startForMonth += returns + contributions;
  });

  const totalReturn = compose([reduce(multiply, 1), map(add(1))])(returnRates);
  const numMonths = returnRates.length;

  return totalReturn ** (12 / numMonths) - 1;
};

export const getAverageContribution = ({
  accounts,
  payees,
  transactions: allTransactions
}) => {
  const investmentAccountIds = compose([
    map("id"),
    filter(matches({ type: "investmentAccount" }))
  ])(accounts);

  const contributions = compose([
    filter(
      ({ transferAccountId }) =>
        transferAccountId && !includes(transferAccountId)(investmentAccountIds)
    ),
    filter(({ accountId }) => includes(accountId)(investmentAccountIds))
  ])(allTransactions);

  const totalContributions = sumBy("amount")(contributions);
  const months = compose([
    sortBy(identity),
    map(d => d.slice(0, 7)),
    map("date")
  ])(contributions);
  const numMonths = moment(last(months)).diff(moment(months[0]), "months") + 1;

  return totalContributions / numMonths;
};
