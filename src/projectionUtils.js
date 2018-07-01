import moment from "moment";
import add from "lodash/fp/add";
import compose from "lodash/fp/compose";
import concat from "lodash/fp/concat";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import groupBy from "lodash/fp/groupBy";
import head from "lodash/fp/head";
import identity from "lodash/fp/identity";
import includes from "lodash/fp/includes";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import map from "lodash/fp/map";
import matches from "lodash/fp/matches";
import multiply from "lodash/fp/multiply";
import prop from "lodash/fp/prop";
import range from "lodash/fp/range";
import reduce from "lodash/fp/reduce";
import reject from "lodash/fp/reject";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import takeWhile from "lodash/fp/takeWhile";
import takeRightWhile from "lodash/fp/takeRightWhile";
import uniq from "lodash/fp/uniq";
import { getOutliersBy, getMonth } from "./utils";

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

  const projection = map(n => (1 + r) ** n * P - ((1 + r) ** n - 1) / r * c)(
    range(1, N)
  );

  return {
    rate,
    mortgagePayment: c,
    paymentsLeft,
    principalProjection: projection
  };
};

export const getCurrentInvestments = ({ accounts, transactions }) => {
  const investmentAccountIds = compose([
    map("id"),
    filter(matches({ type: "investmentAccount" }))
  ])(accounts);

  return compose([
    sumBy("amount"),
    filter(({ accountId }) => includes(accountId)(investmentAccountIds))
  ])(transactions);
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

  const months = compose([
    sortBy(identity),
    uniq,
    map(d => d.slice(0, 7)),
    map("date")
  ])(contributions);

  const outliers = getOutliersBy(month =>
    compose([
      sumBy("amount"),
      filter(({ date }) => date.slice(0, 7) === month)
    ])(contributions)
  )(months);

  const totalContributions = compose([
    sumBy("amount"),
    reject(({ date }) => includes(date.slice(0, 7))(outliers))
  ])(contributions);
  const numMonths =
    moment(last(months)).diff(moment(head(months)), "months") +
    1 -
    outliers.length;

  return totalContributions / numMonths;
};

export const getAverageExpensesWithoutMortgage = ({
  transactions,
  accounts,
  payees,
  categoriesById,
  categoryGroupsById
}) => {
  const startingBalanceId = compose([
    prop("id"),
    find(matches({ name: "Starting Balance" }))
  ])(payees);
  const months = compose([sortBy(identity), uniq, map(getMonth)])(transactions);

  const mortgageAccountIds = compose([
    map(prop("id")),
    filter(matches({ type: "mortgage" }))
  ])(accounts);

  const investmentAccountIds = compose([
    map(prop("id")),
    filter(matches({ type: "investmentAccount" }))
  ])(accounts);

  const totalExpenses = compose([
    sumBy("amount"),
    reject(
      tr =>
        tr.amount > 0 &&
        !tr.transferAccountId &&
        (!tr.categoryId ||
          !categoryGroupsById[categoriesById[tr.categoryId].categoryGroupId])
    ),
    reject(tr =>
      includes(tr.transferAccountId)(
        concat(mortgageAccountIds, investmentAccountIds)
      )
    ),
    reject(tr =>
      includes(tr.accountId)(concat(mortgageAccountIds, investmentAccountIds))
    ),
    reject(tr => includes(getMonth(tr))([head(months), last(months)])),
    reject(matches({ payeeId: startingBalanceId }))
  ])(transactions);

  return -totalExpenses / (months.length - 2);
};

export const getProjection = ({
  numMonths,
  returnOnInvestments,
  averageContribution,
  currentInvestments
}) => {
  const monthlyRate = (1 + returnOnInvestments) ** (1 / 12) - 1;
  let amount = currentInvestments;
  let projection = [];

  do {
    projection.push(amount);
    amount +=
      averageContribution + (amount + 0.5 * averageContribution) * monthlyRate;
  } while (projection.length < numMonths);

  return projection;
};

export const getProjectionWithRetirement = ({
  numMonths,
  returnOnInvestments,
  averageContribution,
  currentInvestments,
  monthsBeforeRetirement,
  monthlyExpenses,
  retirementReturns,
  retirementTaxRate,
  remainingMortgagePayments,
  mortgagePayment
}) => {
  const monthlyRate = (1 + returnOnInvestments) ** (1 / 12) - 1;
  const monthlyRetirementReturn = (1 + retirementReturns) ** (1 / 12) - 1;
  let amount = currentInvestments;
  let projection = [];

  do {
    projection.push(amount);
    if (projection.length < monthsBeforeRetirement) {
      amount +=
        averageContribution +
        (amount + 0.5 * averageContribution) * monthlyRate;
    } else {
      amount += amount * monthlyRetirementReturn * (1 - retirementTaxRate) - monthlyExpenses;
      if (projection.length < remainingMortgagePayments) {
        amount -= mortgagePayment;
      }
    }
  } while (projection.length < numMonths);

  return projection;
};
