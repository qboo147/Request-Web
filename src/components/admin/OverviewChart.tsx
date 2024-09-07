import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";
import { RootState } from "@lib/redux/redux.config";
import { useSelector } from "react-redux";

export function OverviewChart() {
    const { radialChartData, totalClaims } = useSelector((state: RootState) => state.dashboard);

    return (
        <div className="bg-white shadow-lg pb-4 rounded-md">
            <div className="flex justify-between px-3 shadow-md">
                <h3 className="text-black text-2xl py-2 font-bold">OVERVIEW</h3>
            </div>
            <div className="h-[380px] w-full pt-8">
                <ResponsiveContainer>
                    <RadialBarChart
                        cx="50%"
                        cy="42%"
                        innerRadius="40%"
                        outerRadius="100%"
                        barSize={15}
                        startAngle={-90}
                        endAngle={270}
                        data={radialChartData}
                    >
                        <RadialBar
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            dataKey="value"
                        />
                        <text x={"50%"} y={"39%"} textAnchor="middle" dominantBaseline="central" className="label-top" fontSize={25} fontWeight="bold" fill="#333">
                            {totalClaims}
                        </text>
                        <text x={"50%"} y={"46%"} textAnchor="middle" dominantBaseline="central" className="label-bottom" fontSize={15} fill="#666">
                            Claims
                        </text>
                        <Legend
                            iconSize={10}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}