/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, {
    useEffect,
    useState
} from "react"
import {
    toast,
    Toaster
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    cn
} from "@/lib/utils"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import axios from "axios"
import { useParams } from "next/navigation"

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    brand: z.string(),
    spec: z.string().nullable().optional(),
    price: z
        .string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val), { message: "El precio debe ser un número válido" }),
    stock: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), { message: "El stock debe ser un número válido" }),
});

export default function EditProduct() {
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const form = useForm({
        resolver: zodResolver(formSchema),
    })

    useEffect(() => {
        setLoading(true)
        axios.get('https://backend-zhls.onrender.com/products/' + params.id).then(e => {
            form.reset({ ...e.data, price: String(e.data.price), stock: String(e.data.stock) })
            setLoading(false)
        })

        return () => { }
    }
        , [params.id])



    async function onSubmit(values) {
        try {
            setLoading(true)
            await axios.put('https://backend-zhls.onrender.com/products/' + params.id, {
                ...values
            })
            setLoading(false)
            toast.success('Editado correctamente')
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }


    return (
        <>
            <Toaster />
            {loading ? <p>cargando...</p> : null}
            {loading === false && <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del producto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type=""
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripcion</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type=""
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type=""
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="spec"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type=""
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        {...field}
                                        type="number"

                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type="number"
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Editar</Button>
                </form>
            </Form>}
        </>

    )
}