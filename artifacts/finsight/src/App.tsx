import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ClerkProvider,
  Show,
  SignIn,
  SignUp,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Link,
  Redirect,
  Route,
  Router as WouterRouter,
  Switch,
  useLocation,
} from "wouter";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CloudUpload,
  Download,
  FileBarChart,
  FileCheck2,
  Filter,
  IndianRupee,
  Info,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Package,
  PieChart,
  Plus,
  ReceiptIndianRupee,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Volume2,
  WalletCards,
  X,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./lib/LanguageContext";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { FIELD_HELP, FORM_HELP, speak, speechSupported, t, type Lang } from "./lib/i18n";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getGetBusinessBootstrapQueryKey,
  customFetch,
  setAuthTokenGetter,
  useCreateBudget,
  useCreateBusiness,
  useCreateCustomer,
  useCreateInvoice,
  useCreatePayable,
  useCreateReceivable,
  useCreateRecurringExpense,
  useCreateRevenue,
  useCreateTransaction,
  useCreateVendor,
  useGetBusinessBootstrap,
  useLoadDemoBusiness,
} from "@workspace/api-client-react";
import type {
  BusinessBootstrap,
  Budget,
  Customer,
  Invoice,
  Payable,
  Receivable,
  RecurringExpense,
  Transaction,
  Vendor,
} from "@workspace/api-client-react";
import {
  calculateFinancials,
  categoryColors,
  compact,
  formatDate,
  inr,
} from "@/lib/financials";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  CountUp,
  PageTransition,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#7c5cff",
    colorForeground: "#eceaff",
    colorMutedForeground: "#8b89a8",
    colorDanger: "#fb7185",
    colorBackground: "#14142b",
    colorInput: "#1c1c3a",
    colorInputForeground: "#eceaff",
    colorNeutral: "#eceaff",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "0.8rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-2xl border border-white/10 bg-[#14142b] shadow-[0_0_40px_-10px_rgba(124,92,255,0.55)] w-[440px] max-w-full overflow-hidden",
    card: "!border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#eceaff]",
    headerSubtitle: "text-[#8b89a8]",
    socialButtonsBlockButtonText: "text-[#eceaff]",
    formFieldLabel: "text-[#eceaff]",
    footerActionLink: "text-[#22d3ee]",
    footerActionText: "text-[#8b89a8]",
    dividerText: "text-[#8b89a8]",
    identityPreviewEditButton: "text-[#22d3ee]",
    formFieldSuccessText: "text-[#34d399]",
    alertText: "text-[#fb7185]",
    logoBox: "h-12",
    logoImage: "h-10 w-10",
    socialButtonsBlockButton: "border-white/10 bg-[#14142b]",
    formButtonPrimary: "bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] text-white hover:brightness-110",
    formFieldInput: "border-white/10 bg-[#1c1c3a] text-[#eceaff]",
    footerAction: "bg-transparent",
    dividerLine: "bg-white/10",
    alert: "border-[#fb7185]/40 bg-[#fb7185]/10",
    otpCodeFieldInput: "border-white/10 bg-[#1c1c3a] text-[#eceaff]",
    formFieldRow: "text-[#eceaff]",
    main: "bg-transparent",
  },
};

type IconType = typeof LayoutDashboard;
type NavItem = { href: string; label: string; icon: IconType };
const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Command centre",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      {
        href: "/transactions",
        label: "Transactions",
        icon: ReceiptIndianRupee,
      },
      { href: "/revenue", label: "Revenue", icon: TrendingUp },
      { href: "/receivables", label: "Receivables", icon: WalletCards },
      { href: "/payables", label: "Payables", icon: ArrowDownRight },
    ],
  },
  {
    title: "Understand",
    items: [
      { href: "/vendors", label: "Vendors", icon: BriefcaseBusiness },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/forecast", label: "Cash forecast", icon: Activity },
      { href: "/changes", label: "Month on month", icon: RefreshCw },
    ],
  },
  {
    title: "Act",
    items: [
      { href: "/alerts", label: "Alert centre", icon: Bell },
      { href: "/simulator", label: "What-if simulator", icon: Target },
      {
        href: "/invoice-intelligence",
        label: "Invoice intelligence",
        icon: FileCheck2,
      },
      { href: "/copilot", label: "Business copilot", icon: Sparkles },
      { href: "/reports", label: "Reports", icon: FileBarChart },
    ],
  },
];

const categories = [
  "Raw materials",
  "Labour & wages",
  "Transport & logistics",
  "Utilities",
  "Other overheads",
];

