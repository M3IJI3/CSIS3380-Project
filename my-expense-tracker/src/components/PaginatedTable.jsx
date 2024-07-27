import React, { useState, useEffect } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {capitalizeFirstLetter, formatMoney} from "@/lib/utils.js";

const PaginatedTable = ({ data = [] }) => {
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

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [paginatedData, setPaginatedData] = useState([]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        setPaginatedData(data.slice(startIndex, endIndex));
    }, [currentPage, data, recordsPerPage]);

    const totalPages = Math.ceil(data.length / recordsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
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
                    {paginatedData.map((expense, index) => (
                        <TableRow className={index % 2 === 0 ? "bg-accent" : ""} key={index}>
                            <TableCell className="hidden md:table-cell">{expense.date}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge className={`px-4 align-middle ${expenseTypeColors[expense.expenseType]} hover:cursor-pointer`}>{capitalizeFirstLetter(expense.expenseType)}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                {formatMoney(expense.moneySpent)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious className="hover:cursor-pointer" onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink className="hover:cursor-pointer" onClick={() => handlePageChange(i + 1)}>{i + 1}</PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext className="hover:cursor-pointer" onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}

export default  PaginatedTable;