import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Progress} from "@/components/ui/progress.jsx";

import NumberTicker from "@/components/magicui/number-ticker.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import {
    ChevronLeft, ChevronRight,
    Copy, CreditCard,
    File,
    Home,
    LineChart,
    ListFilter, MoreVertical,
    Package,
    Package2,
    PanelLeft,
    Search,
    ShoppingCart, Truck,
    Users2
} from "lucide-react";
import {Link, Outlet, Routes} from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import ExpenseTypePieChart from "@/components/chart/ExpenseTypePieChart.jsx";
import ExpenseTypeBarChart from "@/components/chart/ExpenseTypeBarChart.jsx";
import NewExpenseForm from "@/components/NewExpenseForm.jsx";
import {capitalizeFirstLetter, formatMoney} from "@/lib/utils.js";
import axios from "axios";

const MainContent = () => {
    const [username, setUsername] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [weeklyExpenses, setWeeklyExpenses] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);

    const [todayTotal, setTodayTotal] = useState(0);
    const [yesterdayTotal, setYesterdayTotal] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);

    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [weeklyChange, setWeeklyChange] = useState(0);

    const expenseTypeColors = {
        education: "bg-blue-500",
        entertainment: "bg-red-500",
        groceries: "bg-green-500",
        dining: "bg-yellow-500",
        transportation: "bg-purple-500",
        housing: "bg-pink-500",
        health: "bg-indigo-500",
        personal: "bg-teal-500",
        clothing: "bg-orange-500",
        travel: "bg-cyan-500",
        utilities: "bg-lime-500",
        insurance: "bg-amber-500",
        debt: "bg-rose-500",
        savings: "bg-violet-500",
        gifts: "bg-fuchsia-500",
        other: "bg-gray-500"
    };

    useEffect(()=> {
        const storedUsername = localStorage.getItem("username");
        if(storedUsername){ setUsername(capitalizeFirstLetter(storedUsername)); }
    }, []);

    const fetchExpenses = async () => {
        const token = localStorage.getItem("token");
        try{
            const response = await axios.get('http://localhost:5000/api/gettotalbills', {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            const fetchedExpenses = response.data.bills;
            if (Array.isArray(fetchedExpenses)) {
                setExpenses(fetchedExpenses);

                // Filter and sort expenses for the last 7 days
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const filteredWeeklyExpenses = fetchedExpenses
                    .filter(expense => new Date(expense.date) >= sevenDaysAgo)
                    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date from recent to oldest

                setWeeklyExpenses(filteredWeeklyExpenses);

                // Filter and sort expenses for the last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const filteredMonthlyExpenses = fetchedExpenses
                    .filter(expense => new Date(expense.date) >= thirtyDaysAgo)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setMonthlyExpenses(filteredMonthlyExpenses);

                // Calculate today's total expenses
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set the time to the start of the day
                const todayTotalAmount = fetchedExpenses
                    .filter(expense => new Date(expense.date).toDateString() === today.toDateString())
                    .reduce((total, expense) => total + expense.moneySpent, 0);

                setTodayTotal(todayTotalAmount);

                // Calculate yesterday's total expenses
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayTotalAmount = fetchedExpenses
                    .filter(expense => new Date(expense.date).toDateString() === yesterday.toDateString())
                    .reduce((total, expense) => total + expense.moneySpent, 0);

                setYesterdayTotal(yesterdayTotalAmount);

                // Calculate the percentage change
                if (yesterdayTotalAmount > 0) {
                    const change = ((todayTotalAmount - yesterdayTotalAmount) / yesterdayTotalAmount) * 100;
                    setPercentageChange(change);
                } else {
                    setPercentageChange(todayTotalAmount > 0 ? 100 : 0);
                }

                // Calculate this week's total expenses
                const startOfWeek = new Date();
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the week (Sunday)
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to the end of the week (Saturday)

                const thisWeekTotalAmount = fetchedExpenses
                    .filter(expense => new Date(expense.date) >= startOfWeek && new Date(expense.date) <= endOfWeek)
                    .reduce((total, expense) => total + expense.moneySpent, 0);

                setWeeklyTotal(thisWeekTotalAmount);

                // Calculate last week's total expenses
                const startOfLastWeek = new Date(startOfWeek);
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Set to the start of last week
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(endOfLastWeek.getDate() + 6); // Set to the end of last week

                const lastWeekTotalAmount = fetchedExpenses
                    .filter(expense => new Date(expense.date) >= startOfLastWeek && new Date(expense.date) <= endOfLastWeek)
                    .reduce((total, expense) => total + expense.moneySpent, 0);

                // Calculate the percentage change from last week
                let weeklyChange = 0;
                if (lastWeekTotalAmount > 0) {
                    weeklyChange = ((thisWeekTotalAmount - lastWeekTotalAmount) / lastWeekTotalAmount) * 100;
                } else {
                    weeklyChange = thisWeekTotalAmount > 0 ? 100 : 0;
                }
                setWeeklyChange(weeklyChange.toFixed(1));

            } else {
                console.error("Fetched expenses are not an array:", fetchedExpenses);
            }
        } catch (error) {
            console.log('Failed to fetch expenses', error)
        }
    };

    useEffect(() => {
        fetchExpenses();
    })

    return (
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline" className="sm:hidden">
                            <PanelLeft className="h-5 w-5"/>
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link to="#" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                                <Package2 className="h-5 w-5 transition-all group-hover:scale-110"/>
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link to="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <Home className="h-5 w-5"/>
                                Dashboard
                            </Link>
                            <Link to="#" className="flex items-center gap-4 px-2.5 text-foreground">
                                <ShoppingCart className="h-5 w-5"/>
                                Orders
                            </Link>
                            <Link to="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <Package className="h-5 w-5"/>
                                Products
                            </Link>
                            <Link to="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <Users2 className="h-5 w-5"/>
                                Customers
                            </Link>
                            <Link to="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                <LineChart className="h-5 w-5"/>
                                Settings
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="#">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="#">Orders</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Recent Orders</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="overflow-hidden rounded-full"
                        >
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                        <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-3xl mb-1">
                                    { username ? `Welcome, ${username}` : 'Welcome' }
                                </CardTitle>
                                <CardDescription className="max-w-lg text-balance leading-relaxed">
                                    Introducing your dynamic expenses dashboard for Seamless
                                    Management and Insightful Analysis.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex space-x-6">
                                <Button className="border bg-white text-slate-800 hover:bg-slate-800 hover:text-white">Upload Receipt</Button>

                                <Sheet>
                                    <SheetTrigger>
                                        <Button>Add New Expense</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle className="mb-10"></SheetTitle>
                                            <NewExpenseForm />
                                            <SheetDescription>
                                                Click submit to upload your input. Click other places to dismiss.
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>

                                <Button className="bg-white border border-green-600 text-green-600 hover:bg-green-100">Set Target</Button>
                            </CardFooter>
                        </Card>
                        <Card x-chunk="dashboard-05-chunk-1">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex justify-between">
                                    You have spent / daily
                                </CardDescription>
                                <CardTitle className="text-5xl text-red-500 font-bold">
                                    $  <NumberTicker className="text-red-500 font-bold" value={todayTotal} />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground font-bold">
                                    {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}% from yesterday
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Progress value={23.45} aria-label="25% increase"/>
                            </CardFooter>
                        </Card>
                        <Card x-chunk="dashboard-05-chunk-2">
                            <CardHeader className="pb-2">
                                <CardDescription>You have spent / weekly</CardDescription>
                                <CardTitle className="text-5xl font-bold text-red-500">
                                    $ <NumberTicker className="text-red-500" value={weeklyTotal}/>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground font-bold">
                                    {weeklyChange >= 0 ? '+' : ''}{weeklyChange}% from yesterday
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Progress value={12} aria-label="12% increase"/>
                            </CardFooter>
                        </Card>
                    </div>
                    <Tabs defaultValue="total">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="total">Total</TabsTrigger>
                                <TabsTrigger value="week">Week</TabsTrigger>
                                <TabsTrigger value="month">Month</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 gap-1 text-sm"
                                        >
                                            <ListFilter className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only">Filter</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuCheckboxItem checked>
                                            Fulfilled
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Declined
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Refunded
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1 text-sm"
                                >
                                    <File className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only">Export</span>
                                </Button>
                            </div>
                        </div>

                        <TabsContent value="total">
                            <Card x-chunk="dashboard-05-chunk-3">
                                <CardHeader className="px-7">
                                    <CardTitle>Your Expense</CardTitle>
                                    <CardDescription>
                                        All expenses are displayed here.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden sm:table-cell">
                                                    Date
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Type
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Amount
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {expenses.map((expense, index) => (
                                                <TableRow className={index % 2 === 0 ? "bg-accent" : ""} key={index}>
                                                    <TableCell className="hidden md:table-cell">{expense.date}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Badge className={`px-4 ${expenseTypeColors[expense.expenseType]} hover:cursor-pointer`}>{capitalizeFirstLetter(expense.expenseType)}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        {formatMoney(expense.moneySpent)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="week">
                            <Card x-chunk="dashboard-05-chunk-3">
                                <CardHeader className="px-7">
                                    <CardTitle>Your Expense</CardTitle>
                                    <CardDescription>
                                        Recent expense in past 7 days.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden sm:table-cell">
                                                    Date
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Type
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Amount
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {weeklyExpenses.map((expense, index) => (
                                                    <TableRow className={index % 2 === 0 ? "bg-accent" : ""} key={index}>
                                                        <TableCell className="hidden md:table-cell">
                                                            {expense.date}
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Badge className={`px-4 ${expenseTypeColors[expense.expenseType]} hover:cursor-pointer`}>
                                                                {capitalizeFirstLetter(expense.expenseType)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">{formatMoney(expense.moneySpent)}</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="month">
                            <Card x-chunk="dashboard-05-chunk-3">
                                <CardHeader className="px-7">
                                    <CardTitle>Your Expense</CardTitle>
                                    <CardDescription>
                                        Recent expense in past 30 days.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden sm:table-cell">
                                                    Date
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Type
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Amount
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                monthlyExpenses.map((expense, index) => (
                                                <TableRow className={index % 2 === 0 ? "bg-accent" : ""} key={index}>
                                                    <TableCell className="hidden md:table-cell">
                                                        {expense.date}
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Badge className={`px-4 ${expenseTypeColors[expense.expenseType]} hover:cursor-pointer`}>
                                                            {capitalizeFirstLetter(expense.expenseType)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">{formatMoney(expense.moneySpent)}</TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="space-y-6">
                    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                        <ExpenseTypeBarChart />
                    </Card>
                    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                        <ExpenseTypePieChart />
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default MainContent;