function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
}) {
  const styles = {
    neutral: "bg-muted text-muted-foreground",
    green: "bg-positive/15 text-positive",
    amber: "bg-warning/15 text-warning",
    red: "bg-negative/15 text-negative",
    blue: "bg-accent/15 text-accent",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`glass-card ${className}`}
    >
      {children}
    </section>
  );
}
function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  const { lang } = useLanguage();
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-primary">
            {t(lang, eyebrow)}
          </div>
        )}
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {t(lang, title)}
        </h2>
      </div>
      {action}
    </div>
  );
}
function EmptyButton({
  children,
  onClick,
  icon: Icon = ArrowRight,
  variant = "outline",
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: IconType;
  variant?: "outline" | "primary";
}) {
  const { lang } = useLanguage();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5 ${variant === "primary" ? "btn-glow" : "border border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"}`}
    >
      <span>{typeof children === "string" ? t(lang, children) : children}</span>
      <Icon size={14} />
    </button>
  );
}
function Field({
  label,
  children,
  helpKey,
}: {
  label: string;
  children: ReactNode;
  helpKey?: keyof typeof FIELD_HELP;
}) {
  const { lang } = useLanguage();
  return (
    <label className="block text-xs font-semibold">
      <span className="inline-flex items-center gap-1.5">
        {t(lang, label)}
        {helpKey && speechSupported() && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              speak(FIELD_HELP[helpKey][lang], lang);
            }}
            aria-label={`Listen to help for ${label}`}
            className="grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Volume2 size={13} />
          </button>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
function Modal({
  title,
  onClose,
  children,
  onListen,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  onListen?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-rise">
        <div className="mb-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold">{title}</h2>
            {onListen && (
              <button
                type="button"
                onClick={onListen}
                aria-label={`Listen: what does ${title} mean`}
                className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Volume2 size={16} />
              </button>
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const { lang } = useLanguage();
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
          <span className="size-1.5 rounded-full bg-accent" /> {t(lang, kicker)}
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-[-.035em] text-foreground sm:text-[38px]">
          {t(lang, title)}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t(lang, description)}
        </p>
      </div>
      {action}
    </div>
  );
}
function Metric({
  label,
  value,
  animatedValue,
  delta,
  icon: Icon,
  tone = "green",
}: {
  label: string;
  value: string;
  animatedValue?: number;
  delta?: string;
  icon: IconType;
  tone?: "green" | "amber" | "blue" | "red";
}) {
  const { lang } = useLanguage();
  const compactMatch = value.match(/^₹([\d,.]+)([LK])?$/);
  const countMatch = value.match(/^[\d,]+$/);
  const parsedValue = compactMatch
    ? Number(compactMatch[1].replace(/,/g, "")) *
      (compactMatch[2] === "L" ? 100000 : compactMatch[2] === "K" ? 1000 : 1)
    : countMatch
      ? Number(value.replace(/,/g, ""))
      : undefined;
  const shouldAnimate = animatedValue !== undefined || parsedValue !== undefined;
  const countValue = animatedValue ?? parsedValue ?? 0;
  const bg = {
    green: "bg-positive/15 text-positive",
    amber: "bg-warning/15 text-warning",
    blue: "bg-accent/15 text-accent",
    red: "bg-negative/15 text-negative",
  };
  return (
    <Card className="relative overflow-hidden p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground">
            {t(lang, label)}
          </div>
          <div className="mt-2 font-display text-[25px] font-semibold tracking-tight">
            {!shouldAnimate ? (
              value
            ) : (
              <CountUp
                value={countValue}
                format={animatedValue !== undefined || compactMatch ? compact : undefined}
              />
            )}
          </div>
        </div>
        <span
          className={`grid size-9 place-items-center rounded-xl ${bg[tone]}`}
        >
          <Icon size={17} />
        </span>
      </div>
      {delta && (
        <div className="mt-3 flex items-center gap-1 text-[11px] text-positive">
          <ArrowUpRight size={13} />
          {t(lang, delta)}
          <span className="text-muted-foreground">vs previous period</span>
        </div>
      )}
    </Card>
  );
}
function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#14142b]/95 p-3 shadow-[0_0_40px_-10px_rgba(124,92,255,0.55)] backdrop-blur-md">
      <div className="mb-1 text-[10px] text-muted-foreground">{label}</div>
      {payload.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-2 text-xs font-semibold"
        >
          <span
            className="size-2 rounded-full"
            style={{ background: p.color }}
          />
          {p.name}: {inr(p.value)}
        </div>
      ))}
    </div>
  );
}

const DataContext = createContext<BusinessBootstrap | null>(null);
function useBusinessData() {
  const value = useContext(DataContext);
  if (!value) throw new Error("Business data is not available");
  return value;
}
/** Small green tag shown next to entries that were sent by WhatsApp. */
function WhatsappBadge() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-positive/15 px-2 py-0.5 text-[10px] font-semibold text-positive">
      <MessageCircle size={10} />
      WhatsApp
    </span>
  );
}

/**
 * Keeps the dashboard live. Every few seconds it asks the server one cheap
 * question ("did anything change?"). If yes, it reloads the data, and if a
 * new entry arrived from WhatsApp it pops up a message about it. Renders
 * nothing itself.
 */
function LiveSync() {
  const data = useBusinessData();
  const refresh = useRefreshData();
  const clerkWindow = window as typeof window & {
    Clerk: { session: { getToken: () => Promise<string | null> } };
  };

  const lastPulse = useRef<string | null>(null);
  const seenIds = useRef<Set<number> | null>(null);


const pulse = useQuery({
  queryKey: ["business-pulse"],
  queryFn: async () => {
  const token = await clerkWindow.Clerk.session.getToken();

  console.log("🔥 NEW PULSE CODE:", Boolean(token), token?.length);

  const res = await fetch("/api/business/pulse", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("🔥 PULSE STATUS:", res.status);

  if (!res.ok) throw new Error("pulse failed");

  return await res.json();
},
  refetchInterval: 3000,
  refetchIntervalInBackground: false,
  retry: false,
});

  // Something was added or removed somewhere -> reload the workspace data.
  useEffect(() => {
    if (!pulse.data) return;
    const key = `${pulse.data.latestId}:${pulse.data.total}`;
    if (lastPulse.current !== null && lastPulse.current !== key) refresh();
    lastPulse.current = key;
  }, [pulse.data]);

  // New WhatsApp entries that just appeared -> tell the person.
  useEffect(() => {
    const ids = new Set(data.transactions.map((t) => t.id));
    if (seenIds.current) {
      for (const t of data.transactions) {
        if (!seenIds.current.has(t.id) && t.source === "whatsapp") {
          toast.success(
            `New from WhatsApp: ${t.type === "revenue" ? "revenue" : "expense"} ${inr(t.amount)}`,
            {
              description:
                t.type === "expense"
                  ? `${t.category} · ${t.description}`
                  : t.description,
              duration: 6000,
            },
          );
        }
      }
    }
    seenIds.current = ids;
  }, [data.transactions]);

  return null;
}
function useRefreshData() {
  const client = useQueryClient();
  return () =>
    client.invalidateQueries({ queryKey: getGetBusinessBootstrapQueryKey() });
}

function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Activity size={20} />
          </span>
          <span>
            <span className="block font-display text-xl font-bold">
              FinSight
            </span>
            <span className="block text-[9px] uppercase tracking-[.22em] text-muted-foreground">
              MSME intelligence
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm"
          >
            Create account
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-12 lg:pt-20">
        <div>
          <Pill tone="green">
            <Sparkles size={12} /> Built for ambitious MSMEs
          </Pill>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-7xl">
            Know your numbers.
            <br />
            <span className="text-primary">Move with confidence.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
            FinSight turns everyday financial data into a clear view of cash,
            risk, and the next best action for your business.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15"
            >
              Start your workspace <ArrowRight size={16} />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold"
            >
              Sign in
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check size={14} className="text-primary" /> No spreadsheet setup
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} className="text-primary" /> Private by default
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/15 blur-3xl" />
          <Card className="relative overflow-hidden border-white/10 bg-card p-5 shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">
                  Financial pulse
                </div>
                <div className="mt-1 font-display text-xl font-semibold">
                  Your business, understood
                </div>
              </div>
              <span className="grid size-9 place-items-center rounded-xl bg-positive/15 text-positive">
                <Activity size={17} />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-[10px] text-muted-foreground">
                  Current cash
                </div>
                <div className="mt-2 font-display text-2xl font-semibold">
                  ₹8.4L
                </div>
                <div className="mt-2 text-[10px] text-primary">
                  ↑ 8.2% this month
                </div>
              </div>
              <div className="rounded-xl bg-card p-4">
                <div className="text-[10px] text-muted-foreground">
                  Health score
                </div>
                <div className="mt-2 font-display text-2xl font-semibold">
                  78<span className="text-sm text-muted-foreground">/100</span>
                </div>
                <div className="mt-2 text-[10px] text-primary">
                  Healthy position
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Cash-flow outlook</span>
                <Pill tone="green">Positive</Pill>
              </div>
              <div className="mt-5 flex h-28 items-end gap-2">
                {[28, 36, 32, 50, 58, 64, 73, 86].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-primary/80"
                    style={{
                      height: `${height}%`,
                      opacity: 0.45 + index * 0.06,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-warning/10 p-3">
              <AlertCircle size={16} className="mt-0.5 text-accent" />
              <div>
                <div className="text-xs font-semibold">Signal detected</div>
                <div className="mt-1 text-[11px] leading-4 text-muted-foreground">
                  Transport spend is above your recent average.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SetupPage() {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    currency: "INR",
    financialYear: "April – March",
    openingCash: "0",
    monthlyRevenueTarget: "0",
  });
  const create = useCreateBusiness();
  const demo = useLoadDemoBusiness();
  const client = useQueryClient();
  const [, setLocation] = useLocation();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate(
      {
        data: {
          ...form,
          openingCash: Number(form.openingCash),
          monthlyRevenueTarget: Number(form.monthlyRevenueTarget),
        },
      },
      {
        onSuccess: () => {
          client.invalidateQueries({
            queryKey: getGetBusinessBootstrapQueryKey(),
          });
          toast.success("Business workspace created");
          setLocation("/dashboard");
        },
        onError: () => toast.error("Could not create the business yet"),
      },
    );
  };
  const loadDemo = () =>
    demo.mutate(undefined, {
      onSuccess: () => {
        client.invalidateQueries({
          queryKey: getGetBusinessBootstrapQueryKey(),
        });
        toast.success("Demo business loaded");
        setLocation("/dashboard");
      },
      onError: () => toast.error("A business already exists for this account"),
    });
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  return (
    <div className="min-h-[100dvh] bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Activity size={18} />
          </span>
          <span className="font-display text-lg font-bold">FinSight</span>
        </Link>
        <div className="mt-12 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <div>
            <Pill tone="green">Step 1 of 1</Pill>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
              Create your business workspace
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Start with the basics. Your dashboard will stay clear and empty
              until you add your first records.
            </p>
            <div className="mt-8 rounded-2xl border border-positive/30 bg-positive/10 p-4 text-xs leading-5 text-positive">
              <Lightbulb size={16} className="mb-2" />
              <b>You can load the demo instead</b>
              <p className="mt-1 text-muted-foreground">
                Use Shree Packaging Solutions to walk through the competition
                flow. It only appears when you choose it.
              </p>
              <button
                type="button"
                onClick={loadDemo}
                disabled={demo.isPending}
                className="mt-3 font-bold underline"
              >
                {demo.isPending ? "Loading demo…" : "Load demo business"}
              </button>
            </div>
          </div>
          <Card className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Shree Packaging Solutions"
                    className="form-input"
                  />
                </Field>
                <Field label="Business type / industry">
                  <input
                    required
                    value={form.industry}
                    onChange={(e) => update("industry", e.target.value)}
                    placeholder="e.g. Packaging manufacturing"
                    className="form-input"
                  />
                </Field>
                <Field label="Location">
                  <input
                    required
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className="form-input"
                  />
                </Field>
                <Field label="Currency">
                  <select
                    value={form.currency}
                    onChange={(e) => update("currency", e.target.value)}
                    className="form-input"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </Field>
                <Field label="Financial year">
                  <select
                    value={form.financialYear}
                    onChange={(e) => update("financialYear", e.target.value)}
                    className="form-input"
                  >
                    <option>April – March</option>
                    <option>January – December</option>
                  </select>
                </Field>
                <Field label="Opening cash balance">
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.openingCash}
                    onChange={(e) => update("openingCash", e.target.value)}
                    className="form-input"
                  />
                </Field>
              </div>
              <Field label="Monthly revenue target">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.monthlyRevenueTarget}
                  onChange={(e) =>
                    update("monthlyRevenueTarget", e.target.value)
                  }
                  className="form-input"
                />
              </Field>
              <button
                disabled={create.isPending}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
              >
                {create.isPending
                  ? "Creating workspace…"
                  : "Create business workspace"}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const { lang } = useLanguage();
  const data = useBusinessData();
  const currentLabel =
    navGroups.flatMap((g) => g.items).find((i) => i.href === location)?.label ??
    "Overview";
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <LiveSync />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[248px] border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform md:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2 pb-7">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <Activity size={20} strokeWidth={2.5} />
            </span>
            <span>
              <span className="block font-display text-[19px] font-bold tracking-tight">
                FinSight
              </span>
              <span className="block text-[9px] uppercase tracking-[.22em] text-sidebar-foreground/55">
                MSME intelligence
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mb-4 rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-warning/20 text-xs font-bold text-warning">
              {data.business.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold">
                {data.business.name}
              </div>
              <div className="text-[10px] text-sidebar-foreground/55">
                {data.business.location}
              </div>
            </div>
            <ChevronDown
              size={14}
              className="ml-auto text-sidebar-foreground/50"
            />
          </div>
        </div>
        <nav className="scrollbar-thin max-h-[calc(100dvh-225px)] space-y-5 overflow-y-auto pr-1">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[.18em] text-sidebar-foreground/40">
                {t(lang, group.title)}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = location === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNav(false)}
                      className={`nav-link group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-medium transition-colors ${active ? "active bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}
                    >
                      <Icon size={16} strokeWidth={active ? 2.4 : 1.8} />
                      <span>{t(lang, item.label)}</span>
                      {item.href === "/alerts" && (
                        <span className="ml-auto grid size-5 place-items-center rounded-full bg-negative text-[9px] font-bold text-white">
                          {calculateFinancials(data).populated ? 1 : 0}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 flex items-center justify-between border-t border-sidebar-border pt-4">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-2 text-xs text-sidebar-foreground/65 hover:text-sidebar-foreground"
          >
            <Settings size={16} /> {t(lang, "Settings")}
          </Link>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
            className="text-[10px] text-sidebar-foreground/45 hover:text-sidebar-foreground"
          >
            {t(lang, "Log out")}
          </button>
        </div>
      </aside>
      {mobileNav && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-background/80 md:hidden"
          onClick={() => setMobileNav(false)}
          aria-label="Close menu overlay"
        />
      )}
      <main className="min-h-[100dvh] md:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-7">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-muted md:hidden"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </button>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span>{t(lang, "Workspace")}</span>
            <ChevronRight size={13} />
            <span className="font-semibold text-foreground">
              {currentLabel}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <div className="relative hidden w-[250px] md:block">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                aria-label="Search FinSight"
                placeholder={t(lang, "Search anything...")}
                className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-xs outline-none transition focus:border-primary"
              />
          </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9">
          <PageTransition key={location}>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  title,
  text,
  action,
  onClick,
}: {
  title: string;
  text: string;
  action: string;
  onClick?: () => void;
}) {
  const { lang } = useLanguage();
  return (
    <div className="grid min-h-[230px] place-items-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div>
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-positive/15 text-positive">
          <Lightbulb size={20} />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold">{t(lang, title)}</h3>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
          {t(lang, text)}
        </p>
        <button
          type="button"
          onClick={onClick}
          className="btn-glow mt-5 rounded-xl text-xs font-bold"
        >
          {t(lang, action)}
        </button>
      </div>
    </div>
  );
}

const GREETINGS: Record<Lang, [string, string, string]> = {
  en: ["Good morning", "Good afternoon", "Good evening"],
  hi: ["सुप्रभात", "नमस्कार", "शुभ संध्या"],
  mr: ["शुभ प्रभात", "नमस्कार", "शुभ संध्या"],
};

/** "Good morning / afternoon / evening" for the current hour in India. */
function greetingFor(lang: Lang): string {
  const hour = Number(
    new Date().toLocaleString("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }),
  );
  const [morning, afternoon, evening] = GREETINGS[lang];
  return hour < 12 ? morning : hour < 17 ? afternoon : evening;
}

function Dashboard() {
  const data = useBusinessData();
  const { user } = useUser();
  const { lang } = useLanguage();
  const f = calculateFinancials(data);
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState("This financial year");
  const [showExpense, setShowExpense] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  return (
    <>
      <PageHeader
        kicker={`${data.business.name} · ${data.business.location}`}
        title={`${greetingFor(lang)}, ${user?.firstName ?? data.business.name.split(" ")[0]}.`}
        description={
          f.populated
            ? "Here is the financial pulse of your business. Your next decisions are grounded in the records you have added."
            : "Your financial workspace is ready. Add your first records to see your business intelligence take shape."
        }
        action={
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold outline-none"
            >
              <option>This financial year</option>
              <option>Last 6 months</option>
              <option>This quarter</option>
            </select>
            <Link
              href="/reports"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground"
            >
              <Download size={14} /> Export snapshot
            </Link>
          </div>
        }
      />
      <Stagger className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StaggerItem>
          <Metric
            label="Revenue"
            value={compact(f.revenue)}
            animatedValue={f.revenue}
            delta={f.populated ? "Live" : undefined}
            icon={TrendingUp}
          />
        </StaggerItem>
        <StaggerItem>
          <Metric
            label="Expenses"
            value={compact(f.expenseTotal)}
            animatedValue={f.expenseTotal}
            delta={f.populated ? "Live" : undefined}
            icon={TrendingDown}
            tone="amber"
          />
        </StaggerItem>
        <StaggerItem>
          <Metric
            label="Net cash flow"
            value={compact(f.netCashFlow)}
            animatedValue={f.netCashFlow}
            delta={f.populated ? "Calculated" : undefined}
            icon={Activity}
          />
        </StaggerItem>
        <StaggerItem>
          <Metric
            label="Current cash"
            value={compact(f.currentCash)}
            animatedValue={f.currentCash}
            delta={f.populated ? "Opening + net" : undefined}
            icon={CircleDollarSign}
            tone="blue"
          />
        </StaggerItem>
        <StaggerItem>
          <Metric
            label="Receivables"
            value={compact(f.receivables)}
            animatedValue={f.receivables}
            delta={f.populated ? "Live" : undefined}
            icon={WalletCards}
            tone="amber"
          />
        </StaggerItem>
      </Stagger>
      <div className="mb-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Card className="p-5 sm:p-6">
          <SectionTitle
            eyebrow="Performance"
            title="Revenue vs expenses"
            action={
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <i className="size-2 rounded-full bg-primary" /> Revenue
                </span>
                <span className="flex items-center gap-1">
                  <i className="size-2 rounded-full bg-accent" /> Expenses
                </span>
              </div>
            }
          />
          {f.monthly.length ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={f.monthly}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#8b89a8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${Number(v) / 100000}L`}
                    tick={{ fontSize: 10, fill: "#8b89a8" }}
                  />
                  <ReTooltip content={<ChartTip />} />
                  <Area
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#7c5cff"
                    fill="#7c5cff"
                    fillOpacity=".12"
                    strokeWidth={2.5}
                  />
                  <Area
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity=".1"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No transactions yet"
              text="Add revenue and expenses to unlock your performance trend."
              action="Add first expense"
              onClick={() => setShowExpense(true)}
            />
          )}
        </Card>
        <Card className="p-5 sm:p-6">
          <SectionTitle
            eyebrow="At a glance"
            title="Financial health"
            action={<Info size={15} className="text-muted-foreground" />}
          />
          {f.populated ? (
            <>
              <div className="flex items-center gap-6">
                <div
                  className="relative grid size-32 shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--primary-visual) 0 ${f.score}%, var(--surface-hover) ${f.score}% 100%)`,
                  }}
                >
                  <div className="grid size-24 place-items-center rounded-full bg-card">
                    <div className="text-center">
                      <div className="font-display text-3xl font-bold">
                        {f.score}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        of 100
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Pill tone={f.score >= 70 ? "green" : "amber"}>
                    {f.score >= 70 ? "Healthy" : "Building"}
                  </Pill>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {f.score >= 70
                      ? "Cash and operating performance are moving in the right direction."
                      : "Add more data to strengthen the quality of your financial signal."}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {f.healthBreakdown.map(({ key, label, score: factorScore }) => (
                  <div key={key}>
                    <div className="mb-1.5 flex justify-between text-[11px]">
                      <span>{label}</span>
                      <b>{factorScore}</b>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${factorScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Your health score starts here"
              text="Add at least one revenue or expense record to generate your first financial health score."
              action="Add revenue"
              onClick={() => setShowRevenue(true)}
            />
          )}
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5 sm:p-6">
          <SectionTitle
            eyebrow="Spend mix"
            title="Where expenses went"
            action={
              <Link
                href="/analytics"
                className="text-xs font-semibold text-primary"
              >
                View analysis <ArrowRight className="ml-1 inline" size={13} />
              </Link>
            }
          />
          {f.categories.length ? (
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="h-[190px] w-full sm:w-1/2">
                <ResponsiveContainer>
                  <RePieChart>
                    <Pie
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                      data={f.categories}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={3}
                    >
                      {f.categories.map((c) => (
                        <Cell key={c.name} fill={c.color} />
                      ))}
                    </Pie>
                    <ReTooltip content={<ChartTip />} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-3 sm:w-1/2">
                {f.categories.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: c.color }}
                    />
                    <span className="flex-1 text-muted-foreground">
                      {c.name}
                    </span>
                    <b>{compact(c.value)}</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No expense categories yet"
              text="Add your first expense to see where money is going."
              action="Add first expense"
              onClick={() => setShowExpense(true)}
            />
          )}
        </Card>
        <Card className="p-5 sm:p-6">
          <SectionTitle
            eyebrow="Next 90 days"
            title="Cash-flow forecast"
            action={
              <Pill tone={f.populated ? "green" : "neutral"}>
                {f.populated ? "Calculated" : "Waiting for data"}
              </Pill>
            }
          />
          {f.populated ? (
            <>
              <div className="h-[205px]">
                <ResponsiveContainer>
                  <LineChart data={f.forecast}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#8b89a8" }}
                    />
                    <YAxis hide />
                    <ReTooltip content={<ChartTip />} />
                    <Line
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                      dataKey="balance"
                      name="Cash balance"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{
                        fill: "#22d3ee",
                        r: 4,
                        strokeWidth: 2,
                        stroke: "#14142b",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">
                  Expected closing balance
                </span>
                <b className="text-positive">
                  {compact(f.forecast[2].balance)}
                </b>
              </div>
            </>
          ) : (
            <EmptyState
              title="Forecast needs a baseline"
              text="Add revenue and expenses to calculate your 30/60/90-day cash position."
              action="Add revenue"
              onClick={() => setShowRevenue(true)}
            />
          )}
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle
            eyebrow="Collections"
            title="Receivables to watch"
            action={
              <Link
                href="/receivables"
                className="text-xs font-semibold text-primary"
              >
                See all
              </Link>
            }
          />
          {data.receivables.length ? (
            data.receivables.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 border-b border-border py-3 last:border-0"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-positive/15 text-[10px] font-bold text-positive">
                  {c.customer.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">
                    {c.customer}
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {c.invoice} · {formatDate(c.dueDate)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold">{compact(c.amount)}</div>
                  <Pill tone={c.status === "Overdue" ? "red" : "amber"}>
                    {c.status}
                  </Pill>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No receivables yet"
              text="Add a customer and receivable to track money due to you."
              action="Add customer"
              onClick={() => setLocation("/receivables")}
            />
          )}
        </Card>
        <Card className="p-5">
          <SectionTitle
            eyebrow="Signal detected"
            title="Anomaly alerts"
            action={
              <Link
                href="/alerts"
                className="text-xs font-semibold text-primary"
              >
                Open centre
              </Link>
            }
          />
          {f.populated ? (
            <div className="space-y-3">
              {f.anomalies.length ? (
                f.anomalies.slice(0, 2).map((anomaly) => (
                  <div
                    key={anomaly.category}
                    className="rounded-xl border border-warning/30 bg-warning/10 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid size-8 place-items-center rounded-lg bg-warning/15 text-warning">
                        <AlertCircle size={16} />
                      </span>
                      <div>
                        <div className="text-xs font-semibold">
                          {anomaly.category} spend spike
                        </div>
                        <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                          {anomaly.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-warning/30 bg-warning/10 p-3">
                  <div className="flex items-start gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-warning/15 text-warning">
                      <AlertCircle size={16} />
                    </span>
                    <div>
                      <div className="text-xs font-semibold">
                        No spend spikes detected
                      </div>
                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                        {f.monthly.length > 1
                          ? "Category spending is within the normal range of recent months."
                          : "Add another month of transactions so FinSight can compare against a recent average."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-positive/30 bg-positive/10 p-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-positive/15 text-positive">
                    <Lightbulb size={16} />
                  </span>
                  <div>
                    <div className="text-xs font-semibold">
                      Collection opportunity
                    </div>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                      {f.overdueReceivableAmount > 0
                        ? `${compact(f.overdueReceivableAmount)} in receivables is overdue and ready to collect.`
                        : data.receivables.length
                          ? `${data.receivables.length} receivable records are on track.`
                          : "Add receivables to surface collection opportunities."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No signals yet"
              text="Add a few transactions and FinSight will start looking for meaningful movement."
              action="Add a transaction"
              onClick={() => setShowExpense(true)}
            />
          )}
        </Card>
      </div>
      {showExpense && (
        <RecordModal kind="expense" onClose={() => setShowExpense(false)} />
      )}{" "}
      {showRevenue && (
        <RecordModal kind="revenue" onClose={() => setShowRevenue(false)} />
      )}
    </>
  );
}

type RecordKind =
  | "expense"
  | "revenue"
  | "customer"
  | "vendor"
  | "receivable"
  | "payable"
  | "budget"
  | "recurring";
function RecordModal({
  kind,
  onClose,
}: {
  kind: RecordKind;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const refresh = useRefreshData();
  const expense = useCreateTransaction();
  const revenue = useCreateRevenue();
  const customer = useCreateCustomer();
  const vendor = useCreateVendor();
  const receivable = useCreateReceivable();
  const payable = useCreatePayable();
  const budget = useCreateBudget();
  const recurring = useCreateRecurringExpense();
  const [form, setForm] = useState<Record<string, string>>({
    description: "",
    amount: "",
    category: "Raw materials",
    vendor: "",
    customer: "",
    date: "2025-03-08",
    status: "Cleared",
    name: "",
    email: "",
    phone: "",
    terms: "Net 30",
    invoice: "",
    dueDate: "2025-03-31",
    priority: "Medium",
    reference: "",
    period: "March 2025",
    frequency: "Monthly",
  });
  const title = {
    expense: "Add an expense",
    revenue: "Add revenue",
    customer: "Add a customer",
    vendor: "Add a vendor",
    receivable: "Add a receivable",
    payable: "Add a payable",
    budget: "Set a budget",
    recurring: "Add recurring expense",
  }[kind];
  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const onSuccess = () => {
    refresh();
    toast.success(`${title} saved`);
    onClose();
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const done = {
      onSuccess,
      onError: () => toast.error("Could not save this record"),
    };
    if (kind === "expense")
      expense.mutate(
        {
          data: {
            description: form.description,
            amount: Number(form.amount),
            category: form.category,
            vendor: form.vendor || null,
            date: form.date,
            status: form.status,
          },
        },
        done,
      );
    if (kind === "revenue")
      revenue.mutate(
        {
          data: {
            description: form.description,
            amount: Number(form.amount),
            customer: form.customer || null,
            date: form.date,
            status: form.status,
          },
        },
        done,
      );
    if (kind === "customer")
      customer.mutate(
        {
          data: {
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
          },
        },
        done,
      );
    if (kind === "vendor")
      vendor.mutate(
        {
          data: { name: form.name, category: form.category, terms: form.terms },
        },
        done,
      );
    if (kind === "receivable")
      receivable.mutate(
        {
          data: {
            customer: form.customer,
            invoice: form.invoice,
            amount: Number(form.amount),
            dueDate: form.dueDate,
            status: form.status,
          },
        },
        done,
      );
    if (kind === "payable")
      payable.mutate(
        {
          data: {
            vendor: form.vendor,
            reference: form.reference,
            amount: Number(form.amount),
            dueDate: form.dueDate,
            priority: form.priority,
            status: "Open",
          },
        },
        done,
      );
    if (kind === "budget")
      budget.mutate(
        {
          data: {
            category: form.category,
            amount: Number(form.amount),
            period: form.period,
          },
        },
        done,
      );
    if (kind === "recurring")
      recurring.mutate(
        {
          data: {
            name: form.name,
            amount: Number(form.amount),
            category: form.category,
            frequency: form.frequency,
          },
        },
        done,
      );
  };
  const busy =
    expense.isPending ||
    revenue.isPending ||
    customer.isPending ||
    vendor.isPending ||
    receivable.isPending ||
    payable.isPending ||
    budget.isPending ||
    recurring.isPending;
  return (
    <Modal
      title={title}
      onClose={onClose}
      onListen={
        speechSupported() && FORM_HELP[kind]
          ? () => speak(FORM_HELP[kind][lang], lang)
          : undefined
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {(kind === "expense" || kind === "revenue") && (
          <>
            <Field
              label="Description"
              helpKey={kind === "expense" ? "entryDescriptionExpense" : "entryDescriptionRevenue"}
            >
              <input
                required
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder={
                  kind === "expense"
                    ? "e.g. Corrugated board sheets"
                    : "e.g. Customer order #1048"
                }
                className="form-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Amount"
                helpKey={kind === "expense" ? "entryAmountExpense" : "entryAmountRevenue"}
              >
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field
                label="Date"
                helpKey={kind === "expense" ? "entryDateExpense" : "entryDateRevenue"}
              >
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>
            {kind === "expense" ? (
              <>
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="form-input"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Vendor (optional)">
                  <input
                    value={form.vendor}
                    onChange={(e) => update("vendor", e.target.value)}
                    className="form-input"
                  />
                </Field>
              </>
            ) : (
              <Field label="Customer (optional)">
                <input
                  value={form.customer}
                  onChange={(e) => update("customer", e.target.value)}
                  className="form-input"
                />
              </Field>
            )}
          </>
        )}
        {kind === "customer" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer name">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="form-input"
              />
            </Field>
          </div>
        )}
        {kind === "vendor" && (
          <>
            <Field label="Vendor name">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="form-input"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Payment terms">
              <input
                value={form.terms}
                onChange={(e) => update("terms", e.target.value)}
                className="form-input"
              />
            </Field>
          </>
        )}
        {kind === "receivable" && (
          <>
            <Field label="Customer">
              <input
                required
                value={form.customer}
                onChange={(e) => update("customer", e.target.value)}
                className="form-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Invoice">
                <input
                  required
                  value={form.invoice}
                  onChange={(e) => update("invoice", e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Amount">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>
            <Field label="Due date">
              <input
                required
                type="date"
                value={form.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className="form-input"
              />
            </Field>
          </>
        )}
        {kind === "payable" && (
          <>
            <Field label="Vendor">
              <input
                required
                value={form.vendor}
                onChange={(e) => update("vendor", e.target.value)}
                className="form-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Reference">
                <input
                  required
                  value={form.reference}
                  onChange={(e) => update("reference", e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Amount">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Due date">
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Priority">
                <select
                  value={form.priority}
                  onChange={(e) => update("priority", e.target.value)}
                  className="form-input"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </Field>
            </div>
          </>
        )}
        {kind === "budget" && (
          <>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="form-input"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Budget amount">
              <input
                required
                min="0"
                type="number"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="Period">
              <input
                value={form.period}
                onChange={(e) => update("period", e.target.value)}
                className="form-input"
              />
            </Field>
          </>
        )}
        {kind === "recurring" && (
          <>
            <Field label="Expense name">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="form-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Frequency">
                <select
                  value={form.frequency}
                  onChange={(e) => update("frequency", e.target.value)}
                  className="form-input"
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Quarterly</option>
                </select>
              </Field>
            </div>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="form-input"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </>
        )}
        <button
          disabled={busy}
          className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save record"}
        </button>
      </form>
    </Modal>
  );
}

function TransactionsPage() {
  const data = useBusinessData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = data.transactions.filter(
    (t) =>
      t.type === "expense" &&
      `${t.description} ${t.vendor ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "All categories" || t.category === category),
  );
  return (
    <>
      <PageHeader
        kicker="Money in motion"
        title="Transactions"
        description="A clean ledger of every outgoing rupee, ready to search, filter, and understand."
        action={
          <EmptyButton
            icon={Plus}
            variant="primary"
            onClick={() => setShowAdd(true)}
          >
            Add expense
          </EmptyButton>
        }
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vendor or description"
              aria-label="Search transactions"
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter category"
            className="h-10 rounded-xl border border-border bg-background px-3 text-xs"
          >
            <option>All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              toast.info("Use the category filter to narrow this ledger")
            }
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-3 text-xs font-semibold"
          >
            <Filter size={14} /> More filters
          </button>
        </div>
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  {[
                    "Date",
                    "Description",
                    "Vendor",
                    "Category",
                    "Amount",
                    "Status",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t border-border text-xs transition hover:bg-muted/30"
                  >
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {t.description}
                      <div className="mt-0.5 flex items-center text-[10px] text-muted-foreground">
                        TX-{t.id}
                        {t.source === "whatsapp" && <WhatsappBadge />}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {t.vendor ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Pill>{t.category}</Pill>
                    </td>
                    <td className="px-5 py-4 font-bold">{inr(t.amount)}</td>
                    <td className="px-5 py-4">
                      <Pill tone={t.status === "Cleared" ? "green" : "amber"}>
                        {t.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No transactions yet"
              text="Add your first expense and it will appear here, on the dashboard, and in analytics."
              action="Add your first expense"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </Card>
      {showAdd && (
        <RecordModal kind="expense" onClose={() => setShowAdd(false)} />
      )}
    </>
  );
}

function RevenuePage() {
  const data = useBusinessData();
  const f = calculateFinancials(data);
  const [showAdd, setShowAdd] = useState(false);
  return (
    <>
      <PageHeader
        kicker="Money earned"
        title="Revenue overview"
        description="Revenue entries are stored with your business and feed every cash and forecast calculation."
        action={
          <EmptyButton
            icon={Plus}
            variant="primary"
            onClick={() => setShowAdd(true)}
          >
            Add revenue
          </EmptyButton>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Total revenue"
          value={compact(f.revenue)}
          icon={TrendingUp}
        />
        <Metric
          label="Average entry"
          value={compact(
            f.revenueEntries.length ? f.revenue / f.revenueEntries.length : 0,
          )}
          icon={BarChart3}
          tone="blue"
        />
        <Metric
          label="Revenue entries"
          value={String(f.revenueEntries.length)}
          icon={FileCheck2}
          tone="amber"
        />
      </div>
      <Card className="mt-6 p-5 sm:p-6">
        <SectionTitle eyebrow="Revenue performance" title="What has come in" />
        {f.monthly.length ? (
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={f.monthly}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#8b89a8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${Number(v) / 100000}L`}
                  tick={{ fontSize: 10, fill: "#8b89a8" }}
                />
                <ReTooltip content={<ChartTip />} />
                <Bar
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                  dataKey="revenue"
                  name="Revenue"
                  fill="#7c5cff"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="No revenue yet"
            text="Add a revenue entry to build your performance trend."
            action="Add revenue"
            onClick={() => setShowAdd(true)}
          />
        )}
      </Card>
      <Card className="mt-6 overflow-hidden">
        <div className="p-5">
          <SectionTitle eyebrow="Latest entries" title="Revenue ledger" />
        </div>
        {f.revenueEntries.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {f.revenueEntries.map((t) => (
                  <tr key={t.id} className="table-row border-t border-border text-xs">
                    <td className="px-5 py-4 font-semibold">
                      {t.description}
                      {t.source === "whatsapp" && <WhatsappBadge />}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {t.customer ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-5 py-4 font-bold">{inr(t.amount)}</td>
                    <td className="px-5 py-4">
                      <Pill tone="green">{t.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No revenue entries yet"
              text="Your revenue ledger will appear here after your first entry."
              action="Add revenue"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </Card>
      {showAdd && (
        <RecordModal kind="revenue" onClose={() => setShowAdd(false)} />
      )}
    </>
  );
}

function ReceivablesPage() {
  const data = useBusinessData();
  const [showAdd, setShowAdd] = useState(false);
  const total = data.receivables.reduce((sum, item) => sum + item.amount, 0);
  return (
    <>
      <PageHeader
        kicker="Collect with confidence"
        title="Receivables"
        description={
          data.receivables.length
            ? `${compact(total)} is outstanding. Prioritise the conversations that turn into cash fastest.`
            : "Track invoices and customer balances so money due to you stays visible."
        }
        action={
          <EmptyButton
            icon={Plus}
            variant="primary"
            onClick={() => setShowAdd(true)}
          >
            Add receivable
          </EmptyButton>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Total outstanding"
          value={compact(total)}
          icon={WalletCards}
          tone="amber"
        />
        <Metric
          label="Open records"
          value={String(data.receivables.length)}
          icon={Clock3}
          tone="blue"
        />
        <Metric
          label="Overdue"
          value={compact(
            data.receivables
              .filter((x) => x.status === "Overdue")
              .reduce((sum, item) => sum + item.amount, 0),
          )}
          icon={AlertCircle}
          tone="red"
        />
      </div>
      <Card className="mt-6 overflow-hidden">
        <div className="p-5">
          <SectionTitle eyebrow="Customer ledger" title="Collection status" />
        </div>
        {data.receivables.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Due date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.receivables.map((c) => (
                  <tr key={c.id} className="table-row border-t border-border">
                    <td className="px-5 py-4 font-semibold">{c.customer}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {c.invoice}
                    </td>
                    <td className="px-5 py-4 font-bold">{inr(c.amount)}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(c.dueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <Pill
                        tone={
                          c.status === "Overdue"
                            ? "red"
                            : c.status === "Current"
                              ? "green"
                              : "amber"
                        }
                      >
                        {c.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No receivables yet"
              text="Add a customer receivable to keep your collection pipeline visible."
              action="Add receivable"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </Card>
      {showAdd && (
        <RecordModal kind="receivable" onClose={() => setShowAdd(false)} />
      )}
    </>
  );
}

function PayablesPage() {
  const data = useBusinessData();
  const [showAdd, setShowAdd] = useState(false);
  const total = data.payables.reduce((sum, item) => sum + item.amount, 0);
  return (
    <>
      <PageHeader
        kicker="Protect your relationships"
        title="Payables"
        description={
          data.payables.length
            ? `${compact(total)} is scheduled across your supplier obligations.`
            : "Capture upcoming supplier payments to protect your cash buffer and production continuity."
        }
        action={
          <EmptyButton
            icon={Plus}
            variant="primary"
            onClick={() => setShowAdd(true)}
          >
            Add payable
          </EmptyButton>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Total due"
          value={compact(total)}
          icon={ArrowDownRight}
          tone="amber"
        />
        <Metric
          label="Open obligations"
          value={String(data.payables.length)}
          icon={Clock3}
          tone="red"
        />
        <Metric
          label="Current cash"
          value={compact(calculateFinancials(data).currentCash)}
          icon={ShieldCheck}
        />
      </div>
      <Card className="mt-6 overflow-hidden">
        <div className="p-5">
          <SectionTitle
            eyebrow="Supplier obligations"
            title="Payment priority queue"
          />
        </div>
        {data.payables.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Supplier</th>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Due</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.payables.map((p) => (
                  <tr key={p.id} className="table-row border-t border-border">
                    <td className="px-5 py-4 font-semibold">{p.vendor}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {p.reference}
                    </td>
                    <td className="px-5 py-4 font-bold">{inr(p.amount)}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(p.dueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <Pill
                        tone={
                          p.priority === "High"
                            ? "red"
                            : p.priority === "Medium"
                              ? "amber"
                              : "green"
                        }
                      >
                        {p.priority}
                      </Pill>
                    </td>
                    <td className="px-5 py-4">
                      <Pill tone="amber">{p.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No payables yet"
              text="Add your next supplier obligation to make upcoming cash outflows visible."
              action="Add payable"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </Card>
      {showAdd && (
        <RecordModal kind="payable" onClose={() => setShowAdd(false)} />
      )}
    </>
  );
}

function VendorsPage() {
  const data = useBusinessData();
  const [showAdd, setShowAdd] = useState(false);
  const spends = calculateFinancials(data).vendorSpend;
  return (
    <>
      <PageHeader
        kicker="Partner economics"
        title="Vendors"
        description="Keep your supplier directory connected to the spend that flows through your business."
        action={
          <EmptyButton
            icon={Plus}
            variant="primary"
            onClick={() => setShowAdd(true)}
          >
            Add vendor
          </EmptyButton>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Active vendors"
          value={String(data.vendors.length)}
          icon={BriefcaseBusiness}
          tone="blue"
        />
        <Metric
          label="Tracked spend"
          value={compact(spends.reduce((sum, item) => sum + item.spend, 0))}
          icon={IndianRupee}
        />
        <Metric
          label="Receipts captured"
          value={String(data.invoices.length)}
          icon={FileCheck2}
          tone="amber"
        />
      </div>
      <Card className="mt-6 overflow-hidden">
        <div className="p-5">
          <SectionTitle
            eyebrow="Supplier directory"
            title="Vendors you work with"
          />
        </div>
        {data.vendors.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Vendor</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Spend from transactions</th>
                  <th className="px-5 py-3">Terms</th>
                </tr>
              </thead>
              <tbody>
                {data.vendors.map((v) => (
                  <tr key={v.id} className="table-row border-t border-border">
                    <td className="px-5 py-4 font-semibold">
                      <span className="mr-2 inline-grid size-8 place-items-center rounded-lg bg-muted text-[9px] font-bold text-muted-foreground">
                        {v.name.slice(0, 2).toUpperCase()}
                      </span>
                      {v.name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {v.category}
                    </td>
                    <td className="px-5 py-4 font-bold">
                      {compact(
                        spends.find((item) => item.name === v.name)?.spend ?? 0,
                      )}
                    </td>
                    <td className="px-5 py-4">{v.terms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No vendors yet"
              text="Add your first vendor to connect supplier records to expense patterns."
              action="Add vendor"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </Card>
      {showAdd && (
        <RecordModal kind="vendor" onClose={() => setShowAdd(false)} />
      )}
    </>
  );
}

function AnalyticsPage() {
  const data = useBusinessData();
  const f = calculateFinancials(data);
  return (
    <>
      <PageHeader
        kicker="Find the signal"
        title="Expense analytics"
        description="Understand what is moving your margins before it shows up in the bank balance."
        action={
          <Pill tone={f.populated ? "green" : "neutral"}>
            {f.populated ? "Live from your books" : "Waiting for data"}
          </Pill>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Gross margin"
          value={
            f.revenue
              ? `${Math.round((f.netCashFlow / f.revenue) * 100)}%`
              : "—"
          }
          icon={PieChart}
        />
        <Metric
          label="Cost per entry"
          value={
            f.expenses.length
              ? compact(f.expenseTotal / f.expenses.length)
              : "—"
          }
          icon={Package}
          tone="amber"
        />
        <Metric
          label="Categories tracked"
          value={String(f.categories.length)}
          icon={Activity}
          tone="blue"
        />
      </div>
      {f.populated ? (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card className="p-5">
              <SectionTitle eyebrow="Cost movement" title="Expense trend" />
              <div className="h-[280px]">
                <ResponsiveContainer>
                  <LineChart data={f.monthly}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#8b89a8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${Number(v) / 100000}L`}
                      tick={{ fontSize: 10, fill: "#8b89a8" }}
                    />
                    <ReTooltip content={<ChartTip />} />
                    <Line
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                      dataKey="expenses"
                      name="Total expenses"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <SectionTitle
                eyebrow="Category concentration"
                title="Where to optimise"
              />
              <div className="space-y-5">
                {f.categories.map((c) => (
                  <div key={c.name}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-muted-foreground">
                        {f.expenseTotal
                          ? Math.round((c.value / f.expenseTotal) * 100)
                          : 0}
                        % of expenses
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${f.expenseTotal ? (c.value / f.expenseTotal) * 100 : 0}%`,
                          background: c.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card className="mt-6 p-5">
            <SectionTitle
              eyebrow="Decision support"
              title="Reads from your data"
            />
            <div className="grid gap-3 md:grid-cols-3">
              <Insight
                icon={TrendingUp}
                title="Cash conversion"
                text={
                  f.netCashFlow >= 0
                    ? `Your records show ${compact(f.netCashFlow)} of positive net cash flow.`
                    : "Expenses currently exceed recorded revenue; add more records to sharpen this view."
                }
              />
              <Insight
                icon={AlertCircle}
                title="Largest cost"
                text={
                  f.categories[0]
                    ? `${f.categories[0].name} is your largest tracked category at ${compact(f.categories[0].value)}.`
                    : "Add expenses to identify the largest cost line."
                }
              />
              <Insight
                icon={Lightbulb}
                title="Coverage"
                text={`${data.transactions.length} transaction records are feeding your intelligence views.`}
              />
            </div>
          </Card>
        </>
      ) : (
        <Card className="mt-6 p-5">
          <EmptyState
            title="Not enough data yet"
            text="Add more transactions to generate this insight."
            action="Add an expense"
            onClick={() =>
              toast.info("Use Transactions → Add expense to begin")
            }
          />
        </Card>
      )}
    </>
  );
}
function Insight({
  icon: Icon,
  title,
  text,
}: {
  icon: IconType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/35 p-4">
      <Icon size={17} className="text-primary" />
      <div className="mt-3 text-xs font-semibold">{title}</div>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}

function ForecastPage() {
  const data = useBusinessData();
  const f = calculateFinancials(data);
  const [days, setDays] = useState(90);
  const selected =
    f.forecast.find((point) => point.days === days) ?? f.forecast[2];
  return (
    <>
      <PageHeader
        kicker="Look ahead"
        title="Cash-flow forecast"
        description="A practical view of when cash arrives, when it leaves, and the buffer you can rely on."
        action={
          <div className="flex rounded-xl border border-border bg-card p-1">
            {[30, 60, 90].map((x) => (
              <button
                type="button"
                key={x}
                onClick={() => setDays(x)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${days === x ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {x} days
              </button>
            ))}
          </div>
        }
      />
      {f.populated ? (
        <>
          <Card className="p-5 sm:p-6">
            <SectionTitle
              eyebrow="Calculated from your books"
              title={`Projected cash position · ${days} days`}
              action={<Pill tone="green">Live model</Pill>}
            />
            <div className="h-[330px]">
              <ResponsiveContainer>
                <AreaChart data={f.forecast}>
                  <defs>
                    <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#22d3ee" stopOpacity=".22" />
                      <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#8b89a8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${Number(v) / 100000}L`}
                    tick={{ fontSize: 10, fill: "#8b89a8" }}
                  />
                  <ReTooltip content={<ChartTip />} />
                  <Area
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                    dataKey="balance"
                    name="Closing cash"
                    stroke="#22d3ee"
                    fill="url(#balFill)"
                    strokeWidth={3}
                  />
                  <Line
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                    dataKey="inflow"
                    name="Cash inflow"
                    stroke="#22d3ee"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <SectionTitle
                eyebrow="Current assumptions"
                title="What shapes this forecast"
              />
              <div className="space-y-3">
                {[
                  ["Opening cash", compact(data.business.openingCash)],
                  ["Recorded revenue", compact(f.revenue)],
                  ["Recorded expenses", compact(f.expenseTotal)],
                  ["Recurring expenses / month", compact(f.recurringMonthly)],
                  ["Receivables outstanding", compact(f.receivables)],
                  ["Payables outstanding", compact(f.payables)],
                ].map(([a, b]) => (
                  <div
                    key={a}
                    className="flex items-center justify-between border-b border-border py-2.5 text-xs last:border-0"
                  >
                    <span className="font-semibold">{a}</span>
                    <span className="text-muted-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <SectionTitle
                eyebrow="Selected horizon"
                title="Expected closing balance"
              />
              <div className="font-display text-4xl font-semibold text-primary">
                {compact(selected.balance)}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                This estimate uses the current business cash balance and the net
                cash flow recorded so far. Add more records to improve the
                signal.
              </p>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-5">
          <EmptyState
            title="Not enough data yet"
            text="Add more transactions to generate this insight."
            action="Add revenue"
            onClick={() =>
              toast.info("Add revenue or expenses to build the forecast")
            }
          />
        </Card>
      )}
    </>
  );
}

const actionTypeLabel: Record<string, string> = {
  anomaly: "Anomaly",
  collections: "Collections",
  payables: "Payables",
  budget: "Budget",
  baseline: "Baseline",
};
const actionIcon: Record<string, typeof AlertCircle> = {
  anomaly: AlertCircle,
  collections: WalletCards,
  payables: Clock3,
  budget: PieChart,
  baseline: Lightbulb,
};

function AlertsPage() {
  const data = useBusinessData();
  const f = calculateFinancials(data);
  const [done, setDone] = useState<string[]>([]);
  const actions = f.actions.map((action) => ({
    id: action.id,
    type: actionTypeLabel[action.kind],
    title: action.title,
    text: action.text,
    tone: action.tone,
    icon: actionIcon[action.kind],
  }));
  return (
    <>
      <PageHeader
        kicker="Action centre"
        title="Alerts & recommendations"
        description="FinSight watches the records you add so your attention stays on the actions that can change the outcome."
        action={
          <Pill tone={actions.length ? "amber" : "neutral"}>
            {actions.length} open actions
          </Pill>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
        <div className="space-y-4">
          {actions.length ? (
            actions.map((a) => {
              const Icon = a.icon;
              const isDone = done.includes(a.id);
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Card
                    className={`border-l-4 p-5 transition ${isDone ? "opacity-60" : ""} ${a.tone === "red" || a.tone === "amber" ? "border-l-[var(--negative)]" : "border-l-[var(--warning)]"}`}
                  >
                    <div className="flex gap-4">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl ${a.tone === "amber" ? "bg-warning/15 text-warning" : a.tone === "blue" ? "bg-accent/15 text-accent" : a.tone === "red" ? "bg-negative/15 text-negative" : "bg-positive/15 text-positive"}`}
                    >
                      <Icon size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {a.type}
                      </div>
                      <h3 className="text-sm font-semibold">{a.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {a.text}
                      </p>
                      <button
                        type="button"
                        onClick={() => setDone([...done, a.id])}
                        className={`mt-4 rounded-lg px-3 py-2 text-[11px] font-bold ${isDone ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}
                      >
                        {isDone ? "Action completed" : "Mark as reviewed"}
                      </button>
                    </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <Card className="p-5">
              <EmptyState
                title="No alerts yet"
                text="Add more transactions to generate this insight."
                action="Add a transaction"
                onClick={() =>
                  toast.info("Use Transactions → Add expense to begin")
                }
              />
            </Card>
          )}
        </div>
        <Card className="h-fit p-5">
          <SectionTitle eyebrow="Signal quality" title="Your financial radar" />
          <div className="text-center">
            {(() => {
              const coverageParts = [
                data.transactions.length > 0,
                data.customers.length > 0,
                data.vendors.length > 0,
                data.receivables.length > 0,
                data.payables.length > 0,
                data.budgets.length > 0,
                f.monthly.length > 1,
              ];
              const coverage = Math.round(
                (coverageParts.filter(Boolean).length / coverageParts.length) *
                  100,
              );
              return (
                <div
                  className="mx-auto grid size-28 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--primary-visual) 0 ${coverage}%, var(--surface-hover) ${coverage}% 100%)`,
                  }}
                >
                  <div className="grid size-[88px] place-items-center rounded-full bg-card">
                    <div className="font-display text-2xl font-bold">
                      {coverage}%
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="mt-4 text-sm font-semibold">
              {f.populated ? "Building coverage" : "Ready to learn"}
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {f.populated
                ? "Your books have enough signal for early guidance."
                : "Add transactions, customers, and vendors to activate your financial radar."}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

function ChangesPage() {
  const data = useBusinessData();
  const f = calculateFinancials(data);
  return (
    <>
      <PageHeader
        kicker="Make sense of movement"
        title="Month on month"
        description="FinSight compares the records you have added and explains what is changing."
        action={
          <Pill tone={f.populated ? "green" : "neutral"}>
            {f.populated ? "Current view" : "Waiting for data"}
          </Pill>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Revenue" value={compact(f.revenue)} icon={TrendingUp} />
        <Metric
          label="Expenses"
          value={compact(f.expenseTotal)}
          icon={TrendingDown}
          tone="amber"
        />
        <Metric
          label="Net cash flow"
          value={compact(f.netCashFlow)}
          icon={Activity}
        />
      </div>
      <Card className="mt-6 p-5">
        <SectionTitle
          eyebrow={
            f.monthOverMonth?.hasComparison
              ? `${f.monthOverMonth.currentLabel} vs ${f.monthOverMonth.previousLabel}`
              : "The detail behind the delta"
          }
          title="What changed"
        />
        {f.populated && f.monthOverMonth?.hasComparison ? (
          <>
            <div className="divide-y divide-border">
              {f.monthOverMonth.changes.map((change) => (
                <div
                  key={change.label}
                  className="flex flex-col gap-3 px-1 py-4 sm:flex-row sm:items-center"
                >
                  <span
                    className={`grid size-9 place-items-center rounded-xl ${change.direction === "up" ? "bg-positive/15 text-positive" : change.direction === "down" ? "bg-negative/15 text-negative" : "bg-muted text-muted-foreground"}`}
                  >
                    {change.direction === "down" ? (
                      <ArrowDownRight size={17} />
                    ) : (
                      <ArrowUpRight size={17} />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold">{change.label}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {compact(change.previous)} in{" "}
                      {f.monthOverMonth?.previousLabel} →{" "}
                      {compact(change.current)} in{" "}
                      {f.monthOverMonth?.currentLabel}
                    </div>
                  </div>
                  <b
                    className={
                      change.direction === "up"
                        ? "text-primary"
                        : change.direction === "down"
                          ? "text-negative"
                          : ""
                    }
                  >
                    {change.deltaPct === null
                      ? "New"
                      : `${change.deltaPct >= 0 ? "+" : ""}${Math.round(change.deltaPct)}%`}
                  </b>
                </div>
              ))}
            </div>
            {f.monthOverMonth.categoryChanges.length > 0 && (
              <>
                <div className="mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Biggest category moves
                </div>
                <div className="divide-y divide-border">
                  {f.monthOverMonth.categoryChanges.map((change) => (
                    <div
                      key={change.category}
                      className="flex items-center justify-between px-1 py-3 text-xs"
                    >
                      <span>{change.category}</span>
                      <span className="text-muted-foreground">
                        {compact(change.previous)} → {compact(change.current)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : f.populated ? (
          <EmptyState
            title="Not enough data yet"
            text="Add transactions in a second month so FinSight can compare month over month."
            action="Add a transaction"
            onClick={() =>
              toast.info("Use Transactions → Add expense to begin")
            }
          />
        ) : (
          <EmptyState
            title="Not enough data yet"
            text="Add more transactions to generate this insight."
            action="Add your first expense"
            onClick={() =>
              toast.info("Use Transactions → Add expense to begin")
            }
          />
        )}
      </Card>
    </>
  );
}

function SimulatorPage() {
  const data = useBusinessData();
  const f = calculateFinancials(data);
  const [values, setValues] = useState({
    revenue: 0,
    raw: 0,
    transport: 0,
    labour: 0,
  });
  const update = (key: keyof typeof values, value: string) =>
    setValues({ ...values, [key]: Number(value) });
  const revenue = f.revenue * (1 + values.revenue / 100);
  const expenses =
    f.expenseTotal *
    (1 +
      (values.raw * 0.39 + values.transport * 0.13 + values.labour * 0.2) /
        100);
  const net = revenue - expenses;
  return (
    <>
      <PageHeader
        kicker="Plan before you act"
        title="What-if simulator"
        description="Pressure-test the next decision. Adjust a driver and see the impact on cash instantly."
        action={
          <button
            type="button"
            onClick={() =>
              setValues({ revenue: 0, raw: 0, transport: 0, labour: 0 })
            }
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary"
          >
            <RefreshCw size={14} /> Reset
          </button>
        }
      />
      {f.populated ? (
        <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
          <Card className="p-5 sm:p-6">
            <SectionTitle
              eyebrow="Your levers"
              title="Change the assumptions"
            />
            <div className="space-y-6">
              {[
                ["revenue", "Revenue growth"],
                ["raw", "Raw material cost"],
                ["transport", "Transport cost"],
                ["labour", "Labour cost"],
              ].map(([key, label]) => (
                <div key={key}>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span>{label}</span>
                    <span
                      className={
                        values[key as keyof typeof values] >= 0
                          ? "text-primary"
                          : "text-negative"
                      }
                    >
                      {values[key as keyof typeof values] > 0 ? "+" : ""}
                      {values[key as keyof typeof values]}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={values[key as keyof typeof values]}
                    onChange={(e) =>
                      update(key as keyof typeof values, e.target.value)
                    }
                    className="w-full accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>-20%</span>
                    <span>Base</span>
                    <span>+20%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground">
              <Lightbulb size={16} className="mb-2 text-accent" />
              <b className="text-foreground">Based on your records</b>
              <p className="mt-1 leading-5">
                The base case uses {compact(f.revenue)} in revenue and{" "}
                {compact(f.expenseTotal)} in expenses.
              </p>
            </div>
          </Card>
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric
                label="Projected revenue"
                value={compact(revenue)}
                icon={TrendingUp}
              />
              <Metric
                label="Projected expenses"
                value={compact(expenses)}
                icon={TrendingDown}
                tone="amber"
              />
              <Metric
                label="Net cash flow"
                value={compact(net)}
                icon={Activity}
              />
              <Metric
                label="Projected cash position"
                value={compact(f.currentCash + net)}
                icon={CircleDollarSign}
                tone="blue"
              />
            </div>
            <Card className="p-5">
              <SectionTitle
                eyebrow="Scenario summary"
                title="The impact in plain English"
              />
              <div className="rounded-xl border border-positive/30 bg-positive/10 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles size={17} className="mt-0.5 text-primary" />
                  <p className="text-xs leading-5">
                    This scenario creates <b>{compact(net - f.netCashFlow)}</b>{" "}
                    {net >= f.netCashFlow ? "more" : "less"} cash flow than the
                    current records.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-5">
          <EmptyState
            title="Add data before simulating"
            text="Not enough data yet — add more transactions to generate this insight."
            action="Add an expense"
            onClick={() =>
              toast.info("Use Transactions → Add expense to begin")
            }
          />
        </Card>
      )}
    </>
  );
}

const invoiceSampleVendors = [
  {
    vendor: "Pioneer Paper Mills",
    category: "Raw materials",
    subtotal: 218000,
  },
  {
    vendor: "Morya Logistics",
    category: "Transport & logistics",
    subtotal: 46200,
  },
  { vendor: "Kaveri Polymers", category: "Raw materials", subtotal: 115500 },
];

function InvoicePage() {
  const refresh = useRefreshData();
  const mutation = useCreateInvoice();
  const [file, setFile] = useState(false);
  const [saved, setSaved] = useState(false);
  const [extracted, setExtracted] = useState<{
    vendor: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    subtotal: number;
    gst: number;
    category: string;
  } | null>(null);

  const chooseFile = () => {
    setFile(true);
    setSaved(false);
    const sample =
      invoiceSampleVendors[
        Math.floor(Math.random() * invoiceSampleVendors.length)
      ];
    const invoiceDate = new Date().toISOString().slice(0, 10);
    const due = new Date();
    due.setDate(due.getDate() + 30);
    setExtracted({
      vendor: sample.vendor,
      invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
      invoiceDate,
      dueDate: due.toISOString().slice(0, 10),
      subtotal: sample.subtotal,
      gst: Math.round(sample.subtotal * 0.18),
      category: sample.category,
    });
  };
  const updateField = <K extends keyof NonNullable<typeof extracted>>(
    key: K,
    value: NonNullable<typeof extracted>[K],
  ) =>
    setExtracted((current) =>
      current ? { ...current, [key]: value } : current,
    );

  const total = extracted ? extracted.subtotal + extracted.gst : 0;

  const save = () => {
    if (!extracted) return;
    mutation.mutate(
      {
        data: {
          vendor: extracted.vendor,
          invoiceNumber: extracted.invoiceNumber,
          invoiceDate: extracted.invoiceDate,
          dueDate: extracted.dueDate,
          subtotal: extracted.subtotal,
          gst: extracted.gst,
          total,
          category: extracted.category,
          status: "Reviewed",
        },
      },
      {
        onSuccess: () => {
          refresh();
          setSaved(true);
          toast.success("Invoice saved");
        },
        onError: () => toast.error("Could not save invoice"),
      },
    );
  };
  return (
    <>
      <PageHeader
        kicker="Reduce data entry"
        title="Invoice intelligence"
        description="Drop in an invoice and FinSight extracts the fields that matter, ready for your review."
      />
      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Card className="p-6">
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Step 1
            </div>
            <h2 className="mt-1 font-display text-xl font-semibold">
              Upload an invoice
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, JPG or PNG · up to 10 MB
            </p>
          </div>
          <label
            className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed ${file ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:border-primary/50"}`}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={chooseFile}
            />
            <span className="grid size-14 place-items-center rounded-2xl bg-positive/15 text-positive">
              <CloudUpload size={26} />
            </span>
            <div className="mt-4 text-sm font-semibold">
              {file ? "Invoice selected" : "Choose a file or drag it here"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {file
                ? "Ready for review"
                : "Extraction is simulated for this demo"}
            </div>
          </label>
          <button
            type="button"
            disabled={!file}
            onClick={() => {
              chooseFile();
              toast.success("Details extracted for review");
            }}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {file ? "Re-run extraction" : "Upload to continue"}
          </button>
        </Card>
        <Card className="p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Step 2
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold">
                Review extracted details
              </h2>
            </div>
            {file && (
              <Pill tone="green">
                <Check size={12} /> 98% confidence
              </Pill>
            )}
          </div>
          {file && extracted ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Vendor">
                  <input
                    className="form-input"
                    value={extracted.vendor}
                    onChange={(e) => updateField("vendor", e.target.value)}
                  />
                </Field>
                <Field label="Invoice number">
                  <input
                    className="form-input"
                    value={extracted.invoiceNumber}
                    onChange={(e) =>
                      updateField("invoiceNumber", e.target.value)
                    }
                  />
                </Field>
                <Field label="Invoice date">
                  <input
                    type="date"
                    className="form-input"
                    value={extracted.invoiceDate}
                    onChange={(e) => updateField("invoiceDate", e.target.value)}
                  />
                </Field>
                <Field label="Due date">
                  <input
                    type="date"
                    className="form-input"
                    value={extracted.dueDate}
                    onChange={(e) => updateField("dueDate", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Category">
                <select
                  className="form-input"
                  value={extracted.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option>Raw materials</option>
                  <option>Transport & logistics</option>
                  <option>Labour & wages</option>
                  <option>Utilities & overheads</option>
                  <option>Other overheads</option>
                </select>
              </Field>
              <div className="rounded-xl bg-muted p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <input
                    type="number"
                    className="form-input w-32 text-right"
                    value={extracted.subtotal}
                    onChange={(e) =>
                      updateField("subtotal", Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">GST</span>
                  <input
                    type="number"
                    className="form-input w-32 text-right"
                    value={extracted.gst}
                    onChange={(e) =>
                      updateField("gst", Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-bold">
                  <span>Total</span>
                  <span>{inr(total)}</span>
                </div>
              </div>
              {saved && (
                <div className="text-xs text-primary">
                  Invoice saved to this business workspace.
                </div>
              )}
              <button
                type="button"
                onClick={save}
                disabled={mutation.isPending || saved}
                className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground disabled:opacity-50"
              >
                {saved
                  ? "Saved to workspace"
                  : mutation.isPending
                    ? "Saving…"
                    : "Review & save invoice"}
              </button>
            </div>
          ) : (
            <div className="grid min-h-[260px] place-items-center rounded-2xl bg-muted/35 text-center">
              <div>
                <FileCheck2
                  size={30}
                  className="mx-auto text-muted-foreground/40"
                />
                <p className="mt-3 text-sm font-semibold">
                  Your extracted fields will appear here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Upload an invoice to start the review.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

const copilotQuestions = [
  "Why did expenses increase?",
  "Which vendor costs the most?",
  "What payments are due soon?",
  "How healthy is my cash flow?",
  "What should I review?",
];

type CopilotMessage = {
  role: "user" | "model";
  content: string;
  sources?: string[];
};

function CopilotPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askCopilot = async (nextQuestion: string) => {
    const trimmed = nextQuestion.trim();
    if (!trimmed || loading) return;
    setError("");
    setLoading(true);
    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    try {
      const response = await customFetch<{
        answer: string;
        sources: string[];
      }>("/api/copilot", {
        method: "POST",
        body: JSON.stringify({
          message: trimmed,
          history: messages.map(({ role, content }) => ({ role, content })),
        }),
        responseType: "json",
      });
      setMessages([
        ...nextMessages,
        { role: "model", content: response.answer, sources: response.sources },
      ]);
      setQuestion("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Copilot is temporarily unavailable. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <PageHeader
        kicker="Ask your business"
        title="Business copilot"
        description="A focused view of your financial data, with answers grounded in this workspace."
      />
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden">
          <div className="bg-sidebar px-6 py-8 text-sidebar-foreground sm:px-10">
            <div className="flex items-start gap-4">
              <span className="grid size-11 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
                <Sparkles size={22} />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-sidebar-primary">
                  FinSight copilot
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold">
                  What do you want to understand?
                </h2>
                <p className="mt-2 text-xs text-sidebar-foreground/60">
                  Ask one of the questions below for a concise, data-backed
                  read.
                </p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {copilotQuestions.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => void askCopilot(item)}
                  className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${question === item ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground" : "border-sidebar-border text-sidebar-foreground/75 hover:bg-sidebar-accent"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 sm:p-10">
            <div className="space-y-5">
              {messages.length === 0 && (
                <p className="text-sm leading-7 text-muted-foreground">
                  Ask a question to get a concise, data-backed read on this workspace.
                </p>
              )}
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={message.role === "user" ? "text-sm font-medium" : "text-sm leading-7 text-muted-foreground"}
                >
                  {message.role === "user" ? (
                    <div className="text-foreground">{message.content}</div>
                  ) : (
                    <>
                      <div>{message.content}</div>
                      {message.sources && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.sources.map((source) => (
                            <Pill key={source} tone="blue">{source}</Pill>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
                  <span>Copilot is thinking</span>
                  <span className="animate-pulse">● ● ●</span>
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <form
              className="mt-8 flex gap-2 border-t border-border pt-5"
              onSubmit={(event) => {
                event.preventDefault();
                void askCopilot(question);
              }}
            >
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about your business..."
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                aria-label="Ask Copilot a question"
              />
              <button type="submit" className="btn-glow" disabled={loading}>
                Ask
              </button>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

function ReportsPage() {
  const [exported, setExported] = useState("");
  const [exporting, setExporting] = useState("");
  const data = useBusinessData();
  const { lang } = useLanguage();
  const reports = [
    {
      title: "Monthly management pack",
      text: "Revenue, costs, cash flow and key movements.",
      icon: FileBarChart,
    },
    {
      title: "Receivables aging",
      text: "Customer-wise outstanding and collection status.",
      icon: WalletCards,
    },
    {
      title: "Vendor spend review",
      text: "Spend, terms, variance and concentration.",
      icon: BriefcaseBusiness,
    },
  ];
  const exportReport = async (title: string) => {
    if (exporting) return;
    setExporting(title);
    setExported("");
    try {
      const financials = calculateFinancials(data);
      const document = new jsPDF();
      const generatedAt = new Date();
      const month = generatedAt.toISOString().slice(0, 7);
      const lines = [
        "FinSight - " + title,
        `Business: ${data.business.name}`,
        `Industry: ${data.business.industry}`,
        `Location: ${data.business.location}`,
        `Generated: ${generatedAt.toLocaleDateString("en-IN")}`,
        "",
        `Revenue: ${data.business.currency} ${financials.revenue.toFixed(2)}`,
        `Expenses: ${data.business.currency} ${financials.expenseTotal.toFixed(2)}`,
        `Net cash flow: ${data.business.currency} ${financials.netCashFlow.toFixed(2)}`,
        `Transactions: ${data.transactions.length}`,
        `Receivables: ${data.receivables.length}`,
        `Payables: ${data.payables.length}`,
        `Invoices: ${data.invoices.length}`,
        "",
        "Recent transactions:",
        ...data.transactions.slice(0, 12).map(
          (item) =>
            `${item.date} - ${item.type} - ${item.description} - ${data.business.currency} ${item.amount.toFixed(2)}`,
        ),
      ];
      document.setFontSize(16);
      document.text(lines[0], 14, 18);
      document.setFontSize(10);
      document.text(lines.slice(1), 14, 30);
      document.save(`FinSight-${title.replace(/\s+/g, "-")}-${month}.pdf`);
      setExported(title);
      toast.success(`${t(lang, title)} exported`);
    } catch (error) {
      console.error("PDF export failed", error);
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setExporting("");
    }
  };
  return (
    <>
      <PageHeader
        kicker="Take it with you"
        title="Reports"
        description="Useful summaries for your review, your accountant, or the next supplier conversation."
        action={
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue="2025-03-01"
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="date"
              defaultValue="2025-03-08"
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs"
            />
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.title}
              className="flex flex-col p-5 transition hover:-translate-y-1"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-positive/15 text-positive">
                <Icon size={19} />
              </span>
              <h2 className="mt-5 font-display text-lg font-semibold">
                {report.title}
              </h2>
              <p className="mt-2 flex-1 text-xs leading-5 text-muted-foreground">
                {report.text}
              </p>
              <button
                type="button"
                onClick={() => void exportReport(report.title)}
                disabled={Boolean(exporting)}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold hover:border-primary"
              >
                <Download size={14} />{" "}
                {exporting === report.title
                  ? t(lang, "Generating PDF...")
                  : exported === report.title
                    ? t(lang, "Downloaded")
                    : t(lang, "Export PDF")}
              </button>
            </Card>
          );
        })}
      </div>
      <Card className="mt-6 p-5">
        <SectionTitle
          eyebrow="Workspace records"
          title="What is ready to report"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/40 p-4">
            <div className="text-[10px] text-muted-foreground">
              Transactions
            </div>
            <div className="mt-2 font-display text-2xl font-semibold">
              {data.transactions.length}
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <div className="text-[10px] text-muted-foreground">Receivables</div>
            <div className="mt-2 font-display text-2xl font-semibold">
              {data.receivables.length}
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <div className="text-[10px] text-muted-foreground">Invoices</div>
            <div className="mt-2 font-display text-2xl font-semibold">
              {data.invoices.length}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

function SettingsPage() {
  const data = useBusinessData();
  const refresh = useRefreshData();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [whatsappPhone, setWhatsappPhone] = useState(
    data.business.whatsappPhone ?? "",
  );
  const [whatsappBusy, setWhatsappBusy] = useState(false);

  async function saveWhatsappPhone() {
    setWhatsappBusy(true);
    try {
      const token = await getToken();

const res = await fetch("/api/business/whatsapp-phone", {
  method: "PATCH",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ whatsappPhone }),
});

if (!res.ok) {
  const body = await res.json().catch(() => ({}));
  toast.error(body.error ?? "Couldn't save that number");
  return;
}
      toast.success(
        whatsappPhone
          ? "WhatsApp number connected"
          : "WhatsApp number disconnected",
      );
      refresh();
    } catch {
      toast.error("Couldn't reach the server — check your connection");
    } finally {
      setWhatsappBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        kicker="Make it yours"
        title="Settings"
        description="Company details, workspace preferences and the alerts that keep you informed."
        action={
          saved ? (
            <Pill tone="green">
              <Check size={12} /> Saved
            </Pill>
          ) : (
            <EmptyButton
              icon={Check}
              variant="primary"
              onClick={() => {
                setSaved(true);
                toast.success("Preferences saved");
              }}
            >
              Save changes
            </EmptyButton>
          )
        }
      />
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <Card className="p-5">
          <SectionTitle eyebrow="Workspace" title={data.business.name} />
          <div className="flex items-center gap-3 border-b border-border pb-5">
            <span className="grid size-12 place-items-center rounded-2xl bg-warning/20 font-bold text-warning">
              {data.business.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="text-sm font-semibold">
                {user?.fullName ?? "Workspace owner"}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress ?? "Signed-in account"}
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <Field label="Business name">
              <input
                readOnly
                className="form-input"
                value={data.business.name}
              />
            </Field>
            <Field label="Location">
              <input
                readOnly
                className="form-input"
                value={data.business.location}
              />
            </Field>
            <Field label="Financial year">
              <input
                readOnly
                className="form-input"
                value={data.business.financialYear}
              />
            </Field>
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle
            eyebrow="Quick entry"
            title="Connect WhatsApp"
          />
          <p className="mb-4 text-[11px] text-muted-foreground">
            Link your WhatsApp number so you can log an expense or sale by
            sending a message like "paid 500 for diesel" — no need to open
            the app.
          </p>
          <div className="space-y-4">
            <Field label="Your WhatsApp number">
              <input
                className="form-input"
                placeholder="+919876543210"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
              />
            </Field>
            <div className="flex items-center gap-2">
              <EmptyButton
                icon={Check}
                variant="primary"
                onClick={saveWhatsappPhone}
              >
                {whatsappBusy ? "Saving…" : "Save number"}
              </EmptyButton>
              {data.business.whatsappPhone && (
                <span className="text-[11px] text-muted-foreground">
                  Currently connected: {data.business.whatsappPhone}
                </span>
              )}
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle
            eyebrow="Preferences"
            title="How FinSight speaks to you"
          />
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <div className="text-xs font-semibold">Action alerts</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Show anomaly and due-date reminders.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                aria-label="Toggle action alerts"
                className={`relative h-6 w-11 rounded-full transition ${notifications ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-1 size-4 rounded-full bg-card transition ${notifications ? "left-6" : "left-1"}`}
                />
              </button>
            </label>
            {[
              [
                "Currency format",
                data.business.currency === "INR"
                  ? "Indian Rupee (₹)"
                  : data.business.currency,
              ],
              ["Opening cash", compact(data.business.openingCash)],
              [
                "Monthly revenue target",
                compact(data.business.monthlyRevenueTarget),
              ],
            ].map(([a, b]) => (
              <div
                key={a}
                className="flex items-center justify-between border-b border-border py-3 last:border-0"
              >
                <div className="text-xs font-semibold">{a}</div>
                <span className="text-xs text-muted-foreground">{b}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted">
          <Search size={24} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold">
          That page is not in this workspace
        </h1>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-semibold text-primary"
        >
          Return to overview
        </Link>
      </div>
    </div>
  );
}

function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[440px]">
        <Link
          href="/"
          className="mb-5 flex items-center justify-center gap-2.5"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Activity size={18} />
          </span>
          <span className="font-display text-lg font-bold">FinSight</span>
        </Link>
        {mode === "sign-in" ? (
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            fallbackRedirectUrl={`${basePath}/`}
          />
        ) : (
          <SignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
            fallbackRedirectUrl={`${basePath}/`}
          />
        )}
      </div>
    </div>
  );
}
function HomeGate() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <Loading />;
  return isSignedIn ? <Redirect to="/dashboard" /> : <LandingPage />;
}
function SetupGate() {
  const { isLoaded, isSignedIn } = useUser();
  const bootstrap = useGetBusinessBootstrap({
    query: {
      queryKey: getGetBusinessBootstrapQueryKey(),
      retry: false,
      enabled: isLoaded && Boolean(isSignedIn),
    },
  });
  if (!isLoaded || (isSignedIn && bootstrap.isLoading)) return <Loading />;
  if (!isSignedIn) return <Redirect to="/" />;
  if (bootstrap.data) return <Redirect to="/dashboard" />;
  return <SetupPage />;
}
function ProtectedWorkspace() {
  const { isLoaded, isSignedIn } = useUser();
  const bootstrap = useGetBusinessBootstrap({
    query: {
      queryKey: getGetBusinessBootstrapQueryKey(),
      retry: false,
      enabled: isLoaded && Boolean(isSignedIn),
    },
  });
  if (!isLoaded || (isSignedIn && bootstrap.isLoading)) return <Loading />;
  if (!isSignedIn) return <Redirect to="/" />;
  if (!bootstrap.data) return <Redirect to="/setup" />;
  return (
    <DataContext.Provider value={bootstrap.data}>
      <Shell>
        <ErrorBoundary resetKey={window.location.pathname}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/transactions" component={TransactionsPage} />
            <Route path="/revenue" component={RevenuePage} />
            <Route path="/receivables" component={ReceivablesPage} />
            <Route path="/payables" component={PayablesPage} />
            <Route path="/vendors" component={VendorsPage} />
            <Route path="/analytics" component={AnalyticsPage} />
            <Route path="/forecast" component={ForecastPage} />
            <Route path="/alerts" component={AlertsPage} />
            <Route path="/changes" component={ChangesPage} />
            <Route path="/simulator" component={SimulatorPage} />
            <Route path="/invoice-intelligence" component={InvoicePage} />
            <Route path="/copilot" component={CopilotPage} />
            <Route path="/reports" component={ReportsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
      </Shell>
    </DataContext.Provider>
  );
}
function Loading() {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-background">
      <div className="text-center">
        <div className="mx-auto grid size-12 animate-pulse place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Activity size={22} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your workspace…
        </p>
      </div>
    </div>
  );
}
function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeGate} />
      <Route path="/sign-in/*?" component={() => <AuthPage mode="sign-in" />} />
      <Route path="/sign-up/*?" component={() => <AuthPage mode="sign-up" />} />
      <Route path="/setup" component={SetupGate} />
      <Route component={ProtectedWorkspace} />
    </Switch>
  );
}
function ApiAuthBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(async () => {
      const token = await getToken();
      console.log("FinSight Clerk token available:", Boolean(token));
      return token;
    });

    return () => {
      setAuthTokenGetter(null);
    };
  }, [getToken]);

  return null;
}
function ClerkApp() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ApiAuthBridge />
      <Router />
    </ClerkProvider>
  );
}
function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <ClerkApp />
          </WouterRouter>
        <Toaster />
        <SonnerToaster position="top-right" richColors />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}
export default App;
