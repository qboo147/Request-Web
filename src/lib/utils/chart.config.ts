import { ChartConfig } from "@/components/ui/chart";

export const radialChartConfig = {
  draft: {
    label: "Draft",
    color: "hsl(var(--chart-draft))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-pending))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-approved))",
  },
  paid: {
    label: "Paid",
    color: "hsl(var(--chart-paid))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-rejected))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-cancelled))",
  },
} satisfies ChartConfig;
