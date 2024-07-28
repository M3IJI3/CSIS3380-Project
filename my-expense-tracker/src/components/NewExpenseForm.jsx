"use client"

import React, { useState } from 'react';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const DatePicker = ({date, setDate}) => {
    const handleDateSelected = (selectedDate) => {
        if (selectedDate) {
            const adjustedDate = new Date(selectedDate);
            adjustedDate.setDate(adjustedDate.getDate() + 1);
            setDate(format(adjustedDate, "yyyy-MM-dd"));
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelected}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

const ExpenseTypePicker = ({ expenseType, setExpenseType }) => {
    return (
        <Select value={expenseType} onValueChange={setExpenseType}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Expense Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="dining">Dining Out</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="gifts">Gifts</SelectItem>
                <SelectItem value="other">Other</SelectItem>
            </SelectContent>
        </Select>
    );
}

const NewExpenseForm = ({ fetchExpenses }) => {
    const [formData, setFormData] = useState({
        date: null,
        expenseType: '',
        moneySpent: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "moneySpent" ? Number(value) : value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        console.log(token)

        try {
            const response = await axios.post('http://localhost:5000/api/expenses', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Expense added successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchExpenses();
            // window.location.reload();
        } catch (error) {
            console.error('Failed to submit expense', error);
        }
    }

    const setDate = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            date: date,
        }));
    };

    const setExpenseType = (expenseType) => {
        setFormData((prevData) => ({
            ...prevData,
            expenseType: expenseType,
        }));
    };

    return (
        <div className="flex">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle className="text-2xl">Add New Expense</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group space-y-5">
                                <DatePicker date={formData.date} setDate={setDate}/>
                                <ExpenseTypePicker expenseType={formData.expenseType} setExpenseType={setExpenseType} />
                                <Input placeholder="Money Spent" type="number" id="moneySpent" name="moneySpent" value={formData.moneySpent} onChange={handleChange} />
                            </div>
                            <Button className="w-full mt-5" type="submit">Submit</Button>
                        </form>
                    </div>
            </CardContent>
        </Card>
    </div>
    );
}

export default NewExpenseForm;