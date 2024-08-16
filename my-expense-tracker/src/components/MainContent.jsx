import React, {useCallback, useEffect, useState} from 'react';
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
    ShoppingCart, TrendingUp, TrendingDown,
    Users2, ArrowDown, ArrowDown01Icon, ArrowDownToDot
} from "lucide-react";
import {Link, Outlet, Routes} from "react-router-dom";
import {Input} from "@/components/ui/input.jsx";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import ExpenseTypePieChart from "@/components/chart/ExpenseTypePieChart.jsx";
import ExpenseTypeBarChart from "@/components/chart/ExpenseTypeBarChart.jsx";
import NewExpenseForm from "@/components/NewExpenseForm.jsx";
import {capitalizeFirstLetter, formatMoney} from "@/lib/utils.js";
import axios from "axios";
import PaginatedTable from "@/components/PaginatedTable.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import logo from "@/assets/coin-icon.svg";
import UploadReceiptForm from "@/components/UploadReceiptForm.jsx";
import * as XLSX from 'xlsx';

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

    const [loading, setLoading] = useState(true); // Add loading state

    // used for filter search
    const [sortType, setSortType] = useState(null);
    const [checkedItems, setCheckedItems] = useState({
        date_latest: false,
        date_oldest: false,
        amount_decreased: false,
        amount_increased: false
    });

    useEffect(()=> {
        const storedUsername = localStorage.getItem("username");
        if(storedUsername){ setUsername(capitalizeFirstLetter(storedUsername)); }
    }, []);

    const fetchExpenses = useCallback(async () => {
        const token = localStorage.getItem("token");
        try{
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await axios.get('http://localhost:5001/api/gettotalbills', {
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
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)); // Set to the start of the week (Monday)
                startOfWeek.setHours(0, 0, 0, 0); // Set to the start of the day

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the end of the week (Sunday)
                endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

                const thisWeekTotalAmount = fetchedExpenses
                    .filter(expense => new Date(expense.date) >= startOfWeek && new Date(expense.date) <= endOfWeek)
                    .reduce((total, expense) => total + expense.moneySpent, 0);

                setWeeklyTotal(thisWeekTotalAmount);

                // Calculate last week's total expenses
                const startOfLastWeek = new Date(startOfWeek);
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Set to the start of last week
                startOfLastWeek.setHours(0, 0, 0, 0); // Set to the start of the day

                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Set to the end of last week
                endOfLastWeek.setHours(23, 59, 59, 999); // Set to the end of the day

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
        } finally {
            setLoading(false); // set loading to false when fetch is completed
        }
    },[]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses])

    // Calculate the amount of each expense type
    const expenseTypeData = expenses.reduce((acc, expense) => {
        const { expenseType, moneySpent } = expense;
        if (!acc[expenseType]) {
            acc[expenseType] = { type: expenseType, amount: 0 };
        }
        acc[expenseType].amount += moneySpent;
        return acc;
    }, {});
    // Convert to array
    const chartData = Object.values(expenseTypeData);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    };

    // Filter Search
    const sortExpenses = (expenses, type) => {
        switch (type) {
            case 'date_latest':
                return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date_oldest':
                return expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'amount_decreased':
                return expenses.sort((a, b) => b.moneySpent - a.moneySpent);
            case 'amount_increased':
                return expenses.sort((a, b) => a.moneySpent - b.moneySpent);
            default:
                return expenses;
        }
    };
    const sortedExpenses = sortExpenses([...expenses], sortType);
    const sortedWeeklyExpenses = sortExpenses([...weeklyExpenses], sortType);
    const sortedMonthlyExpenses = sortExpenses([...monthlyExpenses], sortType);

    const handleSortTypeChange = (type) => {
        setCheckedItems(prevState => {
            const newState = {
                date_latest: false,
                date_oldest: false,
                amount_decreased: false,
                amount_increased: false,
                [type]: !prevState[type]
            };

            setSortType(newState[type] ? type : '');
            return newState;
        });
    };

    // Export expenses to CSV
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(expenses);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
        XLSX.writeFile(workbook, 'expenses.xlsx');
    };

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
                                Home
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

                <div className="hidden md:flex text-3xl text-slate-800 hover:cursor-pointer">
                    <img src={logo} alt="logo" className="mr-2"/>
                    <h1 className="font-sans mt-1">Expense</h1>
                    <h1 className="font-sans font-bold mt-1">Tracker</h1>
                </div>

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
                        <Button variant="outline" size="icon" className="overflow-hidden rounded-full"></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <Link to="/" onClick={handleLogout}>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </Link>
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
                                <Sheet>
                                    <SheetTrigger>
                                        <Button className="border bg-white text-slate-800 hover:bg-slate-800 hover:text-white">Upload Receipt</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle className="mb-10"></SheetTitle>
                                                <UploadReceiptForm fetchExpenses={ fetchExpenses } />
                                            <SheetDescription>
                                                Click submit to upload your input. Click other places to dismiss.
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>

                                <Sheet>
                                    <SheetTrigger>
                                        <Button>Add New Expense</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle className="mb-10"></SheetTitle>
                                            <NewExpenseForm fetchExpenses={ fetchExpenses } />
                                            <SheetDescription>
                                                Click submit to upload your input. Click other places to dismiss.
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </CardFooter>
                        </Card>
                        <Card x-chunk="dashboard-05-chunk-1">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex justify-between">
                                    { (loading) ? <Skeleton className={'w-[100px] h-[20px] rounded-full'} />  :  "You have spent / daily"  }
                                </CardDescription>
                                <CardTitle className="text-5xl font-bold">
                                    {loading ? ( <Skeleton className="w-[200px] h-[50px] rounded-full" /> ) : ( <span> $ <NumberTicker className="font-bold" value={todayTotal === 0 ? 0 : todayTotal} /></span>)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="w-[250px] h-[15px] rounded-full" /> ) :
                                    (<div className="text-s text-muted-foreground flex">
                                        {percentageChange >= 0 ? <TrendingUp className="mr-1 text-red-600" /> : <TrendingDown className="mr-1 text-green-600" /> }
                                        {Math.abs(percentageChange.toFixed(2))}% from yesterday
                                    </div>)}
                            </CardContent>
                            <CardFooter>
                                {loading ? <Skeleton className="w-full h-[15px] rounded-full" /> : (<Progress value={23.45} aria-label="25% increase"/>)}
                            </CardFooter>
                        </Card>
                        <Card x-chunk="dashboard-05-chunk-2">
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    { loading ? <Skeleton className={'w-[100px] h-[20px] rounded-full'} />  :  "You have spent / weekly"  }
                                </CardDescription>
                                <CardTitle className="text-5xl font-bold">
                                    {loading ? ( <Skeleton className="w-[200px] h-[50px] rounded-full" /> ) : ( <span> $ <NumberTicker className="font-bold" value={weeklyTotal} /></span>)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {
                                    loading ? (
                                        <Skeleton className="w-[250px] h-[15px] rounded-full" /> ) :
                                    (
                                        <div className="text-s text-muted-foreground flex">
                                            {weeklyChange >= 0 ? <TrendingUp className="mr-1 text-red-600" /> : <TrendingDown className="mr-1 text-green-600" /> }
                                            {Math.abs(weeklyChange).toFixed(1)}% from last week
                                        </div>
                                    )
                                }
                            </CardContent>
                            <CardFooter>
                                {loading ? <Skeleton className="w-full h-[15px] rounded-full" /> : (<Progress value={12} aria-label="12% increase"/>)}
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
                                        <DropdownMenuCheckboxItem checked={checkedItems.date_latest} onClick={() => handleSortTypeChange('date_latest')}>
                                            Date latest
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem checked={checkedItems.date_oldest} onClick={() => handleSortTypeChange('date_oldest')}>
                                            Date oldest
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem checked={checkedItems.amount_decreased} onClick={() => handleSortTypeChange('amount_decreased')}>
                                            Amount decreased
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem checked={checkedItems.amount_increased} onClick={() => handleSortTypeChange('amount_increased')}>
                                            Amount increased
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 gap-1 text-sm"
                                        >
                                            <File className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only">Export</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Export to</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuCheckboxItem onClick={handleExportExcel}>
                                            Excel (.xlsx)
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <TabsContent value="total">
                            <Card x-chunk="dashboard-05-chunk-3">
                                <CardHeader className="px-7">
                                    <CardTitle>
                                        {loading ? <Skeleton className="w-[150px] h-[30px] rounded-full" /> : "Your Expense"}
                                    </CardTitle>
                                    <CardDescription>
                                        {loading ? <Skeleton className="w-[250px] h-[15px] rounded-full" /> : "All expenses are displayed here."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ?
                                        <span>
                                            <Skeleton className="w-full h-[400px] rounded-xl" />
                                            <Skeleton className="mt-5 mx-auto w-[250px] h-[25px] rounded-full" />
                                        </span>
                                        : <PaginatedTable data={sortedExpenses} /> }
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
                                    <PaginatedTable data={sortedWeeklyExpenses} />
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
                                    <PaginatedTable data={sortedMonthlyExpenses} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="space-y-6">
                    <Card className="overflow-hidden border-0" x-chunk="dashboard-05-chunk-4">
                        { loading ?
                            <div className="space-y-5 mb-5">
                                <Skeleton className="ms-10 mt-5 w-[150px] h-[40px] rounded-full" />
                                <Skeleton className="ms-10 w-[670px] h-[300px] rounded-xl" />
                                <Skeleton className="ms-10 w-[350px] h-[20px] rounded-full" />
                                <Skeleton className="ms-10 w-[400px] h-[20px] rounded-full" />
                            </div>
                            : <ExpenseTypeBarChart data={chartData} /> }

                    </Card>
                    <Card className="overflow-hidden border-0" x-chunk="dashboard-05-chunk-4">
                        { loading ?
                            <div className="space-y-5 mb-5">
                                <Skeleton className="mx-auto mt-5 w-[300px] h-[40px] rounded-full" />
                                <Skeleton className="ms-10 w-[670px] h-[300px] rounded-xl" />
                                <Skeleton className="mx-auto w-[350px] h-[20px] rounded-full" />
                                <Skeleton className="mx-auto w-[400px] h-[20px] rounded-full" />
                            </div>
                            : <ExpenseTypePieChart data={chartData} />}

                    </Card>
                </div>
            </main>
        </div>
    );
}

export default MainContent;