"use client"

import { TrendingUp } from "lucide-react"
import {Bar, BarChart, Cell, XAxis, YAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useEffect, useState} from "react";

const expenseTypeColors = {
    education: "#3b82f6", // blue-500
    entertainment: "#ef4444", // red-500
    groceries: "#10b981", // green-500
    dining: "#f59e0b", // yellow-500
    transportation: "#8b5cf6", // purple-500
    housing: "#ec4899", // pink-500
    health: "#6366f1", // indigo-500
    clothing: "#f97316", // orange-500
    travel: "#06b6d4", // cyan-500
    utilities: "#84cc16", // lime-500
    insurance: "#f59e0b", // amber-500
    debt: "#f43f5e", // rose-500
    investments: "#8b5cf6", // violet-500
    gifts: "#d946ef", // fuchsia-500
    other: "#6b7280" // gray-500
};

const chartConfig = {
    amount: {
        label: "Amount($)",
    },
    education: {
        label: "Education",
        color: "#3b82f6",
    },
    entertainment: {
        label: "Entertainment",
        color: "#ef4444",
    },
    groceries: {
        label: "Groceries",
        color: "#10b981",
    },
    dining: {
        label: "Dining Out",
        color: "#f59e0b",
    },
    transportation: {
        label: "Transportation",
        color: "#8b5cf6",
    },
    housing: {
        label: "Housing",
        color: "#ec4899",
    },
    health: {
        label: "Health and Wellness",
        color: "#6366f1",
    },
    clothing: {
        label: "Clothing and Accessories",
        color: "#f97316",
    },
    travel: {
        label: "Travel",
        color: "#06b6d4",
    },
    utilities: {
        label: "Utilities",
        color: "#84cc16",
    },
    insurance: {
        label: "Insurance",
        color: "#f59e0b",
    },
    debt: {
        label: "Debt Payments",
        color: "#f43f5e",
    },
    investments: {
        label: "Investments",
        color: "#8b5cf6",
    },
    gifts: {
        label: "Gifts and Donations",
        color: "#d946ef",
    },
    other: {
        label: "Other",
        color: "#6b7280",
    },
};


const ExpenseTypeBarChart = ( {data} ) =>{
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if(data && data.length > 0){
            const sortedData = [...data].sort((a,b) => b.amount - a.amount);
            const topFiveData = sortedData.slice(0,5);

            const coloredData = topFiveData.map(item => ({
                ...item,
                fill: expenseTypeColors[item.type] || "#6b7280"
            }));

            setChartData(coloredData)
        }
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 5 Expense Types </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{left: 10}}
                    >
                        <YAxis
                            dataKey="type"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => chartConfig[value]?.label}
                        />
                        <XAxis dataKey="amount" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content= {<ChartTooltipContent />}
                        />
                        <Bar className="hover:cursor-pointer" dataKey="amount" layout="vertical" radius={5}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total amount for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}

export default ExpenseTypeBarChart