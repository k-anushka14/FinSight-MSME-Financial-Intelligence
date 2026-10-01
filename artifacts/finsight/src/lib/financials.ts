import type {
  BusinessBootstrap,
  Payable,
  Receivable,
  RecurringExpense,
  Transaction,
} from "@workspace/api-client-react";

export const categoryColors = [
  "#7c5cff",
  "#22d3ee",
  "#34d399",
  "#fb7185",
  "#fbbf24",
  "#a78bfa",
];

export const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.max(0, n))}`;

export const compact = (n: number) =>
  Math.abs(n) >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : inr(n);

const monthKey = (date: string) => date.slice(0, 7); // YYYY-MM

const monthDisplay = (key: string) =>
  new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" }).format(
    new Date(`${key}-01T00:00:00`),
  );

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / 86400000);

const isSettled = (status: string) =>
  /paid|cleared|collected|closed/i.test(status);

function normalizeMonthly(amount: number, frequency: string) {
  const f = frequency.toLowerCase();
  if (f.includes("week")) return amount * 4.33;
  if (f.includes("quarter")) return amount / 3;
  if (f.includes("year") || f.includes("annual")) return amount / 12;
  return amount; // monthly default
}

interface MonthBucket {
  key: string;
  month: string;
  revenue: number;
  expenses: number;
  cash: number;
  categories: Map<string, number>;
}

export interface CategoryAnomaly {
  category: string;
  currentAmount: number;
  averageAmount: number;
  changePct: number;
  message: string;
}

export interface HealthFactor {
  key: string;
  label: string;
  score: number;
}

export interface MonthChange {
  label: string;
  current: number;
  previous: number;
  deltaPct: number | null;
  direction: "up" | "down" | "flat";
}

export interface ActionItem {
  id: string;
  kind: "anomaly" | "collections" | "payables" | "budget" | "baseline";
  title: string;
  text: string;
  tone: "amber" | "blue" | "red" | "green";
}

export function calculateFinancials(data?: BusinessBootstrap) {
  const transactions: Transaction[] = data?.transactions ?? [];
  const receivablesList: Receivable[] = data?.receivables ?? [];
  const payablesList: Payable[] = data?.payables ?? [];
  const recurringList: RecurringExpense[] = data?.recurringExpenses ?? [];
  const budgetsList = data?.budgets ?? [];

  const expenses = transactions.filter((item) => item.type === "expense");
  const revenueEntries = transactions.filter((item) => item.type === "revenue");
  const revenue = revenueEntries.reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
  const receivables = receivablesList.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const payables = payablesList.reduce((sum, item) => sum + item.amount, 0);

  const categories = Array.from(
    expenses.reduce((map, item) => {
      map.set(item.category, (map.get(item.category) ?? 0) + item.amount);
      return map;
    }, new Map<string, number>()),
  )
    .map(([name, value], index) => ({
      name,
      value,
      color: categoryColors[index % categoryColors.length],
    }))
    .sort((a, b) => b.value - a.value);

  const vendorSpend = Array.from(
    expenses.reduce((map, item) => {
      if (item.vendor)
        map.set(item.vendor, (map.get(item.vendor) ?? 0) + item.amount);
      return map;
    }, new Map<string, number>()),
  )
    .map(([name, spend]) => ({ name, spend }))
    .sort((a, b) => b.spend - a.spend);

  // --- Month-by-month buckets (used for the trend chart, anomaly detection, and What Changed) ---
  const bucketMap = new Map<string, MonthBucket>();
  transactions.forEach((item) => {
    const key = monthKey(item.date);
    const bucket = bucketMap.get(key) ?? {
      key,
      month: monthDisplay(key),
      revenue: 0,
      expenses: 0,
      cash: 0,
      categories: new Map<string, number>(),
    };
    if (item.type === "revenue") {
      bucket.revenue += item.amount;
    } else {
      bucket.expenses += item.amount;
      bucket.categories.set(
        item.category,
        (bucket.categories.get(item.category) ?? 0) + item.amount,
      );
    }
    bucket.cash = bucket.revenue - bucket.expenses;
    bucketMap.set(key, bucket);
  });
  const buckets = Array.from(bucketMap.values()).sort((a, b) =>
    a.key.localeCompare(b.key),
  );
  const monthly = buckets
    .slice(-12)
    .map(({ key, month, revenue: r, expenses: e, cash }) => ({
      key,
      month,
      revenue: r,
      expenses: e,
      cash,
    }));

  const netCashFlow = revenue - expenseTotal;
  const currentCash = (data?.business.openingCash ?? 0) + netCashFlow;
  const populated = transactions.length > 0;

  // --- Category anomaly detection: current month vs the average of prior months ---
  const currentBucket = buckets[buckets.length - 1];
  const priorBuckets = buckets.slice(0, -1);
  const anomalies: CategoryAnomaly[] = [];
  if (currentBucket && priorBuckets.length > 0) {
    currentBucket.categories.forEach((currentAmount, category) => {
      const priorTotal = priorBuckets.reduce(
        (sum, b) => sum + (b.categories.get(category) ?? 0),
        0,
      );
      const averageAmount = priorTotal / priorBuckets.length;
      if (averageAmount <= 0) return;
      const changePct = ((currentAmount - averageAmount) / averageAmount) * 100;
      if (changePct >= 15) {
        anomalies.push({
          category,
          currentAmount,
          averageAmount,
          changePct,
          message: `${category} spending increased ${Math.round(changePct)}% compared with the recent average.`,
        });
      }
    });
  }
  anomalies.sort((a, b) => b.changePct - a.changePct);

  // --- What changed: current month vs previous month ---
  const previousBucket = buckets[buckets.length - 2];
  const monthChange = (
    label: string,
    current: number,
    previous: number,
  ): MonthChange => {
    const deltaPct =
      previous > 0
        ? ((current - previous) / previous) * 100
        : current > 0
          ? null
          : 0;
    const direction =
      current === previous ? "flat" : current > previous ? "up" : "down";
    return { label, current, previous, deltaPct, direction };
  };
  const monthOverMonth = currentBucket
    ? {
        hasComparison: Boolean(previousBucket),
        currentLabel: currentBucket.month,
        previousLabel: previousBucket?.month ?? null,
        changes: [
          monthChange(
            "Revenue",
            currentBucket.revenue,
            previousBucket?.revenue ?? 0,
          ),
          monthChange(
            "Expenses",
            currentBucket.expenses,
            previousBucket?.expenses ?? 0,
          ),
          monthChange(
            "Net cash flow",
            currentBucket.cash,
            previousBucket?.cash ?? 0,
          ),
        ],
        categoryChanges: Array.from(currentBucket.categories.entries())
          .map(([category, current]) => {
            const previous = previousBucket?.categories.get(category) ?? 0;
            return { category, ...monthChange(category, current, previous) };
          })
          .sort(
            (a, b) =>
              Math.abs(b.current - b.previous) -
              Math.abs(a.current - a.previous),
          )
          .slice(0, 4),
      }
    : null;

  // --- Financial health score: cash flow, liquidity, expense control, receivables, payables, budget performance ---
  const overdueReceivableAmount = receivablesList
    .filter((item) => /overdue/i.test(item.status))
    .reduce((sum, item) => sum + item.amount, 0);

  const cashFlowScore =
    revenue > 0
      ? clamp(50 + (netCashFlow / revenue) * 100)
      : populated
        ? 30
        : 0;
  const liquidityScore = populated
    ? clamp((currentCash / Math.max(payables, 1)) * 50)
    : 0;
  const expenseControlScore =
    revenue > 0
      ? clamp(100 - (expenseTotal / revenue) * 100)
      : populated
        ? 40
        : 0;
  const receivablesScore = !populated
    ? 0
    : receivables === 0
      ? 100
      : clamp(100 - (overdueReceivableAmount / receivables) * 100);
  const payablesScore = populated
    ? clamp(100 - (payables / Math.max(currentCash, 1)) * 60)
    : 0;
  const budgetPerformanceScore = (() => {
    if (!populated) return 0;
    if (budgetsList.length === 0) return 70;
    const ratios = budgetsList.map((budget) => {
      const actual = expenses
        .filter((item) => item.category === budget.category)
        .reduce((sum, item) => sum + item.amount, 0);
      const ratio = budget.amount > 0 ? actual / budget.amount : 1;
      return clamp(100 - Math.max(0, ratio - 1) * 200);
    });
    return Math.round(ratios.reduce((a, b) => a + b, 0) / ratios.length);
  })();

  const healthBreakdown: HealthFactor[] = [
    { key: "cashFlow", label: "Cash flow", score: Math.round(cashFlowScore) },
    { key: "liquidity", label: "Liquidity", score: Math.round(liquidityScore) },
    {
      key: "expenseControl",
      label: "Expense control",
      score: Math.round(expenseControlScore),
    },
    {
      key: "receivables",
      label: "Receivables",
      score: Math.round(receivablesScore),
    },
    { key: "payables", label: "Payables", score: Math.round(payablesScore) },
    {
      key: "budgetPerformance",
      label: "Budget performance",
      score: Math.round(budgetPerformanceScore),
    },
  ];
  const score = populated
    ? Math.round(
        healthBreakdown.reduce((sum, f) => sum + f.score, 0) /
          healthBreakdown.length,
      )
    : 0;

  // --- Budget overspend detection (used by the Action Center) ---
  const budgetOverspend = budgetsList
    .map((budget) => {
      const actual = expenses
        .filter((item) => item.category === budget.category)
        .reduce((sum, item) => sum + item.amount, 0);
      const overPct =
        budget.amount > 0
          ? ((actual - budget.amount) / budget.amount) * 100
          : 0;
      return {
        category: budget.category,
        actual,
        budget: budget.amount,
        overPct,
      };
    })
    .filter((entry) => entry.overPct > 5)
    .sort((a, b) => b.overPct - a.overPct);

  // --- 30/60/90-day cash-flow forecast, using recorded revenue/expenses, recurring expenses,
  //     receivables due in the window, and payables due in the window ---
  const asOf = transactions.length
    ? transactions.reduce(
        (latest, item) => (item.date > latest ? item.date : latest),
        transactions[0].date,
      )
    : new Date().toISOString().slice(0, 10);
  const recentBuckets = buckets.slice(-3);
  const avgMonthlyRevenue = recentBuckets.length
    ? recentBuckets.reduce((sum, b) => sum + b.revenue, 0) /
      recentBuckets.length
    : 0;
  const avgMonthlyExpense = recentBuckets.length
    ? recentBuckets.reduce((sum, b) => sum + b.expenses, 0) /
      recentBuckets.length
    : 0;
  const recurringMonthly = recurringList.reduce(
    (sum, item) => sum + normalizeMonthly(item.amount, item.frequency),
    0,
  );
  const dueWithin = (
    records: { amount: number; dueDate: string; status: string }[],
    days: number,
  ) =>
    records
      .filter(
        (item) =>
          !isSettled(item.status) && daysBetween(asOf, item.dueDate) <= days,
      )
      .reduce((sum, item) => sum + item.amount, 0);

  const forecast = [30, 60, 90].map((days) => {
    const months = days / 30;
    const inflow =
      avgMonthlyRevenue * months + dueWithin(receivablesList, days);
    const outflow =
      avgMonthlyExpense * months +
      recurringMonthly * months +
      dueWithin(payablesList, days);
    return {
      days,
      label: `${days} days`,
      inflow,
      outflow,
      balance: currentCash + inflow - outflow,
    };
  });

  // --- Action Center: concrete, data-grounded recommendations ---
  const actions: ActionItem[] = [];
  if (overdueReceivableAmount > 0) {
    actions.push({
      id: "collect-overdue",
      kind: "collections",
      title: `Collect overdue ${compact(overdueReceivableAmount)} receivables`,
      text: `${receivablesList.filter((item) => /overdue/i.test(item.status)).length} invoice(s) are past due. Following up now protects your cash position.`,
      tone: "red",
    });
  }
  anomalies.slice(0, 2).forEach((anomaly, index) => {
    actions.push({
      id: `anomaly-${index}`,
      kind: "anomaly",
      title: `Review increased ${anomaly.category.toLowerCase()} costs`,
      text: anomaly.message,
      tone: "amber",
    });
  });
  const payablesDueSoon = payablesList.filter(
    (item) =>
      !isSettled(item.status) &&
      daysBetween(asOf, item.dueDate) <= 14 &&
      daysBetween(asOf, item.dueDate) >= 0,
  );
  if (payablesDueSoon.length > 0) {
    actions.push({
      id: "payables-due",
      kind: "payables",
      title: "Prepare for upcoming supplier payments",
      text: `${compact(payablesDueSoon.reduce((sum, item) => sum + item.amount, 0))} across ${payablesDueSoon.length} payable(s) is due within 14 days.`,
      tone: "blue",
    });
  }
  budgetOverspend.slice(0, 2).forEach((entry, index) => {
    actions.push({
      id: `budget-${index}`,
      kind: "budget",
      title: `Review ${entry.category.toLowerCase()} budget overspend`,
      text: `${entry.category} spend is ${compact(entry.actual)}, ${Math.round(entry.overPct)}% over the ${compact(entry.budget)} budget.`,
      tone: "amber",
    });
  });
  if (populated && actions.length === 0) {
    actions.push({
      id: "baseline",
      kind: "baseline",
      title:
        netCashFlow >= 0
          ? "Net cash flow is positive"
          : "Expenses currently exceed revenue",
      text: "No urgent signals right now. Keep adding transactions to sharpen these recommendations.",
      tone: netCashFlow >= 0 ? "green" : "amber",
    });
  }

  return {
    transactions,
    expenses,
    revenueEntries,
    revenue,
    expenseTotal,
    netCashFlow,
    currentCash,
    receivables,
    payables,
    overdueReceivableAmount,
    categories,
    vendorSpend,
    monthly,
    forecast,
    recurringMonthly,
    score,
    healthBreakdown,
    anomalies,
    monthOverMonth,
    budgetOverspend,
    actions,
    populated,
  };
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function transactionToForm(transaction: Transaction) {
  return {
    description: transaction.description,
    amount: String(transaction.amount),
    category: transaction.category,
    vendor: transaction.vendor ?? "",
    date: transaction.date,
    status: transaction.status,
  };
}
