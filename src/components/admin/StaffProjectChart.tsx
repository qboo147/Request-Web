import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, ResponsiveContainer, Legend } from "recharts";
import { useWindowSize } from "@/components/shared/WindowSize";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/redux.config";

export function StaffProjectChart() {
    const { areaChartData } = useSelector((state: RootState) => state.dashboard);

    const size = useWindowSize();
    const getAspect = () => {
        if (size.width > 1200) return 8;
        if (size.width > 992) return 6;
        return 2;
    };

    return (
        <div className="bg-white shadow-lg p-4 pt-6">
            <h3 className="text-center mb-4">STAFFS AND PROJECTS</h3>
            <ResponsiveContainer width="100%" aspect={getAspect()}>
                <AreaChart data={areaChartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="staff" stackId="1" stroke="hsl(var(--chart-staff))" fill="hsl(var(--chart-staff))" />
                    <Area type="monotone" dataKey="projects" stackId="1" stroke="hsl(var(--chart-projects))" fill="hsl(var(--chart-projects))" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
