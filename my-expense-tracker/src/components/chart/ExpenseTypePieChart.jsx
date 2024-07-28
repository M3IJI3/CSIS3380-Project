"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import {Cell, Label, Pie, PieChart} from "recharts"

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

const ExpenseTypePieChart = ( {data} ) => {
    const totalAmount = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.amount, 0)
    }, [data])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0 mb-5">
                <CardTitle>Expense Types Pie Chart</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[350px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Pie
                            data={data}
                            dataKey="amount"
                            nameKey="type"
                            innerRadius={60}
                            outerRadius={120}
                            fill="#8884d8"
                            paddingAngle={5}
                            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell className="hover:cursor-pointer" key={`cell-${index}`} fill={expenseTypeColors[entry.type]} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalAmount.toFixed(0).toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Amount($)
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total expense amount for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}

export default ExpenseTypePieChart
