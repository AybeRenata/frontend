"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Delete, DeleteIcon, Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import axios from "axios"

const data = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@yahoo.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@gmail.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@gmail.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@gmail.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@hotmail.com",
    },
]



export const columns = [

    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },

    {
        accessorKey: "description",
        header: "Descripcion",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "brand",
        header: "Marca",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("brand")}</div>
        ),
    },
    {
        accessorKey: "spec",
        header: "Categoria",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("spec")}</div>
        ),
    },
    {
        accessorKey: "price",
        header: "Precio",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("price")}</div>
        ),
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("stock")}</div>
        ),
    },
    {
        accessorKey: "edit",
        header: "Editar",
        cell: ({ row }) => (
            <Link href={'/products/edit/' + row.original.id}>
                <div className="capitalize"><Edit /></div>
            </Link>
        ),
    },
]

export default function Products() {
    const [data, setData] = React.useState([])
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState(
        []
    )
    const [loading, setLoading] = React.useState(true)
    const [columnVisibility, setColumnVisibility] =
        React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})

    const deleteProduct = async (id) => {
        axios.delete('https://backend-zhls.onrender.com/products/' + id).then((e) => { setData(data.filter(doc => doc.id !== id)); setLoading(false) })
    }

    React.useEffect(() => {
        setLoading(true)
        axios.get('https://backend-zhls.onrender.com/products').then((e) => { setData(e.data); setLoading(false) })
    }, [])

    const deleteColumn = {
        accessorKey: "delete",
        header: "Eliminar",
        cell: ({ row }) => (
            <div onClick={() => deleteProduct(row.original.id)} className="flex justify-center">
                <Trash />
            </div>
        ),
    }

    const table = useReactTable({
        data,
        columns: [...columns, deleteColumn],
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Link href="/products/add"><Button> Agregar producto</Button></Link>

            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : loading ?
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    cargando...
                                </TableCell>
                            </TableRow>
                            : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}
