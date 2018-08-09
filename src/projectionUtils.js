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
import { getOutliersBy, getTransactionMonth } from "./utils";

export const getMortgageRate = (
  { accounts, transactions: allTransactions },
  mortgageAccounts
) => {
  const mortgageAccount = find(account => mortgageAccounts[account.id])(
    accounts
  );

  if (!mortgageAccount) {
    return null;
  }

  const transactions = compose([
    sortBy("date"),
    filter(matches({ account_id: mortgageAccount.id }))
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
  const c = compose([prop("amount"), find(prop("transfer_account_id"))])(
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

export const getCurrentInvestments = (
  { accounts, transactions },
  investmentAccounts
) => {
  const investmentAccountIds = compose([
    filter(id => investmentAccounts[id]),
    map("id")
  ])(accounts);

  return compose([
    sumBy("amount"),
    filter(({ account_id: accountId }) => includes(accountId)(investmentAccountIds))
  ])(transactions);
};

export const getReturnOnInvestments = (
  { accounts, payees, transactions: allTransactions },
  investmentAccounts
) => {
  const investmentAccountIds = compose([
    filter(id => investmentAccounts[id]),
    map("id")
  ])(accounts);

  const transactionsByMonth = compose([
    groupBy(tr => tr.date.slice(0, 7)),
    reject(t => includes(t.transfer_account_id)(investmentAccountIds)), // remove transfers between investment accounts
    filter(t => includes(t.account_id)(investmentAccountIds))
  ])(allTransactions);

  let startForMonth = 0;
  const returnRates = [];

  const months = compose([sortBy(identity), keys])(transactionsByMonth);
  map(month => transactionsByMonth[month])(months).forEach(trs => {
    const contributions = compose([
      sumBy("amount"),
      filter(prop("transfer_account_id"))
    ])(trs);
    const gains = reject(prop("transfer_account_id"))(trs);
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

export const getAverageContribution = (
  { accounts, transactions: allTransactions },
  investmentAccounts
) => {
  const investmentAccountIds = compose([
    filter(id => investmentAccounts[id]),
    map("id")
  ])(accounts);

  const contributions = compose([
    filter(
      ({ transfer_account_id: transferAccountId }) =>
        transferAccountId && !includes(transferAccountId)(investmentAccountIds)
    ),
    filter(({ account_id: accountId }) => includes(accountId)(investmentAccountIds))
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

export const getAverageExpensesWithoutMortgage = (
  { transactions, accounts, payees, categoriesById, categoryGroupsById },
  investmentAccounts,
  mortgageAccounts
) => {
  const startingBalanceId = compose([
    prop("id"),
    find(matches({ name: "Starting Balance" }))
  ])(payees);
  const months = compose([sortBy(identity), uniq, map(getTransactionMonth)])(transactions);

  const mortgageAccountIds = compose([
    filter(id => mortgageAccounts[id]),
    map("id")
  ])(accounts);

  const investmentAccountIds = compose([
    filter(id => investmentAccounts[id]),
    map("id")
  ])(accounts);

  const totalExpenses = compose([
    sumBy("amount"),
    reject(
      tr =>
        tr.amount > 0 &&
        !tr.transfer_account_id &&
        (!tr.category_id ||
          !categoryGroupsById[categoriesById[tr.category_id].category_group_id])
    ),
    reject(tr =>
      includes(tr.transfer_account_id)(
        concat(mortgageAccountIds, investmentAccountIds)
      )
    ),
    reject(tr =>
      includes(tr.account_id)(concat(mortgageAccountIds, investmentAccountIds))
    ),
    reject(tr => includes(getTransactionMonth(tr))([head(months), last(months)])),
    reject(matches({ payee_id: startingBalanceId }))
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
      amount +=
        amount * monthlyRetirementReturn * (1 - retirementTaxRate) -
        monthlyExpenses;
      if (projection.length < remainingMortgagePayments) {
        amount -= mortgagePayment;
      }
    }
  } while (projection.length < numMonths);

  return projection;
};
