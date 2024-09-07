import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@components/ui/chart";
import { useWindowSize } from "@/components/shared/WindowSize";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/redux.config";

export function WaitingChart() {
    const { barChartData } = useSelector((state: RootState) => state.dashboard);

    const size = useWindowSize();
    const getAspect = () => {
        if (size.width > 1200) return 3.55;
        if (size.width > 992) return 1.95;
        return 2;
    };

    return (
        <div className="bg-white shadow-lg p-4 pt-6 rounded-md">
            <h3 className="text-center mb-4">DRAFTING AND PENDING</h3>
            <ResponsiveContainer width="100%" aspect={getAspect()}>
                <ChartContainer config={{ waitingForm: { color: "#82ca9d" } }}>
                    <BarChart width={900} height={450} data={barChartData}>
                        <CartesianGrid strokeDasharray="2" strokeWidth={"3"} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="draft" fill="hsl(var(--chart-draft))" />
                        <Bar dataKey="pending" fill="hsl(var(--chart-pending))" />
                    </BarChart>
                </ChartContainer>
            </ResponsiveContainer>
        </div>
    );
}