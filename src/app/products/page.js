"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


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

    // trae los productos de una tienda
    React.useEffect(() => {
        setLoading(true)
        axios.get('https://backend-zhls.onrender.com/products?store_id=' + 1).then((e) => { setData(e.data); setLoading(false) })
    }, [])

    const deleteColumn = {
        accessorKey: "delete",
        header: "Eliminar",
        cell: ({ row }) => (
            <div onClick={() => deleteProduct(row.original.id)} className="cursor-pointer flex justify-center">
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
    console.log(data)

    return (
        <div className="w-full">
            <div className="flex justify-between items-center py-4">
                <Link href="/products/add"><Button> Agregar producto</Button></Link>
                <Select onValueChange={value => setSorting([{ id: 'price', desc: value === 'max' }])}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="min">Menor precio</SelectItem>
                        <SelectItem value="max">Mayor precio</SelectItem>
                    </SelectContent>
                </Select>
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
