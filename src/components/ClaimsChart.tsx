import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  clearMessages,
} from "@/lib/redux/reducers/claims.reducer";
import { getDashboardData } from "@/lib/redux/reducers/dashboard.reducer";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Label, Pie, PieChart } from "recharts";

export const chartConfig = {
  claims: {
    label: "Claims",
  },
  draft: {
    label: "Draft",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-3))",
  },
  paid: {
    label: "Paid",
    color: "hsl(var(--chart-4))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-5))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export default function ClaimsChart() {
  const dispatch: AppDispatch = useDispatch();
  const { error, message, totalClaims } = useSelector(
    (state: RootState) => state.claim
  );

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [error, message, dispatch]);

  return (
    <ChartContainer className="mx-auto aspect-square" config={chartConfig}>
      <PieChart>
        <Pie
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          labelLine={false}
          label
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    textAnchor="middle"
                    dominantBaseline={"middle"}
                    x={viewBox.cx}
                    y={viewBox.cy}
                  >
                    <tspan
                      className="fill-foreground text-3xl font-bold"
                      x={viewBox.cx}
                      y={viewBox.cy}
                    >
                      {totalClaims.toLocaleString()}
                    </tspan>
                    <tspan
                      className="fill-muted-foreground"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                    >
                      Claims
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
      </PieChart>
    </ChartContainer>
  );
}
